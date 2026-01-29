-- Add RLS policies for staff role

-- Bookings: Staff can view all bookings
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role));

-- Bookings: Staff can update bookings
DROP POLICY IF EXISTS "Staff can update bookings" ON public.bookings;
CREATE POLICY "Staff can update bookings"
ON public.bookings
FOR UPDATE
USING (has_role(auth.uid(), 'staff'::app_role));

-- Profiles: Staff can view all profiles
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role));

-- Cars: Staff can manage cars
DROP POLICY IF EXISTS "Staff can manage cars" ON public.cars;
CREATE POLICY "Staff can manage cars"
ON public.cars
FOR ALL
USING (has_role(auth.uid(), 'staff'::app_role));

-- Contact messages: Staff can view and update
DROP POLICY IF EXISTS "Staff can view contact messages" ON public.contact_messages;
CREATE POLICY "Staff can view contact messages"
ON public.contact_messages
FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role));

DROP POLICY IF EXISTS "Staff can update contact messages" ON public.contact_messages;
CREATE POLICY "Staff can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (has_role(auth.uid(), 'staff'::app_role));

-- Reviews: Staff can manage reviews
DROP POLICY IF EXISTS "Staff can manage reviews" ON public.reviews;
CREATE POLICY "Staff can manage reviews"
ON public.reviews
FOR ALL
USING (has_role(auth.uid(), 'staff'::app_role));