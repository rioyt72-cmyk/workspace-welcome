-- Add seats_booked column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN seats_booked integer NOT NULL DEFAULT 1;

-- Add a check constraint to ensure seats_booked is at least 1
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_seats_booked_positive CHECK (seats_booked >= 1);