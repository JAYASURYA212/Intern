# MobileMart – Second-Hand Mobile Shop Digital Marketplace & Inventory Platform

MobileMart is a full-stack, production-grade digital marketplace and inventory management platform designed specifically for real-world second-hand mobile phone shop owners and local customers.

---

## 📱 Problem Solved

Traditional second-hand mobile shop owners face key operational challenges:
1. **Limited Reach:** Promoted only 1-2 phones per day via social videos.
2. **Hidden Stock:** Customers could not search or browse the shop's complete inventory online.
3. **No Trade-In System:** Customers wanting to sell their used phones had no private submission system for shop evaluation.
4. **Lack of Inventory Tracking:** No central digital system to track stock age, warranty expiration, or customer demand.

**MobileMart solves all these problems** with a dual business workflow platform.

---

## 🔄 Two Core Business Workflows

### FLOW A — Shop Owner Sells Mobile
```text
Shop Owner Add/Import Stock ➔ Specs & 40-Point Quality Inspection ➔ Set Warranty & Price ➔ Publish
  ➔ Customer Searches & Filters Stock ➔ Enquire / WhatsApp / Call / Reserve
  ➔ Customer Visits Shop for In-Person Inspection ➔ Purchase ➔ Invoice & Warranty Issued ➔ Marked SOLD
```

### FLOW B — Customer Sells Their Mobile (Private Trade-In)
```text
Customer "Sell Your Mobile" Form ➔ Photos & Expected Price ➔ Private Submission
  ➔ Shop Owner Reviews Request Privately ➔ Ask Details / Make Estimated Offer
  ➔ Customer Accepts Offer ➔ Bring to Shop for 14-Point Inspection
  ➔ Final Price Approved ➔ Phone Purchased ➔ Automatically Converted into Shop Inventory Draft ➔ Published Online!
```

---

## 🛠️ Technology Stack

* **Frontend:** React.js, Vite, Bootstrap 5, Lucide Icons, React Router DOM, Axios
* **Backend:** Java 17/25, Spring Boot 3.3, Spring Web, Spring Data JPA, Spring Security, JWT Authentication, BCrypt, WebSocket
* **Database:** MySQL (Production ready via `database/schema.sql` & `database/seed.sql`) + Embedded H2 Database out-of-the-box
* **File Storage:** Local Static Storage (`/uploads/**`) + Cloudinary API integration
* **Bulk Import:** Apache Commons CSV Bulk Stock Importer with Row-by-Row Validation

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@example.com` | `password123` | Browse, Search, Filter, Wishlist, Compare, Enquire, Reserve, Submit Sell Request, Track Offer |
| **Shop Owner** | `owner@example.com` | `password123` | Complete Inventory, Add/Edit Stock, CSV Import, Feature Mobile of Day, Review Sell Requests, 14-Point Inspection, Sales & Analytics |
| **Admin** | `admin@example.com` | `password123` | Moderate Users, Shop Profile, Platform Overview |

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Java 17 or higher
- Node.js v18+ and npm
- Maven 3.8+

### 2. Backend Setup & Run
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
> The backend runs on `http://localhost:8080`.
> Embedded H2 Console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:mobilemartdb`).

### 3. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
> The frontend runs on `http://localhost:3000`.

---

## 📊 Database Schema & Pre-Loaded Demo Data

* `database/schema.sql`: Contains full DDL table definitions for MySQL (`users`, `brands`, `products`, `product_images`, `sell_requests`, `orders`, `warranties`, `enquiries`, `reservations`, `search_history`, `shop_profile`).
* `DataInitializer.java`: Automatically seeds **32+ pre-owned mobile phones** across Apple, Samsung, OnePlus, Google, Nothing, Vivo, Oppo, Realme with battery health %, warranty terms, prices, images, and search demand history on startup.

---

## 🔌 API Endpoint Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `POST` | `/api/products/filter` | Search, filter & paginate stock | Public |
| `GET` | `/api/products/featured-today` | Get Mobile of the Day with video | Public |
| `POST` | `/api/sell-requests` | Customer submits private phone sell request | Customer |
| `GET` | `/api/owner/sell-requests` | Shop owner reviews sell requests | Owner / Admin |
| `POST` | `/api/owner/sell-requests/{id}/offer` | Send estimated offer to customer | Owner / Admin |
| `POST` | `/api/owner/sell-requests/{id}/inspection` | Save 14-point physical inspection checklist | Owner / Admin |
| `POST` | `/api/owner/sell-requests/{id}/convert-to-inventory` | Convert purchased phone to inventory draft | Owner / Admin |
| `POST` | `/api/owner/inventory/import` | Bulk import stock via CSV spreadsheet | Owner / Admin |
| `GET` | `/api/owner/analytics` | View inventory stats, search demand & slow stock alerts | Owner / Admin |

---

## 📁 Project Directory Structure

```text
MOBILEMART/
├── backend/
│   ├── src/main/java/com/mobilemart/
│   │   ├── config/          # CORS, ResourceHandler, WebSocket
│   │   ├── controller/      # Auth, Product, Inventory, SellRequest, Enquiry, Reservation, Order, Analytics, Admin
│   │   ├── dto/             # Auth, Product, SellRequest, Analytics DTOs
│   │   ├── model/           # User, Product, SellRequest, Order, WarrantyClaim, SearchHistory
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Provider, Auth Filter, SecurityConfig
│   │   └── service/         # Business Logic, DataInitializer, FileStorage, Bulk Import
│   ├── pom.xml
│   └── src/main/resources/application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard, Modals (Enquiry, Reservation, Offer, Inspection)
│   │   ├── context/         # AuthContext, WishlistContext
│   │   ├── pages/           # Home, Catalog, Details, Compare, Wishlist, SellYourMobile, Owner Dashboard & Management
│   │   ├── services/        # Axios API Client with JWT interceptors
│   │   ├── styles/          # index.css (Bootstrap 5 + Custom Design System)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
└── README.md
```
