"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import { bagsData } from "@/app/utils/bagsData";

function ProductCard({ product, handleAddToCart }) {
  const [hoveredImage, setHoveredImage] = useState(product.modelImages[0]);

  const handleMouseEnter = () => {
    if (product.modelImages && product.modelImages.length > 1) {
      const randomIndex = Math.floor(Math.random() * product.modelImages.length);
      setHoveredImage(product.modelImages[randomIndex]);
    }
  };

  return (
    <div 
      className="sova-product-card group relative block cursor-pointer" 
      onMouseEnter={handleMouseEnter}
    >
      {/* Image Container with Hover Swap */}
      <div className="sova-product-media relative aspect-[4/5] overflow-hidden bg-[#ebe5dc]">
        <Link href="/detail">
          {/* Primary flat/studio Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              alt={product.name}
              className="sova-product-image-primary object-cover"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              src={product.primaryImage}
              priority={product.id.includes("belted") || product.id.includes("ring")}
            />
          </div>
          {/* Secondary lifestyle/model Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              alt={`${product.name} on model`}
              className="sova-product-image-hover object-cover"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              src={hoveredImage}
            />
          </div>
        </Link>

        {/* Product Tag Badge */}
        {product.tag && (
          <span className="sova-product-tag absolute top-4 left-4 z-10">
            {product.tag}
          </span>
        )}

        {/* Premium Slide-Up Quick Add Button */}
        <button
          className="sova-quick-add-btn"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart(product);
          }}
        >
          Quick Add
        </button>
      </div>

      {/* Meta details */}
      <div className="sova-product-meta mt-4 flex flex-col items-start gap-1">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-sans text-[13px] md:text-[14px] font-medium uppercase tracking-wider text-[#171514] truncate pr-4">
            {product.name}
          </h3>
          {/* Color DOT Indicator */}
          <span
            className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
            style={{ backgroundColor: product.colorHex }}
            title={product.color}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12px] md:text-[13px] font-semibold text-[#6f433b]">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[11px] font-sans text-[#a09e99] uppercase tracking-wider">
            • {product.material}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Initialize cart items from localStorage if client-side
  useEffect(() => {
    const savedCart = localStorage.getItem("sova_cart_items");
    if (savedCart) {
      setTimeout(() => {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart items", e);
        }
      }, 0);
    }
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      let updated;
      if (existing) {
        updated = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prevItems, { product, quantity: 1 }];
      }
      localStorage.setItem("sova_cart_items", JSON.stringify(updated));
      return updated;
    });

    // Show Premium Toast
    setToastMessage(`"${product.name}" added to your shopping bag.`);
    setIsToastVisible(true);
    
    // Automatically slide out the cart drawer
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, change) => {
    setCartItems((prevItems) => {
      const updated = prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      localStorage.setItem("sova_cart_items", JSON.stringify(updated));
      return updated;
    });
  };

  const removeCartItem = (productId) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.product.id !== productId);
      localStorage.setItem("sova_cart_items", JSON.stringify(updated));
      return updated;
    });
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  // Derived filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...bagsData];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Color
    if (selectedColor !== "all") {
      result = result.filter((p) => p.color === selectedColor);
    }

    // Filter by Material
    if (selectedMaterial !== "all") {
      result = result.filter((p) => p.material === selectedMaterial);
    }

    // Sort products
    if (sortBy === "price-low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "best-selling") {
      result.sort((a, b) => {
        const aVal = a.tag === "Best Seller" ? 1 : 0;
        const bVal = b.tag === "Best Seller" ? 1 : 0;
        return bVal - aVal;
      });
    }

    return result;
  }, [selectedCategory, selectedColor, selectedMaterial, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedColor !== "all") count++;
    if (selectedMaterial !== "all") count++;
    return count;
  }, [selectedCategory, selectedColor, selectedMaterial]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedColor("all");
    setSelectedMaterial("all");
  };

  // Distinct color list derived from data
  const colorsList = useMemo(() => {
    const set = new Set(bagsData.map((p) => p.color));
    return Array.from(set);
  }, []);

  return (
    <div className="sova-page">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        {/* Banner Section */}
        <section className="text-center mb-16">
          <p className="sova-eyebrow">Collections</p>
          <h1 className="font-serif text-[48px] md:text-[64px] font-normal tracking-tight uppercase text-[#171514] mb-4">
            Bags
          </h1>
          <p className="max-w-2xl mx-auto font-sans text-[15px] md:text-[16px] text-[#5d5752] leading-relaxed">
            Minimalist sculptural leather goods built with architectural lines and quiet presence.
            Each piece is crafted in small batches with premium finishes designed for daily cadences.
          </p>
        </section>

        {/* Toolbar Section */}
        <section className="sova-collection-toolbar">
          <div className="sova-toolbar-left">
            <button
              className="sova-filter-toggle"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span className="material-symbols-outlined">
                {isFilterOpen ? "close" : "tune"}
              </span>
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </button>
            <span className="sova-product-count hidden sm:inline">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div>
            <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-[#5d5752] mr-2">
              Sort By:
            </span>
            <select
              className="sova-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* Expandable Filter Drawer */}
        <div className={`sova-filter-panel ${isFilterOpen ? "is-open" : ""}`}>
          <div className="sova-filter-grid-layout">
            {/* Category Filter */}
            <div className="sova-filter-group">
              <h4>Category</h4>
              <div className="sova-filter-options">
                {["all", "tote", "shoulder", "hobo"].map((cat) => (
                  <button
                    key={cat}
                    className={`sova-filter-btn ${selectedCategory === cat ? "is-active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "all" ? "All Categories" : cat + "s"}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="sova-filter-group">
              <h4>Material</h4>
              <div className="sova-filter-options">
                {["all", "Leather", "Suede"].map((mat) => (
                  <button
                    key={mat}
                    className={`sova-filter-btn ${selectedMaterial === mat ? "is-active" : ""}`}
                    onClick={() => setSelectedMaterial(mat)}
                  >
                    {mat === "all" ? "All Materials" : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="sova-filter-group">
              <h4>Color</h4>
              <div className="sova-filter-options">
                <button
                  className={`sova-filter-btn ${selectedColor === "all" ? "is-active" : ""}`}
                  onClick={() => setSelectedColor("all")}
                >
                  All Colors
                </button>
                {colorsList.map((colorName) => {
                  // Find a hex code matching this color name from the data
                  const colorObj = bagsData.find((p) => p.color === colorName);
                  const bgHex = colorObj ? colorObj.colorHex : "#000000";
                  return (
                    <button
                      key={colorName}
                      className={`sova-swatch-btn ${selectedColor === colorName ? "is-active" : ""}`}
                      onClick={() => setSelectedColor(colorName)}
                      style={{ backgroundColor: bgHex }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        {activeFiltersCount > 0 && (
          <div className="sova-active-filters">
            {selectedCategory !== "all" && (
              <span
                className="sova-active-filter-tag"
                onClick={() => setSelectedCategory("all")}
              >
                Category: {selectedCategory}
                <span className="material-symbols-outlined">close</span>
              </span>
            )}
            {selectedMaterial !== "all" && (
              <span
                className="sova-active-filter-tag"
                onClick={() => setSelectedMaterial("all")}
              >
                Material: {selectedMaterial}
                <span className="material-symbols-outlined">close</span>
              </span>
            )}
            {selectedColor !== "all" && (
              <span
                className="sova-active-filter-tag"
                onClick={() => setSelectedColor("all")}
              >
                Color: {selectedColor}
                <span className="material-symbols-outlined">close</span>
              </span>
            )}
            <button className="sova-clear-filters-btn" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Dynamic Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#cdbfb2] rounded-none">
            <span className="material-symbols-outlined text-[#cdbfb2] text-[48px] mb-4">
              hourglass_empty
            </span>
            <p className="font-sans text-[15px] text-[#5d5752]">
              No products found matching your active filters.
            </p>
            <button
              className="sova-button sova-button-primary mt-6 min-h-[40px] px-6 text-[12px]"
              onClick={clearAllFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Side Drawer Slide-Out Panel */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99] transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsCartOpen(false)} 
      />

      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#f7f4ef] z-[100] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-[#d8cec3]">
          <h2 className="font-serif text-[22px] uppercase tracking-wider text-[#171514]">
            Shopping Bag ({cartCount})
          </h2>
          <button 
            className="material-symbols-outlined text-[#171514] hover:opacity-60 cursor-pointer" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            close
          </button>
        </div>

        {/* Drawer Body (Scrollable list of items) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-[#cdbfb2] text-[48px] mb-4">
                shopping_bag
              </span>
              <p className="font-sans text-[15px] text-[#5d5752]">Your bag is currently empty.</p>
              <button 
                className="sova-button sova-button-primary mt-6 min-h-[44px] px-8 text-[12px]"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#d8cec3]">
              {cartItems.map((item) => (
                <div key={item.product.id} className="sova-drawer-item">
                  {/* Product Image */}
                  <div className="sova-drawer-item-img">
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="sova-drawer-item-details">
                    <div className="flex justify-between items-start">
                      <h3 className="font-sans text-[12px] md:text-[13px] font-semibold uppercase tracking-wider text-[#171514] truncate pr-2 max-w-[190px]">
                        {item.product.name}
                      </h3>
                      <span className="font-sans text-[12px] md:text-[13px] font-semibold text-[#171514]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-[#a09e99] uppercase tracking-wider mt-1">
                      {item.product.material} / {item.product.color}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4">
                      {/* Qty Selector */}
                      <div className="sova-qty-selector">
                        <button 
                          className="sova-qty-btn" 
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          -
                        </button>
                        <span className="sova-qty-value">{item.quantity}</span>
                        <button 
                          className="sova-qty-btn" 
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        className="sova-drawer-remove"
                        onClick={() => removeCartItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="sova-drawer-footer px-6 py-6 border-t border-[#d8cec3]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans text-[13px] font-semibold uppercase tracking-wider text-[#5d5752]">
                Subtotal
              </span>
              <span className="font-sans text-[18px] font-semibold text-[#171514]">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#a09e99] mb-6">
              Shipping and taxes calculated at checkout. Free shipping on orders over $150.
            </p>
            <button 
              className="w-full bg-[#171514] text-white py-4 text-[13px] font-semibold uppercase tracking-widest hover:bg-[#6f433b] transition-colors duration-300"
              onClick={() => alert("Checkout flow is not implemented in this demo.")}
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Cart Toast Notification */}
      <div className={`sova-toast ${isToastVisible ? "is-visible" : ""}`}>
        <span className="material-symbols-outlined text-[#56ad6a]">check_circle</span>
        <span>{toastMessage}</span>
        <button
          className="sova-toast-close material-symbols-outlined"
          onClick={() => setIsToastVisible(false)}
        >
          close
        </button>
      </div>

      {/* Footer Section */}
      <footer className="sova-footer">
        <div className="sova-footer-grid">
          <div>
            <Link className="sova-footer-logo" href="/">
              SOVA OFFICIAL
            </Link>
            <p>Curated leather goods for the discerning collector.</p>
          </div>

          <div>
            <h4>Collections</h4>
            <ul>
              <li><Link href="#">New Arrivals</Link></li>
              <li><Link href="#">Essentials</Link></li>
              <li><Link href="#">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4>Assistance</h4>
            <ul>
              <li><Link href="#">Care Guide</Link></li>
              <li><Link href="#">Shipping</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Newsletter</h4>
            <p>Receive early looks at new releases and studio updates.</p>
            <form className="sova-newsletter">
              <input placeholder="Email address" type="email" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="sova-footer-bottom">
          <span>© 2026 SOVA OFFICIAL. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
