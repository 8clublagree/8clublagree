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
  p_expiration_date TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- 1. Update order status
  UPDATE orders
  SET status = 'SUCCESSFUL', approved_at = NOW()
  WHERE id = p_order_id;

  -- 2. Expire old package if user has 0 or no credits
  IF p_client_package_id IS NOT NULL AND (p_user_credits = 0 OR p_user_credits IS NULL) THEN
    UPDATE client_packages
    SET status = 'expired', expiration_date = NOW()
    WHERE id = p_client_package_id;
  END IF;

  -- 3. Create new client package
  INSERT INTO client_packages (
    user_id, package_id, status, validity_period,
    package_credits, purchase_date, package_name,
    payment_method, expiration_date
  ) VALUES (
    p_user_id, p_package_id, 'active', p_validity_period,
    p_package_credits, NOW(), p_package_name,
    p_payment_method, p_expiration_date
  );

  -- 4. Update user credits
  UPDATE user_credits
  SET credits = p_credits
  WHERE user_id = p_user_id;
END;
$$;
