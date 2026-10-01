import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { PlusCircle, Save, ArrowLeft, Upload } from "lucide-react";

const OwnerAddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [brand, setBrand] = useState("Apple");
  const [modelName, setModelName] = useState("");
  const [variant, setVariant] = useState("");
  const [storage, setStorage] = useState("128GB");
  const [ram, setRam] = useState("6GB");
  const [color, setColor] = useState("Black");

  const [overallCondition, setOverallCondition] = useState("EXCELLENT");
  const [batteryHealth, setBatteryHealth] = useState("90%");
  const [displayCondition, setDisplayCondition] = useState(
    "Clean, no scratches",
  );
  const [bodyCondition, setBodyCondition] = useState("Clean frame");

  const [originalPrice, setOriginalPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);

  const [warrantyAvailable, setWarrantyAvailable] = useState(true);
  const [warrantyMonths, setWarrantyMonths] = useState(3);
  const [warrantyType, setWarrantyType] = useState("Shop Warranty");

  const [boxIncluded, setBoxIncluded] = useState(true);
  const [chargerIncluded, setChargerIncluded] = useState(true);
  const [cableIncluded, setCableIncluded] = useState(true);
  const [billIncluded, setBillIncluded] = useState(true);

  const [imei1, setImei1] = useState("");
  const [purchaseSource, setPurchaseSource] = useState("Shop Trade-In");

  const [imageUrls, setImageUrls] = useState([]);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      const p = res.data;
      setBrand(p.brand || "Apple");
      setModelName(p.modelName || "");
      setVariant(p.variant || "");
      setStorage(p.storage || "128GB");
      setRam(p.ram || "6GB");
      setColor(p.color || "Black");
      setOverallCondition(p.overallCondition || "EXCELLENT");
      setBatteryHealth(p.batteryHealth || "90%");
      setDisplayCondition(p.displayCondition || "");
      setBodyCondition(p.bodyCondition || "");
      setOriginalPrice(p.originalPrice || "");
      setSellingPrice(p.sellingPrice || "");
      setIsNegotiable(p.isNegotiable || false);
      setWarrantyAvailable(p.warrantyAvailable || false);
      setWarrantyMonths(p.warrantyMonths || 3);
      setWarrantyType(p.warrantyType || "Shop Warranty");
      setBoxIncluded(p.boxIncluded || false);
      setChargerIncluded(p.chargerIncluded || false);
      setCableIncluded(p.cableIncluded || false);
      setBillIncluded(p.billIncluded || false);
      setImei1(p.imei1 || "");
      setPurchaseSource(p.purchaseSource || "");
      setFeaturedVideoUrl(p.featuredVideoUrl || "");
      if (p.images && p.images.length > 0) {
        setImageUrls(p.images.map((i) => i.imageUrl));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await API.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrls((prev) => [...prev, ...res.data.urls]);
    } catch (err) {
      alert("Upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelName || !sellingPrice) {
      alert("Please enter model name and selling price.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        brand,
        modelName,
        variant,
        storage,
        ram,
        color,
        overallCondition,
        batteryHealth,
        displayCondition,
        bodyCondition,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        sellingPrice: Number(sellingPrice),
        isNegotiable,
        warrantyAvailable,
        warrantyMonths: Number(warrantyMonths),
        warrantyType,
        boxIncluded,
        chargerIncluded,
        cableIncluded,
        billIncluded,
        imei1,
        purchaseSource,
        featuredVideoUrl,
        images: imageUrls.map((url, idx) => ({
          imageUrl: url,
          isPrimary: idx === 0,
        })),
      };

      if (isEdit) {
        await API.put(`/owner/products/${id}`, payload);
      } else {
        await API.post("/owner/products", payload);
      }
      setSubmitting(false);
      navigate("/owner/inventory");
    } catch (err) {
      alert("Failed to save product.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">
            {isEdit
              ? "Edit Mobile Stock Item"
              : "Add New Mobile to Shop Inventory"}
          </h3>
          <p className="text-muted small mb-0">
            Fill in specifications, warranty, pricing & photos
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div
        className="bg-white p-4 p-md-5 rounded-4 border shadow-sm"
        style={{ maxWidth: "900px" }}
      >
        <form onSubmit={handleSubmit}>
          {/* Section 1: Specs */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
            1. Phone Specifications
          </h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Brand *
              </label>
              <select
                className="form-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Google">Google</option>
                <option value="Nothing">Nothing</option>
                <option value="Vivo">Vivo</option>
                <option value="Oppo">Oppo</option>
                <option value="Realme">Realme</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Model Name *
              </label>
              <input
                type="text"
                className="form-control"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Storage *
              </label>
              <select
                className="form-select"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">RAM</label>
              <select
                className="form-select"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                <option value="4GB">4GB</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
                <option value="16GB">16GB</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">Color</label>
              <input
                type="text"
                className="form-control"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Condition & Warranty */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
            2. Condition & Shop Warranty
          </h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Overall Condition *
              </label>
              <select
                className="form-select"
                value={overallCondition}
                onChange={(e) => setOverallCondition(e.target.value)}
              >
                <option value="EXCELLENT">EXCELLENT (Like New)</option>
                <option value="VERY_GOOD">VERY GOOD</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Battery Health (%)
              </label>
              <input
                type="text"
                className="form-control"
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label font-semibold text-sm">
                Warranty Duration (Months)
              </label>
              <input
                type="number"
                className="form-control"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Pricing */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
            3. Pricing
          </h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label font-semibold text-sm">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                className="form-control form-control-lg fw-bold text-primary"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label font-semibold text-sm">
                Original MRP Price (₹)
              </label>
              <input
                type="number"
                className="form-control form-control-lg text-muted"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Section 4: Images */}
          <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
            4. Photos & Media
          </h5>
          <div className="mb-4">
            <label className="form-label font-semibold text-sm">
              Upload Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control mb-2"
              onChange={handleFileUpload}
            />
            <div className="d-flex flex-wrap gap-2">
              {imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="preview"
                  className="rounded border"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-3 font-semibold fs-5 rounded-3 shadow"
            disabled={submitting}
          >
            <Save size={18} className="me-1" />{" "}
            {submitting ? "Saving..." : "Save Product To Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerAddEditProductPage;
