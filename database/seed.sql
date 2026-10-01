-- MobileMart Seed Data

USE mobilemart_db;

-- 1. Seed Users (Passwords are BCrypt encoded for 'password123')
-- BCrypt hash for 'password123': $2a$10$e8W/2sLkWYFfL1Rz6yG3i.0e5W/3c5l2n6p3X9A1B2C3D4E5F6G7H8
-- We will handle initialization programmatically in Spring Boot DataInitializer to guarantee BCrypt compatibility across JVMs!

-- 2. Seed Brands
INSERT INTO brands (name, logo_url) VALUES 
('Apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100'),
('Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100'),
('OnePlus', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Google', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Nothing', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Vivo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Oppo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Realme', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100'),
('Xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100');

-- 3. Shop Profile
INSERT INTO shop_profile (name, logo_url, description, address, phone, whatsapp_number, opening_hours, google_map_url) VALUES 
('MobileMart Certified Used Phones', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200', 'Your trusted destination for tested, certified, and warranty-backed pre-owned mobile phones. Every phone passes our 40-point quality check!', 'Shop #12, Tech Bazaar Main Road, Downtown City - 500001', '+919876543210', '+919876543210', 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM', 'https://maps.google.com');
