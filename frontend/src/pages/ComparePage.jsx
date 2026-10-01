import React, { useState, useEffect } from "react";
import API from "../services/api";
import { RefreshCw, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProductImagePlaceholder from "../components/ProductImagePlaceholder";

const ComparePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedProducts, setComparedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products?size=50");
      setAllProducts(res.data.content);
      if (res.data.content.length >= 2) {
        setSelectedIds([res.data.content[0].id, res.data.content[1].id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const list = selectedIds
      .map((id) => allProducts.find((p) => p.id === Number(id)))
      .filter(Boolean);
    setComparedProducts(list);
  }, [selectedIds, allProducts]);

  const handleAddSlot = (e) => {
    const val = Number(e.target.value);
    if (val && !selectedIds.includes(val) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, val]);
    }
  };

  const removeSlot = (id) => {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1 d-flex align-items-center gap-2">
            <RefreshCw className="text-primary" size={24} /> Compare Second-Hand
            Mobiles
          </h3>
          <p className="text-muted small mb-0">
            Compare up to 3 phones side-by-side on price, battery, condition &
            shop warranty
          </p>
        </div>

        {selectedIds.length < 3 && (
          <div style={{ width: "220px" }}>
            <select
              className="form-select form-select-sm"
              onChange={handleAddSlot}
              value=""
            >
              <option value="" disabled>
                + Add Phone to Compare
              </option>
              {allProducts.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  disabled={selectedIds.includes(p.id)}
                >
                  {p.brand} {p.modelName} ({p.storage})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <p className="text-muted">Select phones above to start comparing.</p>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 border shadow-sm p-3">
          <table className="table table-bordered align-middle text-center mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "180px" }} className="text-start">
                  Feature
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} style={{ width: "260px" }}>
                    <div className="position-relative p-2">
                      <button
                        className="btn btn-sm btn-light border position-absolute top-0 end-0 p-1"
                        onClick={() => removeSlot(p.id)}
                      >
                        <X size={14} />
                      </button>
                      {p.images?.[0]?.imageUrl ? (
                        <img
                          src={p.images[0].imageUrl}
                          alt={`${p.brand} ${p.modelName}`}
                          style={{ height: "100px", objectFit: "contain" }}
                          className="mb-2"
                        />
                      ) : (
                        <ProductImagePlaceholder
                          brand={p.brand}
                          modelName={p.modelName}
                          className="compare-image-placeholder mb-2"
                        />
                      )}
                      <h6 className="font-heading fw-bold mb-1">
                        {p.brand} {p.modelName}
                      </h6>
                      <span className="text-primary fw-bold fs-5 d-block">
                        ₹{p.sellingPrice?.toLocaleString()}
                      </span>
                      <Link
                        to={`/products/${p.id}`}
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        View Phone
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-start bg-light">Storage</td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.storage}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">RAM</td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.ram || "N/A"}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">
                  Overall Condition
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    <span className="badge bg-success-subtle text-success">
                      {p.overallCondition?.replace("_", " ")}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">Battery Health</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="fw-bold text-success">
                    {p.batteryHealth || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">Shop Warranty</td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>
                    {p.warrantyAvailable
                      ? `🛡️ ${p.warrantyMonths} Months`
                      : "No Warranty"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">Box Included</td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.boxIncluded ? "✓ Yes" : "✕ No"}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">
                  Charger Included
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id}>{p.chargerIncluded ? "✓ Yes" : "✕ No"}</td>
                ))}
              </tr>
              <tr>
                <td className="fw-bold text-start bg-light">
                  Display Condition
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="small">
                    {p.displayCondition || "Tested Good"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
