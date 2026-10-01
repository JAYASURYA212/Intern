import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Flame,
  Smartphone,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Truck,
  Battery,
  Star,
} from "lucide-react";

const HomePage = () => {
  const [featuredMobile, setFeaturedMobile] = useState(null);
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [warrantyMobiles, setWarrantyMobiles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll(
      ".reveal-on-scroll:not(.is-visible)",
    );
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [loading, featuredMobile, brands, deals, newArrivals, warrantyMobiles]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featRes, dealsRes, arrivalsRes, warrantyRes, brandsRes] =
        await Promise.all([
          API.get("/products/featured-today"),
          API.get("/products/deals"),
          API.get("/products/new-arrivals"),
          API.get("/products/warranty-mobiles"),
          API.get("/brands"),
        ]);

      setFeaturedMobile(featRes.data);
      setDeals(dealsRes.data);
      setNewArrivals(arrivalsRes.data);
      setWarrantyMobiles(warrantyRes.data);
      setBrands(brandsRes.data);
    } catch (err) {
      console.error("Failed to load home page data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredImage =
    featuredMobile?.images?.find((image) => image.isPrimary)?.imageUrl ||
    featuredMobile?.images?.[0]?.imageUrl;
  const featuredCondition =
    typeof featuredMobile?.overallCondition === "string"
      ? featuredMobile.overallCondition.replaceAll("_", " ").trim()
      : "";
  const featuredBattery =
    typeof featuredMobile?.batteryHealth === "string"
      ? featuredMobile.batteryHealth.trim()
      : "";
  const featuredWarranty =
    featuredMobile?.warrantyAvailable &&
    Number(featuredMobile?.warrantyMonths) > 0
      ? Number(featuredMobile.warrantyMonths)
      : 0;

  return (
    <div className="storefront-home">
      <div className="store-location-strip">
        <div className="container location-strip-inner">
          <span>
            <MapPin size={14} /> Shop #12, Tech Bazaar Main Road
          </span>
          <span className="location-hours">
            Open today <strong>10:00 AM – 9:00 PM</strong>
          </span>
          <Link to="/shop-profile">
            Visit our shop <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <section className="storefront-hero">
        <div className="container hero-layout">
          <div className="hero-copy reveal-on-scroll">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> CERTIFIED PRE-OWNED · SHOP
              WARRANTY
            </p>
            <h1>
              Find your next
              <br />
              phone <span>for less.</span>
            </h1>
            <p className="hero-intro">
              Remarkable phones, carefully checked. Browse real shop stock,
              compare condition, and reserve before you visit.
            </p>

            <form className="hero-search" onSubmit={handleSearchSubmit}>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search stock"
                placeholder="Try iPhone 13, Galaxy S23, 256GB..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                Search stock <ArrowRight size={17} />
              </button>
            </form>

            <div className="hero-assurances">
              <span>
                <ShieldCheck size={17} /> 40-point inspection
              </span>
              <span>
                <CheckCircle2 size={17} /> Up to 6 months cover
              </span>
              <span>
                <Truck size={17} /> Try in-store
              </span>
            </div>
          </div>

          <aside className="trade-in-panel reveal-on-scroll">
            <div className="trade-in-panel-top">
              <span>THE SMARTER UPGRADE</span>
              <span className="trade-in-icon">
                <Smartphone size={22} />
              </span>
            </div>
            <div className="trade-in-visual" aria-hidden="true">
              <span className="trade-in-ring trade-in-ring-one" />
              <span className="trade-in-ring trade-in-ring-two" />
              <Smartphone size={72} strokeWidth={1.15} />
              <span className="trade-in-spark">✳</span>
            </div>
            <div className="trade-in-copy">
              <p className="trade-in-kicker">TRADE IN, MOVE UP</p>
              <h2>
                That old phone
                <br />
                still has value.
              </h2>
              <p>
                Share a few details and our shop team will get back to you with
                an offer.
              </p>
              <Link to="/sell-your-mobile" className="trade-in-link">
                Sell your phone <ArrowUpRight size={18} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <div className="container">
        <section className="brand-rail reveal-on-scroll">
          <div className="store-section-heading">
            <div>
              <p className="section-kicker">FIND YOUR BRAND</p>
              <h2>Browse the collection</h2>
            </div>
            <Link to="/catalog" className="section-link">
              All brands <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="brand-grid">
            {brands.map((brand) => (
              <div key={brand.id}>
                <Link
                  to={`/catalog?brand=${encodeURIComponent(brand.name)}`}
                  className="brand-tile"
                >
                  <span
                    className={`brand-monogram brand-${brand.name.toLowerCase().replace(/[^a-z]/g, "")}`}
                    aria-hidden="true"
                  >
                    {brand.name.slice(0, 1)}
                  </span>
                  <span>{brand.name}</span>
                  <ArrowUpRight className="brand-tile-arrow" size={15} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {featuredMobile && (
          <section className="mobile-of-day reveal-on-scroll">
            <div className="mobile-of-day-copy">
              <p className="feature-eyebrow">
                <Flame size={15} fill="currentColor" /> MOBILE OF THE DAY
              </p>
              <p className="feature-brand">{featuredMobile.brand}</p>
              <h2>{featuredMobile.modelName}</h2>
              <p className="feature-spec-line">
                {[featuredMobile.storage, featuredMobile.color]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>

              {(featuredCondition ||
                featuredBattery ||
                featuredWarranty > 0) && (
                <div className="feature-facts">
                  {featuredCondition && (
                    <span>
                      <Star size={15} fill="currentColor" /> {featuredCondition}
                    </span>
                  )}
                  {featuredBattery && (
                    <span>
                      <Battery size={15} /> Battery health {featuredBattery}
                    </span>
                  )}
                  {featuredWarranty > 0 && (
                    <span>
                      <ShieldCheck size={15} /> {featuredWarranty} month shop
                      cover
                    </span>
                  )}
                </div>
              )}

              <div className="feature-price-row">
                <span className="feature-price">
                  ₹{featuredMobile.sellingPrice?.toLocaleString()}
                </span>
                {featuredMobile.originalPrice && (
                  <span className="feature-price-was">
                    ₹{featuredMobile.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Link
                to={`/products/${featuredMobile.id}`}
                className="feature-cta"
              >
                Explore this phone <ArrowRight size={17} />
              </Link>
            </div>
            <div className="mobile-of-day-visual">
              <span className="visual-orbit visual-orbit-one" />
              <span className="visual-orbit visual-orbit-two" />
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={`${featuredMobile.brand} ${featuredMobile.modelName}`}
                />
              ) : (
                <div className="product-image-empty">
                  <Smartphone size={64} />
                  <span>Image unavailable</span>
                </div>
              )}
              <span className="visual-note">SHOP-VERIFIED STOCK</span>
            </div>
          </section>
        )}

        {/* Today's Deals Section */}
        {deals.length > 0 && (
          <section className="store-product-section reveal-on-scroll">
            <div className="store-section-heading">
              <div>
                <p className="section-kicker">LIMITED-TIME PRICES</p>
                <h2>
                  <Flame size={21} /> Today’s deals
                </h2>
              </div>
              <Link to="/catalog?deal=true" className="section-link">
                Shop all deals <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="store-product-grid">
              {deals.slice(0, 4).map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals Section */}
        <section className="store-product-section reveal-on-scroll">
          <div className="store-section-heading">
            <div>
              <p className="section-kicker">JUST CHECKED IN</p>
              <h2>Fresh arrivals</h2>
            </div>
            <Link to="/catalog?sortBy=newest" className="section-link">
              Explore stock <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="store-product-grid">
            {newArrivals.slice(0, 8).map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        {/* Warranty Mobiles Section */}
        <section className="warranty-section reveal-on-scroll">
          <div className="store-section-heading">
            <div>
              <p className="section-kicker">BACKED BY OUR SHOP</p>
              <h2>
                <ShieldCheck size={21} /> Warranty picks
              </h2>
            </div>
          </div>
          <div className="store-product-grid">
            {warrantyMobiles.slice(0, 4).map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
