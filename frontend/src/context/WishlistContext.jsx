import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistProducts([]);
      setWishlistIds(new Set());
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/wishlist');
      setWishlistProducts(res.data);
      setWishlistIds(new Set(res.data.map((p) => p.id)));
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return false;
    }
    try {
      const res = await API.post(`/wishlist/${productId}`);
      if (res.data.status === 'added') {
        setWishlistIds((prev) => new Set([...prev, productId]));
      } else {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
      fetchWishlist();
      return true;
    } catch (err) {
      console.error("Failed to update wishlist", err);
      return false;
    }
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistProducts, wishlistIds, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
