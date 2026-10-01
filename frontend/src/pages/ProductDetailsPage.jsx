import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import EnquiryModal from "../components/EnquiryModal";
import ReservationModal from "../components/ReservationModal";
import ProductImagePlaceholder from "../components/ProductImagePlaceholder";
import {
  Heart,
  MessageSquare,
  Phone,
  Bookmark,
  ShieldCheck,
  Battery,
  Box,
  CheckCircle2,
  Play,
  MapPin,
  Share2,
} from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setSelectedImg(res.data.images[0].imageUrl);
      } else {
        setSelectedImg("");
      }
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4>Product Not Found</h4>
        <Link to="/catalog" className="btn btn-primary-custom mt-3">
          Back to Stock Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isWishlisted(product.id);

  // WhatsApp Pre-filled message link
  const shopWhatsApp = "+919876543210";
  const whatsappMsg = `Hi, I am interested in ${product.brand} ${product.modelName} (${product.storage}). The listed price is ₹${product.sellingPrice?.toLocaleString()}. Is it available?`;
  const whatsappUrl = `https://wa.me/${shopWhatsApp.replace("+", "")}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="container py-4">
      {toastMsg && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {toastMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setToastMsg("")}
          ></button>
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/catalog">Stock</Link>
          </li>
          <li className="breadcrumb-item active">
            {product.brand} {product.modelName}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Image Gallery & Video */}
        <div className="col-lg-6">
          <div className="bg-white p-3 rounded-4 border shadow-sm mb-3">
            <div
              className="position-relative text-center p-4 bg-light rounded-3 mb-3"
              style={{ minHeight: "350px" }}
            >
              {selectedImg ? (
                <img
                  src={selectedImg}
                  alt={`${product.brand} ${product.modelName}`}
                  className="img-fluid"
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                  onError={() => setSelectedImg("")}
                />
              ) : (
                <ProductImagePlaceholder
                  brand={product.brand}
                  modelName={product.modelName}
                  className="details-image-placeholder"
                />
              )}
              <button
                className={`wishlist-btn-overlay ${isSaved ? "active" : ""}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  size={20}
                  fill={isSaved ? "#ef4444" : "none"}
                  color={isSaved ? "#ef4444" : "#64748b"}
                />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="thumbnail"
                    className={`rounded border p-1 cursor-pointer ${selectedImg === img.imageUrl ? "border-primary border-2" : ""}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedImg(img.imageUrl)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Video Section if present */}
          {product.featuredVideoUrl && (
            <div className="bg-white p-3 rounded-4 border shadow-sm">
              <h6 className="font-heading fw-bold mb-2 d-flex align-items-center gap-2 text-primary">
                <Play size={18} /> Product Inspection Video
              </h6>
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
                <video controls poster={selectedImg}>
                  <source src={product.featuredVideoUrl} type="video/mp4" />
                </video>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Actions */}
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase px-3 py-1">
                {product.brand}
              </span>
              <span className="badge bg-success-subtle text-success fw-bold px-3 py-1">
                ⭐ {product.overallCondition?.replace("_", " ")} Condition
              </span>
            </div>

            <h2 className="font-heading fw-bold text-dark mb-1">
              {product.modelName}
            </h2>
            <p className="text-secondary fs-5 mb-3">
              {product.storage} | {product.color}{" "}
              {product.ram ? `| ${product.ram} RAM` : ""}
            </p>

            {/* Price Card */}
            <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-baseline justify-content-between">
              <div>
                <span className="display-6 font-heading fw-extrabold text-primary">
                  ₹{product.sellingPrice?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-muted text-decoration-line-through ms-2 fs-5">
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
              {product.isNegotiable && (
                <span className="badge bg-warning-subtle text-dark border border-warning font-semibold">
                  Price Negotiable
                </span>
              )}
            </div>

            {/* Shop Warranty Box */}
            {product.warrantyAvailable && (
              <div className="alert alert-success d-flex align-items-center gap-3 rounded-3 mb-4">
                <ShieldCheck size={32} className="text-success flex-shrink-0" />
                <div>
                  <div className="fw-bold">
                    {product.warrantyMonths} Months Shop Warranty Included
                  </div>
                  <div className="small text-secondary">
                    Covers hardware defects & display testing. Shop warranty
                    active!
                  </div>
                </div>
              </div>
            )}

            {/* Hardware Condition Specs */}
            <h6 className="font-heading fw-bold text-dark mb-3">
              Hardware Quality Checklist
            </h6>
            <div className="row g-2 mb-4">
              {product.batteryHealth && (
                <div className="col-6">
                  <div className="p-2 border rounded bg-light small">
                    <span className="text-muted d-block">Battery Health</span>
                    <strong className="text-success d-flex align-items-center gap-1">
                      <Battery size={16} /> {product.batteryHealth}
                    </strong>
                  </div>
                </div>
              )}
              {product.displayCondition && (
                <div className="col-6">
                  <div className="p-2 border rounded bg-light small">
                    <span className="text-muted d-block">Display Status</span>
                    <strong className="text-dark">
                      {product.displayCondition}
                    </strong>
                  </div>
                </div>
              )}
              {product.bodyCondition && (
                <div className="col-6">
                  <div className="p-2 border rounded bg-light small">
                    <span className="text-muted d-block">Body Frame</span>
                    <strong className="text-dark">
                      {product.bodyCondition}
                    </strong>
                  </div>
                </div>
              )}
              {product.cameraCondition && (
                <div className="col-6">
                  <div className="p-2 border rounded bg-light small">
                    <span className="text-muted d-block">Camera Check</span>
                    <strong className="text-dark">
                      {product.cameraCondition}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Accessories Included */}
            <h6 className="font-heading fw-bold text-dark mb-2">
              Included Box & Accessories
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span
                className={`badge ${product.boxIncluded ? "bg-success" : "bg-secondary-subtle text-muted"}`}
              >
                {product.boxIncluded ? "✓ Original Box" : "✕ No Box"}
              </span>
              <span
                className={`badge ${product.chargerIncluded ? "bg-success" : "bg-secondary-subtle text-muted"}`}
              >
                {product.chargerIncluded ? "✓ Charger" : "✕ No Charger"}
              </span>
              <span
                className={`badge ${product.cableIncluded ? "bg-success" : "bg-secondary-subtle text-muted"}`}
              >
                {product.cableIncluded ? "✓ Cable" : "✕ No Cable"}
              </span>
              <span
                className={`badge ${product.billIncluded ? "bg-success" : "bg-secondary-subtle text-muted"}`}
              >
                {product.billIncluded ? "✓ Original Bill" : "✕ No Bill"}
              </span>
            </div>

            {/* Main Action Buttons */}
            <div className="row g-2 mb-4">
              <div className="col-12 col-sm-6">
                <button
                  className="btn btn-warning w-100 py-2.5 font-semibold text-dark d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
                  onClick={() => setShowReserveModal(true)}
                  disabled={product.status !== "AVAILABLE"}
                >
                  <Bookmark size={18} />{" "}
                  {product.status === "AVAILABLE"
                    ? "Reserve Mobile"
                    : product.status}
                </button>
              </div>

              <div className="col-12 col-sm-6">
                <button
                  className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 rounded-3"
                  onClick={() => setShowEnquiryModal(true)}
                >
                  <MessageSquare size={18} /> Send Enquiry
                </button>
              </div>

              <div className="col-12 col-sm-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 rounded-3"
                >
                  <MessageSquare size={18} /> WhatsApp Shop
                </a>
              </div>

              <div className="col-12 col-sm-6">
                <a
                  href="tel:+919876543210"
                  className="btn btn-call w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 rounded-3"
                >
                  <Phone size={18} /> Call Shop Owner
                </a>
              </div>
            </div>

            {/* Shop Visit Info Box */}
            <div className="border-top pt-3 text-secondary small">
              <div className="d-flex align-items-center gap-2 mb-1">
                <MapPin size={16} className="text-primary" /> Shop Address: Shop
                #12, Tech Bazaar Main Road
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 size={16} className="text-success" /> Physical
                inspection & testing allowed before purchase!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnquiryModal
        product={product}
        show={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        onSuccess={(msg) => setToastMsg(msg)}
      />

      <ReservationModal
        product={product}
        show={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        onSuccess={(msg) => {
          setToastMsg(msg);
          fetchProductDetails();
        }}
      />
    </div>
  );
};

export default ProductDetailsPage;
