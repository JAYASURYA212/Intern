import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistProducts } = useWishlist();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1 d-flex align-items-center gap-2">
            <Heart className="text-danger" fill="#ef4444" size={24} /> My Saved Wishlist
          </h3>
          <p className="text-muted small mb-0">Mobiles you have saved for later review</p>
        </div>
        <Link to="/catalog" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border my-4">
          <Heart size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark mb-2">Your Wishlist is Empty</h4>
          <p className="text-secondary small mb-4">Browse our shop inventory and click the heart icon on any mobile to save it here.</p>
          <Link to="/catalog" className="btn btn-primary-custom px-4 rounded-pill">Explore Available Phones</Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistProducts.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
