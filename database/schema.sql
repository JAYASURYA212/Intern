-- MobileMart Database Schema for MySQL

CREATE DATABASE IF NOT EXISTS mobilemart_db;
USE mobilemart_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    logo_url VARCHAR(255)
);

-- 3. Shop Profile Table
CREATE TABLE IF NOT EXISTS shop_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    opening_hours VARCHAR(100),
    google_map_url VARCHAR(500)
);

-- 4. Products / Inventory Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    variant VARCHAR(50),
    storage VARCHAR(20) NOT NULL,
    ram VARCHAR(20),
    color VARCHAR(30),
    
    overall_condition VARCHAR(30) NOT NULL,
    battery_health VARCHAR(10),
    display_condition VARCHAR(100),
    body_condition VARCHAR(100),
    camera_condition VARCHAR(100),
    speaker_condition VARCHAR(100),
    charging_condition VARCHAR(100),
    network_condition VARCHAR(100),
    
    box_included BOOLEAN DEFAULT FALSE,
    charger_included BOOLEAN DEFAULT FALSE,
    cable_included BOOLEAN DEFAULT FALSE,
    bill_included BOOLEAN DEFAULT FALSE,
    case_included BOOLEAN DEFAULT FALSE,
    earphones_included BOOLEAN DEFAULT FALSE,
    
    original_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2) NOT NULL,
    is_negotiable BOOLEAN DEFAULT FALSE,
    
    warranty_available BOOLEAN DEFAULT FALSE,
    warranty_months INT DEFAULT 0,
    warranty_type VARCHAR(50),
    warranty_start_date DATE,
    warranty_end_date DATE,
    
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    is_featured BOOLEAN DEFAULT FALSE,
    featured_video_url VARCHAR(500),
    is_deal BOOLEAN DEFAULT FALSE,
    deal_old_price DECIMAL(10, 2),
    deal_new_price DECIMAL(10, 2),
    
    views_count INT DEFAULT 0,
    imei1 VARCHAR(50),
    imei2 VARCHAR(50),
    purchase_source VARCHAR(100),
    purchase_date DATE,
    internal_stock_id VARCHAR(50),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    product_id BIGINT NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    message TEXT NOT NULL,
    reply_message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 8. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(20),
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 9. Customer Sell Requests Table
CREATE TABLE IF NOT EXISTS sell_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    variant VARCHAR(50),
    storage VARCHAR(20) NOT NULL,
    ram VARCHAR(20),
    color VARCHAR(30),
    
    overall_condition VARCHAR(30) NOT NULL,
    battery_health VARCHAR(10),
    display_condition VARCHAR(100),
    body_condition VARCHAR(100),
    camera_condition VARCHAR(100),
    speaker_condition VARCHAR(100),
    charging_condition VARCHAR(100),
    network_condition VARCHAR(100),
    additional_issues TEXT,
    
    expected_price DECIMAL(10, 2) NOT NULL,
    owner_offer_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    status VARCHAR(30) DEFAULT 'SUBMITTED',
    owner_notes TEXT,
    customer_notes TEXT,
    inspection_report_json TEXT,
    created_product_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Sell Request Images Table
CREATE TABLE IF NOT EXISTS sell_request_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sell_request_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (sell_request_id) REFERENCES sell_requests(id) ON DELETE CASCADE
);

-- 11. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    product_id BIGINT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    sale_price DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'CASH',
    status VARCHAR(20) DEFAULT 'COMPLETED',
    warranty_start_date DATE,
    warranty_end_date DATE,
    invoice_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 12. Warranty Claims Table
CREATE TABLE IF NOT EXISTS warranty_claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    product_id BIGINT NOT NULL,
    issue_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'SUBMITTED',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Search History / Demand Table
CREATE TABLE IF NOT EXISTS search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    query_keyword VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    search_count INT DEFAULT 1,
    last_searched DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
