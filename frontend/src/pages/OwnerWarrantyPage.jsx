import React, { useState, useEffect } from "react";
import API from "../services/api";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const OwnerWarrantyPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await API.get("/owner/warranty/claims");
      setClaims(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status, notes) => {
    try {
      await API.put(`/owner/warranty/claims/${id}/status`, {
        status,
        adminNotes: notes,
      });
      fetchClaims();
    } catch (err) {
      alert("Failed to update claim.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1">Customer Warranty Claims</h3>
      <p className="text-muted small mb-4">
        Inspect and resolve customer shop warranty claims
      </p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <ShieldCheck size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark">No Active Warranty Claims</h4>
        </div>
      ) : (
        <div className="row g-4">
          {claims.map((claim) => (
            <div key={claim.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-3">
                    <span className="badge bg-warning text-dark mb-1">
                      Status: {claim.status}
                    </span>
                    <h5 className="font-heading fw-bold mb-1">
                      {claim.product?.brand} {claim.product?.modelName}
                    </h5>
                    <p className="text-secondary small mb-0">
                      Customer: {claim.user?.fullName} ({claim.user?.phone})
                    </p>
                  </div>

                  <div className="col-md-4 border-start-md">
                    <div className="fw-bold text-dark">{claim.issueTitle}</div>
                    <p className="small text-muted mb-0">{claim.description}</p>
                  </div>

                  <div className="col-md-5 text-end d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        handleStatusChange(
                          claim.id,
                          "APPROVED",
                          "Approved for repair/replacement at shop.",
                        )
                      }
                    >
                      Approve Repair
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleStatusChange(
                          claim.id,
                          "REJECTED",
                          "Claim rejected as issue is due to accidental damage.",
                        )
                      }
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        handleStatusChange(
                          claim.id,
                          "RESOLVED",
                          "Device issue resolved at shop.",
                        )
                      }
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerWarrantyPage;
