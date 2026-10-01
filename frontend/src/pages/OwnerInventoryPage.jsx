import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { Layers, Plus, Star, Edit, Eye, Tag, Video } from "lucide-react";
import ProductImagePlaceholder from "../components/ProductImagePlaceholder";

const OwnerInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoModalProduct, setVideoModalProduct] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products?status=ALL&size=100");
      setProducts(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/owner/products/${id}/status`, { status });
      fetchInventory();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    if (!videoModalProduct) return;
    try {
      await API.put(`/owner/products/${videoModalProduct.id}/feature`, {
        videoUrl,
      });
      alert(
        `${videoModalProduct.brand} ${videoModalProduct.modelName} is now set as Mobile of the Day!`,
      );
      setVideoModalProduct(null);
      setVideoUrl("");
      fetchInventory();
    } catch (err) {
      alert("Failed to set featured mobile.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Inventory Management</h3>
          <p className="text-muted small mb-0">
            Total stock items: {products.length}
          </p>
        </div>

        <Link
          to="/owner/products/new"
          className="btn btn-primary-custom btn-sm font-semibold d-flex align-items-center gap-1 shadow-sm"
        >
          <Plus size={16} /> Add New Stock Item
        </Link>
      </div>

      <div className="bg-white rounded-4 border shadow-sm p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Phone</th>
                  <th>Storage</th>
                  <th>Condition</th>
                  <th>Price (₹)</th>
                  <th>Warranty</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {p.images?.[0]?.imageUrl ? (
                          <img
                            src={p.images[0].imageUrl}
                            alt={`${p.brand} ${p.modelName}`}
                            className="rounded border p-1"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <ProductImagePlaceholder
                            brand={p.brand}
                            modelName={p.modelName}
                            className="inventory-image-placeholder"
                          />
                        )}
                        <div>
                          <div className="fw-bold text-dark">
                            {p.brand} {p.modelName}
                          </div>
                          <small className="text-muted">
                            {p.internalStockId || `ID: ${p.id}`}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{p.storage}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {p.overallCondition}
                      </span>
                    </td>
                    <td className="fw-bold text-primary">
                      ₹{p.sellingPrice?.toLocaleString()}
                    </td>
                    <td>
                      {p.warrantyAvailable ? `🛡️ ${p.warrantyMonths}m` : "None"}
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm fw-bold ${
                          p.status === "AVAILABLE"
                            ? "text-success"
                            : p.status === "RESERVED"
                              ? "text-warning"
                              : p.status === "SOLD"
                                ? "text-danger"
                                : "text-secondary"
                        }`}
                        value={p.status}
                        onChange={(e) =>
                          handleStatusChange(p.id, e.target.value)
                        }
                        style={{ width: "120px" }}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="SOLD">SOLD</option>
                        <option value="HIDDEN">HIDDEN</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className={`btn ${p.isFeatured ? "btn-warning text-dark font-bold" : "btn-outline-warning"}`}
                          title="Set as Mobile of the Day"
                          onClick={() => {
                            setVideoModalProduct(p);
                            setVideoUrl(p.featuredVideoUrl || "");
                          }}
                        >
                          <Star size={14} />{" "}
                          {p.isFeatured ? "Featured" : "Feature"}
                        </button>
                        <Link
                          to={`/owner/products/${p.id}/edit`}
                          className="btn btn-outline-secondary"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          to={`/products/${p.id}`}
                          className="btn btn-outline-primary"
                          title="View"
                        >
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feature / Mobile of the Day Video Modal */}
      {videoModalProduct && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg border-0">
              <div className="modal-header border-bottom bg-light rounded-top-4">
                <h5 className="modal-title font-heading fw-bold text-warning d-flex align-items-center gap-2">
                  <Star size={20} /> Set Mobile of the Day
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setVideoModalProduct(null)}
                ></button>
              </div>
              <form onSubmit={handleFeatureSubmit}>
                <div className="modal-body p-4">
                  <p className="text-muted small">
                    Make{" "}
                    <strong>
                      {videoModalProduct.brand} {videoModalProduct.modelName}
                    </strong>{" "}
                    the featured phone on the homepage.
                  </p>
                  <div className="mb-3">
                    <label className="form-label font-semibold text-sm">
                      Product Video URL (MP4 / WebM / Cloudinary)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top rounded-bottom-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3"
                    onClick={() => setVideoModalProduct(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning font-bold text-dark rounded-3"
                  >
                    Set As Featured
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerInventoryPage;
