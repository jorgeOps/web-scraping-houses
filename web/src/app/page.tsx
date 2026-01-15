"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Clean price string: "1.200.000 €" -> 1200000
      // "Consultar" -> -1 (or handle differently)
      const parsePrice = (priceStr: string) => {
        if (!priceStr || priceStr.toLowerCase().includes("consultar")) return -1;
        const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
        return isNaN(num) ? -1 : num;
      };

      const price = parsePrice(prop.price);

      // If price is unknown/consultar, maybe show it unless filtered?
      // Let's assume if user sets a filter, they want specific prices.
      // If no filter, show everything.

      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;

      if (price === -1) {
        // Keep "Consultar" items only if no specific range is set implies usually show them?
        // Or separate toggle? Let's just include them if no filter is active, exclude if strictly filtering.
        // User request: "filter by prices".
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
    <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">
            The Mirror <span className="font-light text-zinc-500">Estate</span>
          </h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Venta</Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contacto</Link>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 mb-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
          Encuentra tu hogar <br />
          <span className="bg-gradient-to-r from-zinc-500 to-black dark:from-zinc-400 dark:to-white bg-clip-text text-transparent">
            con Alma
          </span>
        </h2>
        <p className="text-zinc-500 max-w-xl mx-auto mb-10">
          Una selección exclusiva de propiedades en Madrid, actualizadas en tiempo real.
        </p>

        {/* Filters */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-500">Precio:</span>
            <input
              type="number"
              placeholder="Min €"
              className="p-2 w-32 bg-zinc-50 dark:bg-black rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-zinc-300">-</span>
            <input
              type="number"
              placeholder="Max €"
              className="p-2 w-32 bg-zinc-50 dark:bg-black rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          {/* Optional: Clear button */}
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { setMinPrice(""); setMaxPrice(""); }}
              className="text-xs font-medium text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-10 bg-red-50 rounded-xl">
            Error al cargar propiedades: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 text-center text-sm text-zinc-500">
        <p>© 2025 Mirror Estate. Datos obtenidos de The Well Come Home.</p>
      </footer>
    </main>
  );
}
