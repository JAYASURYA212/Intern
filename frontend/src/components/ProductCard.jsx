import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Battery,
  RefreshCw,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

const ProductCard = ({ product, onCompareToggle, isCompared }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [imageFailed, setImageFailed] = useState(false);

  if (!product) return null;

  const primaryImg =
    product.images?.find((image) => image.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl;
  const condition =
    typeof product.overallCondition === "string"
      ? product.overallCondition.replaceAll("_", " ")
      : "";

  const isSaved = isWishlisted(product.id);

  return (
    <article className="product-card">
      <div className="product-img-wrapper">
        {primaryImg && !imageFailed ? (
          <img
            src={primaryImg}
            alt={`${product.brand} ${product.modelName}`}
            className="product-img"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductImagePlaceholder
            brand={product.brand}
            modelName={product.modelName}
          />
        )}

        {/* Wishlist Heart Overlay */}
        <button
          className={`wishlist-btn-overlay ${isSaved ? "active" : ""}`}
          type="button"
          onClick={() => toggleWishlist(product.id)}
          title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart
            size={18}
            fill={isSaved ? "#ef4444" : "none"}
            color={isSaved ? "#ef4444" : "#64748b"}
          />
        </button>

        {/* Status / Featured Badges */}
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1 align-items-start">
          {product.isFeatured && (
            <span className="badge badge-featured">Mobile of Day</span>
          )}
          {product.isDeal && <span className="badge badge-deal">🔥 Deal</span>}
          {product.status === "RESERVED" && (
            <span className="badge bg-warning text-dark font-semibold">
              Reserved
            </span>
          )}
          {product.status === "SOLD" && (
            <span className="badge bg-danger text-white font-semibold">
              SOLD
            </span>
          )}
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Brand & Model */}
        <div className="d-flex justify-content-between align-items-start mb-1">
          <span
            className="text-muted text-uppercase font-semibold"
            style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
          >
            {product.brand}
          </span>
          {condition && (
            <span className="product-condition-tag">{condition}</span>
          )}
        </div>

        <Link
          to={`/products/${product.id}`}
          className="text-decoration-none text-dark mb-2"
        >
          <h6
            className="font-heading mb-0 text-truncate"
            title={`${product.modelName} (${product.storage})`}
          >
            {product.modelName}{" "}
            <span className="text-primary font-normal">{product.storage}</span>
          </h6>
        </Link>

        {/* Specs Badges */}
        <div
          className="d-flex flex-wrap gap-1 mb-2 text-muted small"
          style={{ fontSize: "0.75rem" }}
        >
          {product.ram && (
            <span className="bg-light px-2 py-0.5 rounded border">
              {product.ram} RAM
            </span>
          )}
          {product.batteryHealth && String(product.batteryHealth).trim() && (
            <span className="bg-light px-2 py-0.5 rounded border d-flex align-items-center gap-1">
              <Battery size={12} className="text-success" />{" "}
              {product.batteryHealth}
            </span>
          )}
          {product.color && (
            <span className="bg-light px-2 py-0.5 rounded border">
              {product.color}
            </span>
          )}
        </div>

        {/* Warranty Badge */}
        {product.warrantyAvailable && Number(product.warrantyMonths) > 0 && (
          <div className="mb-2">
            <span
              className="badge badge-warranty d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.7rem" }}
            >
              <ShieldCheck size={12} /> {product.warrantyMonths} Months Shop
              Warranty
            </span>
          </div>
        )}

        {/* Price Section & Actions */}
        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="font-heading fw-bold text-dark fs-5 mb-0">
              ₹{product.sellingPrice?.toLocaleString()}
            </div>
            {product.originalPrice &&
              product.originalPrice > product.sellingPrice && (
                <small
                  className="text-muted text-decoration-line-through me-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  ₹{product.originalPrice?.toLocaleString()}
                </small>
              )}
          </div>

          <div className="d-flex gap-1">
            {onCompareToggle && (
              <button
                type="button"
                className={`btn btn-sm ${isCompared ? "btn-primary" : "btn-outline-secondary"} p-1.5 rounded-2`}
                onClick={() => onCompareToggle(product)}
                title="Compare"
              >
                <RefreshCw size={16} />
              </button>
            )}
            <Link
              to={`/products/${product.id}`}
              className="product-view-link"
              aria-label={`View ${product.brand} ${product.modelName}`}
            >
              Details <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
