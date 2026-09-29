-- A promo code can be redeemed by only one order, regardless of user.
-- Preserve the earliest redemption if older application code allowed duplicates.
WITH ranked_redemptions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY promo_code_id
      ORDER BY redeemed_at ASC, id ASC
    ) AS redemption_number
  FROM promo_code_redemptions
)
DELETE FROM promo_code_redemptions AS redemption
USING ranked_redemptions AS ranked
WHERE redemption.id = ranked.id
  AND ranked.redemption_number > 1;

DROP INDEX IF EXISTS ux_promo_redemption_user_code;

CREATE UNIQUE INDEX IF NOT EXISTS ux_promo_redemption_code
  ON promo_code_redemptions (promo_code_id);

CREATE OR REPLACE FUNCTION confirm_payment(
  p_order_id UUID,
  p_user_id UUID,
  p_credits INT,
  p_user_credits INT,
  p_client_package_id UUID,
  p_package_id UUID,
  p_payment_method TEXT,
  p_package_name TEXT,
  p_validity_period INT,
  p_package_credits INT,
  p_expiration_date TIMESTAMPTZ,
  p_is_shareable BOOLEAN DEFAULT FALSE,
  p_shareable_credits INT DEFAULT 0,
  p_number_of_credits_shared INT DEFAULT 0,
  p_is_trial_package BOOLEAN DEFAULT FALSE,
  p_discount_code TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_promo_code_id UUID;
  v_rows_affected INT;
BEGIN
  -- The transaction rolls this back if any later confirmation step fails.
  UPDATE orders
  SET status = 'SUCCESSFUL', approved_at = NOW()
  WHERE id = p_order_id;

  IF p_discount_code IS NOT NULL AND LENGTH(TRIM(p_discount_code)) > 0 THEN
    -- The code was checked for active status and expiration before the order was
    -- placed. Do not invalidate a pending order while it waits for confirmation.
    SELECT id
    INTO v_promo_code_id
    FROM promo_codes
    WHERE UPPER(TRIM(code)) = UPPER(TRIM(p_discount_code))
    ORDER BY
      CASE WHEN LOWER(TRIM(COALESCE(status, ''))) = 'active' THEN 0 ELSE 1 END,
      expiration_date DESC NULLS LAST,
      id
    LIMIT 1;

    IF v_promo_code_id IS NULL THEN
      RAISE EXCEPTION 'Promo code not found';
    END IF;

    INSERT INTO promo_code_redemptions (user_id, promo_code_id, order_id, redeemed_at)
    VALUES (p_user_id, v_promo_code_id, p_order_id, NOW())
    ON CONFLICT (promo_code_id) DO NOTHING;

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    IF v_rows_affected = 0 THEN
      RAISE EXCEPTION 'Promo code has already been redeemed';
    END IF;
  END IF;

  IF p_client_package_id IS NOT NULL
     AND (p_user_credits = 0 OR p_user_credits IS NULL) THEN
    UPDATE client_packages
    SET status = 'expired', expiration_date = NOW()
    WHERE id = p_client_package_id;
  END IF;

  INSERT INTO client_packages (
    user_id,
    package_id,
    status,
    validity_period,
    package_credits,
    purchase_date,
    package_name,
    payment_method,
    expiration_date,
    is_shareable,
    shareable_credits,
    number_of_credits_shared
  ) VALUES (
    p_user_id,
    p_package_id,
    'active',
    p_validity_period,
    p_package_credits,
    NOW(),
    p_package_name,
    p_payment_method,
    p_expiration_date,
    p_is_shareable,
    p_shareable_credits,
    p_number_of_credits_shared
  );

  UPDATE user_credits
  SET credits = p_credits,
      shareable_credits = p_shareable_credits
  WHERE user_id = p_user_id;

  IF p_is_trial_package = TRUE THEN
    UPDATE user_profiles
    SET availed_trial_package = TRUE
    WHERE id = p_user_id;
  END IF;
END;
$$;
