-- Initialize Vercel Postgres Database
-- Run this in Vercel Postgres Query Editor after creating the database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  destination TEXT,
  start_date TEXT,
  end_date TEXT
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  content TEXT
);

-- Seed default users
INSERT INTO users (name, email, password) VALUES 
  ('Test User', 'test@example.com', 'password123'),
  ('Alexis Menares', 'menaresalexis34@gmail.com', '123456')
ON CONFLICT (email) DO NOTHING;
