import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const topBrands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Google",
  "Nothing",
  "Vivo",
  "Oppo",
  "Realme",
];

const Footer = () => {
  return (
    <footer className="store-footer">
      <div className="container">
        <div className="footer-topline">
          <div className="footer-brand-lockup">
            <span className="footer-mark">
              <Smartphone size={22} />
            </span>
            <span>
              <strong>MobileMart</strong>
              <small>GOOD PHONES. BETTER FINDS.</small>
            </span>
          </div>
          <p>Pre-owned, properly checked, ready for another life.</p>
          <Link to="/catalog" className="footer-shop-link">
            Find your phone <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="footer-main-grid">
          <section className="footer-brand-directory">
            <p className="footer-label">SHOP BY BRAND</p>
            <div className="footer-brand-links">
              {topBrands.map((brand) => (
                <Link
                  key={brand}
                  to={`/catalog?brand=${encodeURIComponent(brand)}`}
                >
                  {brand}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <p className="footer-label">QUICK LINKS</p>
            <ul className="footer-link-list">
              <li>
                <Link to="/catalog">Complete stock</Link>
              </li>
              <li>
                <Link to="/sell-your-mobile">Sell your old phone</Link>
              </li>
              <li>
                <Link to="/compare">Compare phones</Link>
              </li>
              <li>
                <Link to="/wishlist">Saved wishlist</Link>
              </li>
              <li>
                <Link to="/shop-profile">Shop location</Link>
              </li>
            </ul>
          </section>

          <section>
            <p className="footer-label">COME SAY HELLO</p>
            <div className="footer-contact-list">
              <span>
                <MapPin size={15} /> Shop #12, Tech Bazaar Main Road
              </span>
              <span>
                <Phone size={15} /> +91 98765 43210
              </span>
              <span>
                <MessageSquare size={15} /> WhatsApp available
              </span>
              <span>
                <Clock size={15} /> Mon–Sat · 10 AM–9 PM
              </span>
            </div>
            <div className="footer-verified">
              <ShieldCheck size={16} /> 40-point checked stock
            </div>
          </section>
        </div>

        <div className="footer-bottomline">
          <span>© {new Date().getFullYear()} MobileMart Marketplace</span>
          <div>
            <Link to="/shop-profile">Warranty policy</Link>
            <Link to="/owner/dashboard">Owner login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
