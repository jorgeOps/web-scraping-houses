"use client";

import { Property } from "@/types/property";
import { MapPin, Bed, Bath, Expand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <div className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={property.image_url || "/placeholder.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized // Use unoptimized if any issues with external loader
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-2xl font-bold">{property.price}</p>
                    <p className="text-sm opacity-90">{property.title}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col items-center">
                        <Expand className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{property.size || "-"}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-zinc-100 dark:border-zinc-800">
                        <Bed className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{property.bedrooms || "-"} hab.</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-zinc-100 dark:border-zinc-800">
                        <Bath className="w-5 h-5 text-zinc-400 mb-1" />
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{property.bathrooms || "-"} baños</span>
                    </div>
                </div>

                <Link
                    href={`/property/${property.id}`}
                    className="block w-full text-center bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mt-2"
                >
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}
