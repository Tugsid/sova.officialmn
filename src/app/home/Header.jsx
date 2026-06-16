"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header({ cartCount = 0, onCartClick }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sova-header ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="sova-nav grid grid-cols-3">
        <div className="sova-nav-links">
          <Link href="/detail">Shop</Link>
        </div>

        <Link className="sova-logo" href="/">
          SOVA OFFICIAL
        </Link>

        <div className="sova-nav-actions">
          <button aria-label="Search" className="material-symbols-outlined">search</button>
          <button 
            aria-label="Shopping bag" 
            className="sova-bag-button material-symbols-outlined"
            onClick={onCartClick}
          >
            shopping_bag
            <span>{cartCount}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
