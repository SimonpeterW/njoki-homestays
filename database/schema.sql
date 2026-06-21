-- Units Table
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  location TEXT NOT NULL,
  image TEXT,
  amenities TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(20) UNIQUE,
  unit_id INTEGER NOT NULL,
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  total_price NUMERIC(10, 2),
  special_requests TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  unit_id INTEGER NOT NULL,
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- Create Indexes
CREATE INDEX idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_reference ON bookings(reference_number);
CREATE INDEX idx_reviews_unit_id ON reviews(unit_id);
CREATE INDEX idx_units_location ON units(location);

-- Add Unique Constraint for Bookings
CREATE UNIQUE INDEX idx_unique_booking_period 
ON bookings(unit_id, check_in_date, check_out_date) 
WHERE status = 'confirmed';
