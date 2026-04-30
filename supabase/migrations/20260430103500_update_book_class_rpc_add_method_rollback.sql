-- Roll back migration: 20260430103500_update_book_class_rpc_add_method.sql
-- 1) Remove the new overload that includes p_method
-- 2) Restore the previous 9-parameter book_class function

DROP FUNCTION IF EXISTS public.book_class(
  UUID,
  TIMESTAMPTZ,
  UUID,
  BOOLEAN,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  BOOLEAN,
  TEXT
);

CREATE OR REPLACE FUNCTION public.book_class(
  p_class_id UUID,
  p_class_date TIMESTAMPTZ,
  p_booker_id UUID DEFAULT NULL,
  p_is_walk_in BOOLEAN DEFAULT FALSE,
  p_walk_in_first_name TEXT DEFAULT NULL,
  p_walk_in_last_name TEXT DEFAULT NULL,
  p_walk_in_client_email TEXT DEFAULT NULL,
  p_walk_in_client_contact_number TEXT DEFAULT NULL,
  p_deduct_credits BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_taken INT;
  v_available INT;
  v_credits INT;
  v_booking_id UUID;
BEGIN
  SELECT taken_slots, available_slots
    INTO v_taken, v_available
    FROM classes
   WHERE id = p_class_id
     FOR UPDATE;

  IF v_taken IS NULL THEN
    RETURN jsonb_build_object('error', 'Class not found');
  END IF;

  IF v_taken >= v_available THEN
    RETURN jsonb_build_object('error', 'Class is full');
  END IF;

  IF p_deduct_credits AND p_booker_id IS NOT NULL THEN
    UPDATE user_credits
       SET credits = credits - 1
     WHERE user_id = p_booker_id
       AND credits > 0
    RETURNING credits INTO v_credits;

    IF v_credits IS NULL THEN
      RETURN jsonb_build_object('error', 'No credits available');
    END IF;
  END IF;

  INSERT INTO class_bookings (
    class_id, class_date, booker_id, is_walk_in, attendance_status,
    sent_email_reminder,
    walk_in_first_name, walk_in_last_name,
    walk_in_client_email, walk_in_client_contact_number
  )
  VALUES (
    p_class_id, p_class_date, p_booker_id, p_is_walk_in, 'no-show',
    CASE WHEN p_is_walk_in THEN TRUE ELSE FALSE END,
    p_walk_in_first_name, p_walk_in_last_name,
    p_walk_in_client_email, p_walk_in_client_contact_number
  )
  RETURNING id INTO v_booking_id;

  UPDATE classes
     SET taken_slots = taken_slots + 1
   WHERE id = p_class_id;

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'remaining_credits', v_credits
  );
END;
$$;
