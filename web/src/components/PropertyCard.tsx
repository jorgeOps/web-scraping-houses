"use client";

import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { formatPriceDual } from "@/lib/utils";

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    // Format ID to look like "REF-1052"
    const displayRef = property.id.toUpperCase().replace("REF-", "REF ");

    const prices = formatPriceDual(property.price);

    return (
        <div className="group cursor-pointer border border-transparent hover:border-gray-200 p-4 transition-all duration-300">
            <Link href={`/property/${property.id}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 mb-4 overflow-hidden">
                    <Image
                        src={property.image_url || "/placeholder.jpg"}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                    {/* Overlay cue on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                        <h2 className="text-base font-bold tracking-wider text-black">{displayRef}</h2>
                        <span className="text-xs text-gray-400 group-hover:text-black transition-colors uppercase tracking-widest">Ver Ficha</span>
                    </div>

                    {/* Details with Labels */}
                    <div className="space-y-1 text-sm text-gray-600 font-light">
                        {property.size && (
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase text-xs tracking-wide">Superficie</span>
                                <span className="text-black">{property.size}</span>
                            </div>
                        )}
                        {property.bedrooms && (
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase text-xs tracking-wide">Habitaciones</span>
                                <span className="text-black">{property.bedrooms}</span>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="flex justify-between">
                                <span className="text-gray-400 uppercase text-xs tracking-wide">Baños</span>
                                <span className="text-black">{property.bathrooms}</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="pt-2 mt-1 border-t border-gray-100">
                        <div className="text-lg font-medium text-black">{prices.euro}</div>
                        {prices.xaf && (
                            <div className="flex flex-col mt-1">
                                <span className="text-sm text-gray-600 font-light leading-none">{prices.xaf}</span>
                                <span className="text-[10px] text-gray-400 font-light mt-0.5">{prices.rate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
