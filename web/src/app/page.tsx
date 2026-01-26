"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const parsePrice = (priceStr: string) => {
        if (!priceStr || priceStr.toLowerCase().includes("consultar")) return -1;
        const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
        return isNaN(num) ? -1 : num;
      };

      const price = parsePrice(prop.price);
      // Clean dots before parsing integer from filtering inputs
      const cleanMin = minPrice.replace(/\./g, '');
      const cleanMax = maxPrice.replace(/\./g, '');

      const min = cleanMin ? parseInt(cleanMin) : 0;
      const max = cleanMax ? parseInt(cleanMax) : Infinity;

      if (price === -1) {
        if (minPrice || maxPrice) return false;
        return true;
      }

      return price >= min && price <= max;
    });
  }, [properties, minPrice, maxPrice]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black font-serif p-4 md:p-12">
      {/* Document Header */}
      {/* Document Header New Design */}
      {/* Document Header New Design */}
      <header className="mb-8 md:mb-12">
        {/* Top: Gray light */}
        <div className="text-gray-400 text-base font-light mb-1">Viviendas exclusivas en venta</div>

        {/* Main Title: Black bold */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Barrio de Salamanca</h1>

        {/* Separator Line */}
        <div className="w-full border-b border-black mb-3"></div>

        {/* Bottom Line: Description and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-light text-gray-500">
          {/* Left Description */}
          <div className="max-w-3xl italic">
            CBS les ofrece el Portfolio de viviendas en venta gestionadas por TWCH en el exclusivo Barrio de Salamanca (Madrid, España)
          </div>

          {/* Right: Filter (integrated here) */}
          <div className="shrink-0 relative group">
            <summary className="cursor-pointer hover:text-black list-none flex items-center gap-2 select-none" onClick={(e) => {
              const details = e.currentTarget.nextElementSibling;
              if (details) details.classList.toggle('hidden');
            }}>
              Filtrar por precio <span className="text-[10px] transform group-hover:rotate-180 transition-transform">▼</span>
            </summary>

            {/* Filter Dropdown */}
            <div className="hidden absolute right-0 top-full mt-2 bg-white border border-gray-200 p-4 shadow-lg z-10 w-64 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase text-gray-400">Mínimo</label>
                <input
                  type="text"
                  className="p-1 border border-gray-300 w-full text-black"
                  value={minPrice}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                    if (!raw) {
                      setMinPrice("");
                      return;
                    }
                    const formatted = new Intl.NumberFormat('es-ES').format(parseInt(raw));
                    setMinPrice(formatted);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase text-gray-400">Máximo</label>
                <input
                  type="text"
                  className="p-1 border border-gray-300 w-full text-black"
                  value={maxPrice}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                    if (!raw) {
                      setMaxPrice("");
                      return;
                    }
                    const formatted = new Intl.NumberFormat('es-ES').format(parseInt(raw));
                    setMaxPrice(formatted);
                  }}
                />
              </div>
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                  className="text-xs text-red-500 hover:text-red-700 text-right mt-1"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Grid - Looks like photo cards on a board */}
      <section>
        {loading ? (
          <div className="text-center py-20 text-gray-500 italic">Cargando catálogo...</div>
        ) : error ? (
          <div className="border border-red-500 bg-red-50 text-red-700 p-4">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Simple Footer */}

    </main>
  );
}
