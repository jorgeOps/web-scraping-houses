"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPriceDual } from "@/lib/utils";
// Removed Framer Motion and Lucide for a simpler look, using standard HTML entities or basic text

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

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && property) {
            setSelectedImageIndex((selectedImageIndex + 1) % property.images.length);
        }
    };
    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && property) {
            setSelectedImageIndex((selectedImageIndex - 1 + property.images.length) % property.images.length);
        }
    };

    if (loading) return (
        <div className="p-8 text-center font-serif">
            Cargando ficha...
        </div>
    );

    if (error || !property) return (
        <div className="p-8 text-center font-serif">
            <p className="text-red-700 font-bold">Error: {error || "Propiedad no encontrada"}</p>
            <Link href="/" className="underline text-blue-800">Volver al índice</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-white text-black p-4 md:p-12 font-serif max-w-5xl mx-auto border-0 md:border md:border-gray-200 md:mt-4 md:shadow-sm print:shadow-none print:border-none">
            {/* Header: Title and Price */}
            <header className="border-b-2 border-black pb-4 mb-6 md:mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <Link href="/" className="text-sm text-gray-600 underline mb-2 block print:hidden">&lt; Volver al listado</Link>
                    <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black leading-tight">{property.title}</h1>
                    <p className="text-base md:text-lg text-gray-700 mt-1">Ref: {property.id} | Madrid</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-black border-2 border-black px-4 py-2 inline-block">
                        {property.price}
                    </p>
                    {property.price && (() => {
                        const prices = formatPriceDual(property.price);
                        if (!prices.xaf) return null;
                        return (
                            <div className="text-right">
                                <p className="text-lg text-gray-700 font-light">{prices.xaf}</p>
                                <p className="text-xs text-gray-500 font-light mt-1">{prices.rate}</p>
                            </div>
                        );
                    })()}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column: Images */}
                <div className="space-y-4">
                    <div className="relative w-full aspect-[4/3] border border-black bg-gray-100 cursor-pointer group" onClick={() => openLightbox(0)}>
                        {property.images[0] ? (
                            <>
                                <Image
                                    src={property.images[0]}
                                    alt="Main view"
                                    fill
                                    className="object-cover transition-opacity group-hover:opacity-90"
                                    unoptimized
                                />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Ampliar</div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Sin foto principal</div>
                        )}
                    </div>
                    {/* Grid of secondary images */}
                    {property.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {property.images.slice(1, 9).map((img, idx) => (
                                <div key={idx} className="relative w-full aspect-square border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => openLightbox(idx + 1)}>
                                    <Image src={img} alt={`View ${idx}`} fill className="object-cover" unoptimized />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details & Description */}
                <div>
                    <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Resumen de Características</h2>
                    <table className="w-full text-sm mb-6 border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="py-2 font-bold text-gray-600">Superficie:</td>
                                <td className="py-2 text-right">{property.size || "-"}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="py-2 font-bold text-gray-600">Habitaciones:</td>
                                <td className="py-2 text-right">{property.bedrooms || "-"}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="py-2 font-bold text-gray-600">Baños:</td>
                                <td className="py-2 text-right">{property.bathrooms || "-"}</td>
                            </tr>
                            {/* Dynamic Features */}
                            {Object.entries(property.features).map(([key, value]) => (
                                <tr key={key} className="border-b border-gray-300">
                                    <td className="py-2 font-bold text-gray-600">{key}:</td>
                                    <td className="py-2 text-right">{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Descripción</h2>
                    <div className="text-sm text-justify leading-relaxed whitespace-pre-line text-gray-800">
                        {property.description}
                    </div>
                </div>
            </div>

            {/* Footer / Contact for Brochure */}

            {/* Lightbox Overlay */}
            {selectedImageIndex !== null && property && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-0 md:p-4 backdrop-blur-sm" onClick={closeLightbox}>
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full md:bg-transparent">
                        <span className="text-2xl md:text-4xl">&times;</span>
                    </button>

                    <div className="relative w-full h-full flex-1 flex items-center justify-center">
                        <Image
                            src={property.images[selectedImageIndex]}
                            alt={`Gallery image ${selectedImageIndex + 1}`}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>

                    {/* Controls Footer */}
                    <div className="w-full p-4 flex justify-between items-center text-white bg-black/80 md:bg-transparent md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:pointer-events-none">
                        <button
                            className="p-4 text-4xl font-light hover:text-gray-300 md:pointer-events-auto"
                            onClick={prevImage}
                        >
                            &lt;
                        </button>

                        <span className="text-sm text-white/70 md:absolute md:bottom-4 md:left-0 md:right-0 md:text-center pointer-events-auto">
                            {selectedImageIndex + 1} / {property.images.length}
                        </span>

                        <button
                            className="p-4 text-4xl font-light hover:text-gray-300 md:pointer-events-auto"
                            onClick={nextImage}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
