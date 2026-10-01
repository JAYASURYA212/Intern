import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Layers,
  Sparkles,
  Heart,
  User,
  LayoutDashboard,
  Scale,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const MobileBottomNav = () => {
  const { user, isOwner } = useAuth();
  const { wishlistProducts } = useWishlist();

  return (
    <div className="mobile-bottom-nav d-lg-none">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Layers size={20} />
        <span>Stock</span>
      </NavLink>

      <NavLink
        to="/compare"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Scale size={19} />
        <span>Compare</span>
      </NavLink>

      <NavLink
        to="/sell-your-mobile"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""}`
        }
      >
        <div className="bg-primary text-white p-2 rounded-circle shadow mb-1">
          <Sparkles size={18} />
        </div>
        <span className="text-primary fw-bold">Sell</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? "active" : ""} position-relative`
        }
      >
        <Heart size={20} />
        {wishlistProducts.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.55rem" }}
          >
            {wishlistProducts.length}
          </span>
        )}
        <span>Saved</span>
      </NavLink>

      {isOwner ? (
        <NavLink
          to="/owner/dashboard"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Owner</span>
        </NavLink>
      ) : (
        <NavLink
          to={user ? "/customer/sell-requests" : "/login"}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <User size={20} />
          <span>{user ? "Account" : "Login"}</span>
        </NavLink>
      )}
    </div>
  );
};

export default MobileBottomNav;
