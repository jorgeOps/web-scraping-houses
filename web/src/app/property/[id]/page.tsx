"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft, MapPin, Expand, Bed, Bath } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl flex items-center justify-center text-zinc-400">Cargando mapa...</div>
});

interface PropertyDetail {
    id: string;
    title: string;
    description: string;
    price: string;
    images: string[];
    features: Record<string, string>;
    size?: string;
    bedrooms?: string;
    bathrooms?: string;
    latitude?: number;
    longitude?: number;
}

export default function PropertyDetailPage() {
    const params = useParams();
    const [property, setProperty] = useState<PropertyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [activeTab, setActiveTab] = useState<"description" | "features">("description");

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`/api/properties/${params.id}`);
                if (!res.ok) throw new Error("Property not found");
                const data = await res.json();
                setProperty(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchDetail();
    }, [params.id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
        </div>
    );

    if (error || !property) return (
        <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
            <p className="text-red-500 mb-4">{error || "Propiedad no encontrada"}</p>
            <Link href="/" className="text-zinc-900 underline">Volver al inicio</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-white dark:bg-black font-sans pb-20">
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-md flex justify-between items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium hover:opacity-70 transition-opacity p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Link>
                {/* Optional: Add share button or simple title here */}
            </nav>

            {/* Gallery Hero */}
            <section className="relative h-[60vh] md:h-[70vh] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden cursor-zoom-in group" onClick={() => setShowLightbox(true)}>
                {property.images.length > 0 ? (
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={property.images[selectedImage]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                            <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">Click para ver completa</span>
                        </div>
                    </motion.div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">Sin imágenes</div>
                )}

                {/* Thumbnails Overlay */}
                <div className="absolute bottom-6 left-0 right-0 p-4 flex justify-center gap-2 overflow-x-auto z-10 scrollbar-hide" onClick={(e) => e.stopPropagation()}>
                    {property.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`relative w-16 h-12 md:w-20 md:h-14 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? "border-white scale-110 shadow-lg" : "border-white/20 opacity-70 hover:opacity-100"
                                }`}
                        >
                            <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                        </button>
                    ))}
                </div>
            </section>

            {/* Lightbox Modal */}
            {showLightbox && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity" onClick={() => setShowLightbox(false)}>
                    <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 text-white hover:text-zinc-300 p-2 z-50">
                        <span className="text-4xl leading-none">&times;</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1)); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full transition-colors hidden md:flex items-center justify-center z-50"
                    >
                        <ArrowLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0)); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full transition-colors hidden md:flex items-center justify-center z-50"
                    >
                        <ArrowLeft className="w-8 h-8 rotate-180" />
                    </button>
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={property.images[selectedImage]}
                            alt={property.title}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm font-medium">
                        {selectedImage + 1} / {property.images.length}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">{property.title}</h1>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center text-zinc-500 font-medium">
                                <MapPin className="w-5 h-5 mr-1" />
                                <span className="text-lg">Madrid</span>
                            </div>

                            {/* Summary Icons */}
                            <div className="flex flex-wrap gap-6 text-zinc-700 dark:text-zinc-300">
                                {property.size && (
                                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                                        <Expand className="w-5 h-5" />
                                        <span className="font-semibold">{property.size}</span>
                                    </div>
                                )}
                                {property.bedrooms && (
                                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                                        <Bed className="w-5 h-5" />
                                        <span className="font-semibold">{property.bedrooms} Hab.</span>
                                    </div>
                                )}
                                {property.bathrooms && (
                                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                                        <Bath className="w-5 h-5" />
                                        <span className="font-semibold">{property.bathrooms} Baños</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <div className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl inline-block shadow-lg">
                            <p className="text-3xl font-bold tracking-tight">{property.price}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`pb-4 px-6 text-lg font-medium transition-all relative ${activeTab === "description"
                            ? "text-black dark:text-white"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            }`}
                    >
                        Descripción
                        {activeTab === "description" && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("features")}
                        className={`pb-4 px-6 text-lg font-medium transition-all relative ${activeTab === "features"
                            ? "text-black dark:text-white"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            }`}
                    >
                        Características
                        {activeTab === "features" && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                        )}
                    </button>
                </div>

                <div className="min-h-[300px]">
                    {/* Features Sidebar / Grid */}
                    {/* User requested a "table with 2 columns" look. 
                        We will use a Grid with 2 columns, where each item looks like a row. */}
                    {activeTab === "description" ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose prose-zinc dark:prose-invert max-w-none prose-lg"
                        >
                            <div className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {property.description || "Sin descripción disponible."}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            {Object.entries(property.features).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                    {Object.entries(property.features).map(([key, value], idx) => (
                                        <div key={key} className="flex justify-between items-center py-3 border-b border-zinc-200 dark:border-zinc-800">
                                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">{key}</span>
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-500">
                                    No hay características especificadas para esta propiedad.
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Map Section */}
                {property.latitude && property.longitude && (
                    <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Ubicación aproximada</h2>
                        <PropertyMap lat={property.latitude} lng={property.longitude} />
                    </section>
                )}
            </div>
        </main>
    );
}
