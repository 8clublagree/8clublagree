-- =============================================================
-- Atomic booking RPC: replaces 3-4 sequential API round-trips
-- with a single database call that handles availability check,
-- booking insert, slot increment, and optional credit deduction
-- all within one transaction with row-level locking.
-- =============================================================

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
  -- Lock the class row to prevent race conditions on the last slot
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

  -- Deduct credits first (if requested) so we fail early on insufficient credits
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

  -- Insert the booking record
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

  -- Increment taken_slots
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


-- =============================================================
-- Indexes for the most frequently hit queries
-- =============================================================

-- Classes by date range (bookings page, admin dashboard, class management)
CREATE INDEX IF NOT EXISTS idx_classes_class_date
  ON classes (class_date);

-- Class bookings by booker (user dashboard, booking history)
CREATE INDEX IF NOT EXISTS idx_class_bookings_booker_id
  ON class_bookings (booker_id);

-- Class bookings by class (attendee lookups)
CREATE INDEX IF NOT EXISTS idx_class_bookings_class_id
  ON class_bookings (class_id);

-- Orders by user + status (initialize-user pending payment check)
CREATE INDEX IF NOT EXISTS idx_orders_user_status
  ON orders (user_id, status);

-- Client packages by user + status (active package lookup)
CREATE INDEX IF NOT EXISTS idx_client_packages_user_status
  ON client_packages (user_id, status);

-- Email reminders: bookings that still need reminders sent
CREATE INDEX IF NOT EXISTS idx_class_bookings_reminder
  ON class_bookings (class_date, sent_email_reminder)
  WHERE sent_email_reminder = FALSE;
