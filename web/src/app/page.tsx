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
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;

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
      <header className="border-b-4 border-black pb-6 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="w-full">
          <h1 className="text-2xl md:text-4xl font-light uppercase tracking-widest text-black leading-snug">PORTFOLIO DE VIVIENDAS EXCLUSIVAS EN EL BARRIO DE SALAMANCA (MADRID, ESPAÑA)</h1>
          <p className="text-gray-500 italic mt-4 font-serif text-base md:text-lg">CBS les presenta este portfolio de viviendas en venta gestionadas por WCH.</p>
        </div>
      </header>

      {/* Simple Filter Section */}
      {/* Minimalist Price Filter */}
      <section className="mb-12">
        <details className="group">
          <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest list-none">
            {/* Custom marker or empty */}
            <span className="opacity-50 group-open:opacity-100">Filtrar por precio +</span>
          </summary>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1">
              <input
                type="number"
                placeholder="Mínimo €"
                className="py-1 border-b border-gray-200 focus:border-gray-500 focus:outline-none font-light text-sm bg-transparent placeholder-gray-300 w-32"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span className="text-gray-300 text-sm font-light">—</span>
            <div className="flex flex-col gap-1">
              <input
                type="number"
                placeholder="Máximo €"
                className="py-1 border-b border-gray-200 focus:border-gray-500 focus:outline-none font-light text-sm bg-transparent placeholder-gray-300 w-32"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            {(minPrice || maxPrice) && (
              <button
                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                className="text-xs text-gray-400 hover:text-black uppercase tracking-wider"
              >
                Limpiar
              </button>
            )}
          </div>
        </details>
      </section>

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
