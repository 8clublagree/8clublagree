CREATE TABLE IF NOT EXISTS promo_code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id UUID NULL REFERENCES orders(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_promo_redemption_user_code
  ON promo_code_redemptions (user_id, promo_code_id);

CREATE INDEX IF NOT EXISTS idx_promo_redemption_user
  ON promo_code_redemptions (user_id);

CREATE INDEX IF NOT EXISTS idx_promo_redemption_code
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
  -- 1. Update order status
  UPDATE orders
  SET status = 'SUCCESSFUL', approved_at = NOW()
  WHERE id = p_order_id;

  -- 2. Redeem promo code (if any) with one-use-per-user guarantee
  IF p_discount_code IS NOT NULL AND LENGTH(TRIM(p_discount_code)) > 0 THEN
    SELECT id
    INTO v_promo_code_id
    FROM promo_codes
    WHERE UPPER(code) = UPPER(TRIM(p_discount_code))
      AND LOWER(COALESCE(status, '')) = 'active'
      AND (expiration_date IS NULL OR expiration_date >= NOW())
    LIMIT 1;

    IF v_promo_code_id IS NULL THEN
      RAISE EXCEPTION 'Invalid or expired promo code';
    END IF;

    INSERT INTO promo_code_redemptions (user_id, promo_code_id, order_id, redeemed_at)
    VALUES (p_user_id, v_promo_code_id, p_order_id, NOW())
    ON CONFLICT (user_id, promo_code_id) DO NOTHING;

    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    IF v_rows_affected = 0 THEN
      RAISE EXCEPTION 'Promo code already redeemed by this user';
    END IF;
  END IF;

  -- 3. Expire old package if user has 0 or no credits
  IF p_client_package_id IS NOT NULL AND (p_user_credits = 0 OR p_user_credits IS NULL) THEN
    UPDATE client_packages
    SET status = 'expired', expiration_date = NOW()
    WHERE id = p_client_package_id;
  END IF;

  -- 4. Create new client package
  INSERT INTO client_packages (
    user_id, package_id, status, validity_period,
    package_credits, purchase_date, package_name,
    payment_method, expiration_date,
    is_shareable, shareable_credits, number_of_credits_shared
  ) VALUES (
    p_user_id, p_package_id, 'active', p_validity_period,
    p_package_credits, NOW(), p_package_name,
    p_payment_method, p_expiration_date,
    p_is_shareable, p_shareable_credits, p_number_of_credits_shared
  );

  -- 5. Update user credits
  UPDATE user_credits
  SET credits = p_credits
  WHERE user_id = p_user_id;

  -- 6. Mark trial package as availed if applicable
  IF p_is_trial_package = TRUE THEN
    UPDATE user_profiles
    SET availed_trial_package = TRUE
    WHERE id = p_user_id;
  END IF;
END;
$$;
