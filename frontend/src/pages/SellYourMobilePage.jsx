import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Camera,
} from "lucide-react";

const SellYourMobilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [brand, setBrand] = useState("Apple");
  const [modelName, setModelName] = useState("");
  const [variant, setVariant] = useState("");
  const [storage, setStorage] = useState("128GB");
  const [ram, setRam] = useState("6GB");
  const [color, setColor] = useState("");

  const [overallCondition, setOverallCondition] = useState("EXCELLENT");
  const [batteryHealth, setBatteryHealth] = useState("88%");
  const [displayCondition, setDisplayCondition] = useState(
    "Clean, original screen",
  );
  const [bodyCondition, setBodyCondition] = useState("Minor scuffs");
  const [additionalIssues, setAdditionalIssues] = useState("");

  const [expectedPrice, setExpectedPrice] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
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
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a sell request.");
      navigate("/login");
      return;
    }
    if (!modelName || !expectedPrice || Number(expectedPrice) <= 0) {
      setError("Please fill in model name and a valid expected price.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await API.post("/sell-requests", {
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
        additionalIssues,
        expectedPrice: Number(expectedPrice),
        customerNotes,
        imageUrls,
      });
      setSubmitting(false);
      navigate("/customer/sell-requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit sell request.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="max-w-700 mx-auto" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div className="bg-gradient p-4 rounded-4 border mb-4 text-center">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2 shadow">
            <Sparkles size={28} />
          </div>
          <h2 className="font-heading fw-bold text-dark">
            Sell Your Used Mobile Phone
          </h2>
          <p className="text-secondary small mb-0">
            Submit your device details for a fast, private shop evaluation. We
            inspect and purchase used phones directly!
          </p>
        </div>

        {/* Private Guarantee Banner */}
        <div className="alert alert-info d-flex align-items-center gap-3 rounded-4 mb-4">
          <ShieldAlert className="text-info flex-shrink-0" size={28} />
          <div className="small">
            <strong>🔒 Private Request:</strong> Your submitted mobile is NOT
            published on the public marketplace. It is sent privately ONLY to
            the shop owner for price evaluation.
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Mobile Specifications */}
            <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
              1. Basic Mobile Details
            </h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
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

              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Model Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. iPhone 13, Galaxy S22"
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
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label font-semibold text-sm">
                  Color
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Midnight, Blue"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            {/* Step 2: Physical & Battery Condition */}
            <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
              2. Physical & Hardware Condition
            </h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Overall Condition *
                </label>
                <select
                  className="form-select"
                  value={overallCondition}
                  onChange={(e) => setOverallCondition(e.target.value)}
                >
                  <option value="EXCELLENT">
                    ⭐ Excellent (Like New, No scratches)
                  </option>
                  <option value="VERY_GOOD">Very Good (Minor scuffs)</option>
                  <option value="GOOD">Good (Visible wear)</option>
                  <option value="FAIR">Fair (Heavy wear/cracks)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Battery Health (%)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 88%"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Display Condition
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Original screen, no cracks"
                  value={displayCondition}
                  onChange={(e) => setDisplayCondition(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Body Frame Condition
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Minor scratches on edge"
                  value={bodyCondition}
                  onChange={(e) => setBodyCondition(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label font-semibold text-sm">
                  Any Hardware Issues / Defects?
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Mention camera, speaker, face ID, battery drain or repair history if any"
                  value={additionalIssues}
                  onChange={(e) => setAdditionalIssues(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Step 3: Pricing & Photos */}
            <h5 className="font-heading fw-bold text-primary mb-3 pb-2 border-bottom">
              3. Expected Price & Photos
            </h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Expected Selling Price (₹) *
                </label>
                <input
                  type="number"
                  className="form-control form-control-lg fw-bold text-primary"
                  placeholder="Enter expected amount in ₹"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label font-semibold text-sm">
                  Upload Photos of Phone
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageUpload}
                />
                <small className="text-muted">
                  {uploading
                    ? "Uploading photos..."
                    : `${imageUrls.length} photo(s) selected`}
                </small>
              </div>

              <div className="col-12">
                <label className="form-label font-semibold text-sm">
                  Additional Comments for Shop Owner
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Include details about box, charger, bill availability"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-3 font-semibold fs-5 rounded-3 shadow"
              disabled={submitting}
            >
              {submitting
                ? "Submitting Sell Request..."
                : "Submit Sell Request To Shop Owner"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellYourMobilePage;
