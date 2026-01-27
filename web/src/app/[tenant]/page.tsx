"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";

export default function Home() {
  const params = useParams();
  const tenant = params.tenant as string;

  // Tenant Configuration
  const filterMode = tenant === "tenant-01" ? "limited" : "all";
  const showDualCurrency = tenant !== "tenant-02"; // tenant-02 is EURO only

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // 1. Exclude Rentals explicitly
      // Use normalization to handle accents (Ático -> Atico)
      const cleanTitle = prop.title?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
      const cleanPrice = prop.price?.toLowerCase() || "";

      if (cleanTitle.includes("alquiler")) return false;
      if (cleanPrice.includes("/mes") || cleanPrice.includes("mensual")) return false;

      const parsePrice = (priceStr: string) => {
        if (!priceStr || priceStr.toLowerCase().includes("consultar")) return -1;
        const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
        return isNaN(num) ? -1 : num;
      };

      const price = parsePrice(prop.price);

      // 2. Strict Price Filter: No houses < 1.000.000€
      // Note: "Consultar" properties (price == -1) are kept unless filtered by min/max manually?
      // User said "NO se muestren casas con precio inferior a 1.000.000".
      // Usually "Consultar" implies high price, so we keep them unless logic dictates otherwise.
      if (price !== -1 && price < 1000000) return false;

      // 3. User Interface Filter (Min/Max)
      const cleanMin = minPrice.replace(/\./g, '');
      const cleanMax = maxPrice.replace(/\./g, '');
      const min = cleanMin ? parseInt(cleanMin) : 0;
      const max = cleanMax ? parseInt(cleanMax) : Infinity;

      if (price === -1) {
        // If price is hidden, we usually show it unless user sets a specific max filter that might exclude it?
        // Let's keep "Consultar" visible unless user tries to filter strictly.
        if (minPrice || maxPrice) return false;
        return true;
      }

      return price >= min && price <= max;
    }).sort((a, b) => {
      const getVal = (p: string) => {
        if (!p || p.toLowerCase().includes("consultar")) return sortOrder === 'asc' ? Infinity : -Infinity;
        const num = parseInt(p.replace(/[^0-9]/g, ''));
        return isNaN(num) ? (sortOrder === 'asc' ? Infinity : -Infinity) : num;
      };

      const valA = getVal(a.price);
      const valB = getVal(b.price);

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [properties, minPrice, maxPrice, sortOrder]);

  // Effect to load state from session storage on mount/tenant change
  useEffect(() => {
    const cacheKeyProps = `properties-v2-${filterMode}`;
    const cacheKeySort = `prefs-sort-${tenant}`;
    const cacheKeyMin = `prefs-min-${tenant}`;
    const cacheKeyMax = `prefs-max-${tenant}`;

    // Restore UI State
    try {
      const s = sessionStorage.getItem(cacheKeySort);
      const mn = sessionStorage.getItem(cacheKeyMin);
      const mx = sessionStorage.getItem(cacheKeyMax);
      if (s) setSortOrder(s as 'asc' | 'desc');
      if (mn) setMinPrice(mn);
      if (mx) setMaxPrice(mx);
    } catch { }

    // Restore Properties & Fetch
    async function loadData() {
      let hasCache = false;
      try {
        const cached = sessionStorage.getItem(cacheKeyProps);
        if (cached) {
          setProperties(JSON.parse(cached));
          setLoading(false);
          hasCache = true;
        }
      } catch (e) { }

      try {
        const res = await fetch(`/api/properties?mode=${filterMode}`);
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();

        // Only update if different or no cache (simple check: length)
        // Actually always update to be fresh, but we already showed cached data so it's fine.
        setProperties(data);
        sessionStorage.setItem(cacheKeyProps, JSON.stringify(data));

        if (!hasCache) setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }

      // Restore Scroll Position if coming back from detail
      // We check session storage for the marker
      const restoreY = sessionStorage.getItem("scroll-pos-restore");
      if (restoreY) {
        const y = parseInt(restoreY);
        // Wait for render cycle
        setTimeout(() => {
          window.scrollTo({ top: y, behavior: 'smooth' }); // Smooth scroll
          sessionStorage.removeItem("scroll-pos-restore");
        }, 100);
      }
    }

    loadData();
  }, [filterMode, tenant]);

  // Effect to save UI state changes
  useEffect(() => {
    if (!tenant) return;
    sessionStorage.setItem(`prefs-sort-${tenant}`, sortOrder);
    sessionStorage.setItem(`prefs-min-${tenant}`, minPrice);
    sessionStorage.setItem(`prefs-max-${tenant}`, maxPrice);
  }, [sortOrder, minPrice, maxPrice, tenant]);

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

          {/* Right: Filter & Sort */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative group">
              <summary className="cursor-pointer hover:text-black list-none flex items-center gap-2 select-none" onClick={(e) => {
                const details = e.currentTarget.nextElementSibling;
                if (details) details.classList.toggle('hidden');
              }}>
                Ordenar por precio <span className="text-[10px] transform group-hover:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="hidden absolute right-0 top-full mt-2 bg-white border border-gray-200 p-2 shadow-lg z-10 w-40 flex flex-col gap-2">
                <button
                  onClick={() => { setSortOrder('asc'); }}
                  className={`text-xs text-left px-2 py-1 hover:bg-gray-100 ${sortOrder === 'asc' ? 'font-bold' : ''}`}
                >
                  Menor a mayor
                </button>
                <button
                  onClick={() => { setSortOrder('desc'); }}
                  className={`text-xs text-left px-2 py-1 hover:bg-gray-100 ${sortOrder === 'desc' ? 'font-bold' : ''}`}
                >
                  Mayor a menor
                </button>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative group">
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
              <PropertyCard key={prop.id} property={prop} showDualCurrency={showDualCurrency} />
            ))}
          </div>
        )}
      </section>

      {/* Simple Footer */}

    </main>
  );
}
