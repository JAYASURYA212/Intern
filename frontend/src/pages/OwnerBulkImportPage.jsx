import React, { useState } from 'react';
import API from '../services/api';
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerBulkImportPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await API.post('/owner/inventory/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      alert("Failed to parse or import CSV file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Bulk Stock Import (CSV)</h3>
          <p className="text-muted small mb-0">Import hundreds of pre-owned phones into inventory via Excel/CSV spreadsheet</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/owner/inventory')}>
          <ArrowLeft size={16} /> Back to Stock
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
              <FileSpreadsheet className="text-primary" size={20} /> Select CSV File
            </h5>

            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <input type="file" accept=".csv" className="form-control form-control-lg" onChange={handleFileChange} required />
                <small className="text-muted mt-1 d-block">
                  Expected CSV Headers: <code>Brand, Model, Storage, SellingPrice, Condition, BatteryHealth, RAM, Color, WarrantyMonths</code>
                </small>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-3 font-semibold shadow" disabled={uploading}>
                <UploadCloud size={18} className="me-1" /> {uploading ? "Parsing & Importing..." : "Start Import"}
              </button>
            </form>
          </div>
        </div>

        {/* Validation Result Box */}
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h5 className="font-heading fw-bold mb-3">Import Summary Report</h5>
            {result ? (
              <div>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted small font-semibold">Total Rows</div>
                      <div className="fs-4 font-heading fw-bold text-dark">{result.totalRows}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-success-subtle rounded text-center">
                      <div className="text-success small font-semibold">Valid Imported</div>
                      <div className="fs-4 font-heading fw-bold text-success">{result.validCount}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-danger-subtle rounded text-center">
                      <div className="text-danger small font-semibold">Invalid Skipped</div>
                      <div className="fs-4 font-heading fw-bold text-danger">{result.invalidCount}</div>
                    </div>
                  </div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="alert alert-warning small max-h-200 overflow-auto">
                    <div className="fw-bold mb-1">Validation Errors:</div>
                    <ul className="mb-0 ps-3">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="btn btn-success w-100 mt-2 font-semibold" onClick={() => navigate('/owner/inventory')}>
                  Go to Updated Inventory Table →
                </button>
              </div>
            ) : (
              <p className="text-muted small py-4 text-center">Upload a CSV file to preview valid & invalid record counts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerBulkImportPage;
