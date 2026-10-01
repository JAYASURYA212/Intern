import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const ProductCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brand') ? [searchParams.get('brand')] : []);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [warrantyOnly, setWarrantyOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(0);

  const brandOptions = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Nothing', 'Vivo', 'Oppo', 'Realme'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB'];
  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
  const conditionOptions = ['EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR'];

  useEffect(() => {
    fetchProducts();
  }, [selectedBrands, selectedStorage, selectedRam, selectedCondition, warrantyOnly, sortBy, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.post('/products/filter', {
        search,
        brands: selectedBrands.length > 0 ? selectedBrands : null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        storage: selectedStorage.length > 0 ? selectedStorage : null,
        ram: selectedRam.length > 0 ? selectedRam : null,
        condition: selectedCondition.length > 0 ? selectedCondition : null,
        warrantyAvailable: warrantyOnly ? true : null,
        status: 'AVAILABLE',
        sortBy,
        page,
        size: 12
      });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Failed to load catalog products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const toggleBrand = (b) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
    setPage(0);
  };

  const toggleStorage = (s) => {
    setSelectedStorage(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setPage(0);
  };

  const toggleCondition = (c) => {
    setSelectedCondition(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    setPage(0);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedStorage([]);
    setSelectedRam([]);
    setSelectedCondition([]);
    setWarrantyOnly(false);
    setSortBy('newest');
    setPage(0);
  };

  return (
    <div className="container py-4">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div className="row align-items-center g-3">
          <div className="col-md-6">
            <h3 className="font-heading fw-bold mb-1">Available Shop Inventory</h3>
            <p className="text-muted small mb-0">Showing {totalElements} second-hand mobile phones in stock</p>
          </div>

          <div className="col-md-6">
            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 ps-3"><Search size={18} className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="Search model, brand, storage..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary-custom px-4 text-nowrap font-semibold">Search</button>
            </form>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters Desktop */}
        <div className="col-lg-3">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="font-heading fw-bold mb-0 d-flex align-items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" /> Filters
              </h5>
              <button className="btn btn-sm text-danger p-0 border-0 d-flex align-items-center gap-1" onClick={resetFilters}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Brand Filter */}
            <div className="mb-4">
              <label className="form-label font-semibold text-dark text-sm">Brand</label>
              <div className="d-flex flex-wrap gap-1">
                {brandOptions.map(b => (
                  <button
                    key={b}
                    className={`btn btn-sm ${selectedBrands.includes(b) ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill`}
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => toggleBrand(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-4">
              <label className="form-label font-semibold text-dark text-sm">Price Range (₹)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline-primary w-100 mt-2" onClick={fetchProducts}>Apply Price</button>
            </div>

            {/* Storage Filter */}
            <div className="mb-4">
              <label className="form-label font-semibold text-dark text-sm">Storage</label>
              <div className="d-flex flex-wrap gap-1">
                {storageOptions.map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${selectedStorage.includes(s) ? 'btn-dark' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => toggleStorage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="mb-4">
              <label className="form-label font-semibold text-dark text-sm">Condition</label>
              {conditionOptions.map(c => (
                <div key={c} className="form-check text-sm mb-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cond-${c}`}
                    checked={selectedCondition.includes(c)}
                    onChange={() => toggleCondition(c)}
                  />
                  <label className="form-check-label text-secondary" htmlFor={`cond-${c}`}>
                    {c.replace('_', ' ')}
                  </label>
                </div>
              ))}
            </div>

            {/* Warranty Checkbox */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="warrantySwitch"
                checked={warrantyOnly}
                onChange={(e) => setWarrantyOnly(e.target.checked)}
              />
              <label className="form-check-label font-semibold text-success text-sm" htmlFor="warrantySwitch">
                🛡️ Shop Warranty Only
              </label>
            </div>
          </div>
        </div>

        {/* Catalog Main Content */}
        <div className="col-lg-9">
          {/* Sorting Bar */}
          <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded-3 border shadow-sm">
            <span className="text-secondary small font-semibold">Page {page + 1} of {totalPages || 1}</span>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Sort By:</span>
              <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="most_viewed">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading shop inventory...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-5 text-center rounded-4 border my-4">
              <h4 className="font-heading text-muted mb-2">No Mobile Phones Found</h4>
              <p className="text-secondary small mb-3">Try adjusting your filters or search terms.</p>
              <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="row g-4">
              {products.map(product => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-muted small px-3">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogPage;
