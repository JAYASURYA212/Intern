import React from "react";
import { Smartphone } from "lucide-react";

const ProductImagePlaceholder = ({ brand, modelName, className = "" }) => {
  const brandClass = (brand || "mobile").toLowerCase().replace(/[^a-z]/g, "");

  return (
    <div
      className={`product-image-placeholder brand-image-${brandClass} ${className}`}
      role="img"
      aria-label={`${brand || "Mobile"} ${modelName || "phone"} image unavailable`}
    >
      <span className="placeholder-brand">{brand || "Mobile"}</span>
      <Smartphone size={42} strokeWidth={1.2} aria-hidden="true" />
      <span className="placeholder-model">
        {modelName || "Phone image unavailable"}
      </span>
    </div>
  );
};

export default ProductImagePlaceholder;
