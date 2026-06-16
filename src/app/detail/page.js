"use client";

import { useState } from "react";
import productsData from "../utils/bags.json"; 
import counter from "../utils/cart.json";

export default function ProductPage() {
  const product = productsData[0]; // Binding our specific JSON data item
  const [items, setItems] = useState([ { "count": 0 } ]);

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);

  return (
    <div className="bg-[#f9f9f9] text-[#1b1b1b] antialiased overflow-x-hidden min-h-screen selection:bg-neutral-200">
      
      {/* Dynamic Sticky TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white border-b border-[#cfc4c5] transition-shadow duration-300">
        <div className="flex justify-between items-center w-full px-16 py-6 max-w-[1440px] mx-auto">
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-black font-bold border-b border-black pb-1 uppercase tracking-widest text-[13px]" href="#">Collections</a>
            <a className="text-[#5e5e5d] font-normal hover:text-black transition-colors duration-300 uppercase tracking-widest text-[13px]" href="#">Archives</a>
            <a className="text-[#5e5e5d] font-normal hover:text-black transition-colors duration-300 uppercase tracking-widest text-[13px]" href="#">Our Story</a>
          </div>
          <div className="cursor-pointer">
            <h1 className="font-serif text-[48px] tracking-tighter text-black uppercase">SOVA OFFICIAL</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="material-symbols-outlined cursor-pointer">Search</span>
            <div className="relative cursor-pointer">
              <span className="material-symbols-outlined">Shopping bag</span>
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-none">{items[0]?.count}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Content Area */}
      <main className="max-w-[1440px] mx-auto px-16 py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Dynamic Media Showcase (Left-hand side) */}
          <div className="md:col-span-7 space-y-4 animate-[fadeIn_1.2s_ease-out_forwards]">
            <div className="bg-white overflow-hidden group border border-[#cfc4c5]">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnail Navigation Rack */}
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((imgUrl, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-25 border overflow-hidden ${activeImage === imgUrl ? 'border-black' : 'border-[#cfc4c5]'}`}
                  >
                    <img src={imgUrl} alt={`View ${idx}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Editorial Controls & Specs Panel (Right-hand side) */}
          <div className="md:col-span-4 md:col-start-9 flex flex-col space-y-8 animate-[fadeIn_1.2s_ease-out_forwards] [animation-delay:0.2s]">
            
            <header className="space-y-4">
              <p className="text-[13px] font-semibold text-[#4c4546] tracking-widest uppercase">{product.sku}</p>
              <h2 className="font-serif text-[32px] text-black leading-tight font-normal">{product.name}</h2>
              <p className="font-serif text-[24px] text-black">{new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}</p>
            </header>

            {/* Interactive Color Selection - Rendering Hex Codes dynamically from JSON */}
            <div className="space-y-3 border-t border-[#cfc4c5] pt-6">
              <h3 className="text-[13px] font-semibold tracking-widest text-black uppercase">COLOR: <span className="font-normal text-[#5e5e5d]">{selectedColor}</span></h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-8 h-8 rounded-none border transition-all ${selectedColor === color.name ? 'ring-2 ring-black ring-offset-2 border-transparent' : 'border-neutral-400'}`}
                  />
                ))}
              </div>
            </div>

            {/* Silhouette Description Module */}
            <div className="space-y-4 border-t border-[#cfc4c5] pt-6">
              <h3 className="text-[13px] font-semibold tracking-widest text-black uppercase">THE SILHOUETTE</h3>
              <p className="text-[18px] text-[#4c4546] leading-relaxed font-normal font-sans">
                {product.silhouette_description}
              </p>
            </div>

            {/* Dynamic Artisan Metadata Stack */}
            <div className="space-y-6 pt-4 border-t border-[#cfc4c5]">
              <div className="flex items-start space-x-4">
                <div>
                  <h4 className="text-[13px] font-semibold tracking-widest text-black uppercase">BRAND</h4>
                  <p className="text-[15px] text-[#5e5e5d] font-sans">{product.brand}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div>
                  <h4 className="text-[13px] font-semibold tracking-widest text-black uppercase">ORIGIN</h4>
                  <p className="text-[15px] text-[#5e5e5d] font-sans">{product.origin}</p>
                </div>
              </div>

              {/* Dynamic Dimensions Block */}
              <div className="flex items-start space-x-4">
                <div>
                  <h4 className="text-[13px] font-semibold tracking-widest text-black uppercase">DIMENSIONS</h4>
                  <p className="text-[15px] text-[#5e5e5d] font-sans">
                    H: {product.dimensions.height} × W: {product.dimensions.width} × D: {product.dimensions.depth}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Action Blocks */}
            <div className="pt-4 space-y-4">
            <button 
                disabled={!product.in_stock}
                onClick={() => setItems(items.map((item, index) => index === 0 ? { ...item, count: item.count + 1 } : item))}
                className="w-full bg-black text-white py-5 text-[13px] font-semibold tracking-widest uppercase transition-opacity hover:opacity-85 active:scale-[0.99] disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-none">
                {product.in_stock ? "ADD TO BAG" : "SOLD OUT"}
            </button>
              <button className="w-full border border-black text-black py-5 text-[13px] font-semibold tracking-widest uppercase transition-colors hover:bg-black hover:text-white rounded-none">
                FIND IN STORE
              </button>
            </div>
          </div>
        </div>

        {/* Ambient Editorial Divider Banner */}
        <section className="mt-[120px] border-t border-[#cfc4c5] pt-[120px] flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="material-symbols-outlined text-[#A8A9AD] mb-6 !text-[48px]">diamond</span>
          <h3 className="font-serif text-[32px] mb-6 font-normal">Designed for the Quiet Authority</h3>
          <p className="text-[18px] text-[#4c4546] max-w-2xl leading-relaxed font-sans font-normal">
            {product.atmospheric_quote}
          </p>
        </section>
      </main>
    </div>
  );
}