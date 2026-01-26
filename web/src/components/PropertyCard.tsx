import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { formatPriceDual } from "@/lib/utils";

interface PropertyCardProps {
    property: Property;
    showDualCurrency?: boolean;
}

export function PropertyCard({ property, showDualCurrency = true }: PropertyCardProps) {
    // Format ID to look like "Ref 1052"
    const displayRef = "Ref " + property.id.replace(/ref[- ]?/i, "");

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
                <div className="flex flex-col gap-1 pt-2">
                    {/* Top Row: Prices */}
                    <div className="flex justify-between items-start">
                        {/* Left: Euro Price */}
                        <div className="text-xl font-bold text-black leading-none">
                            {prices.euro}
                        </div>

                        {/* Right: XAF Price & Rate */}
                        {showDualCurrency && prices.xaf && (
                            <div className="text-right leading-none">
                                <div className="text-sm font-bold text-gray-600">
                                    {prices.xaf}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                    {prices.rate}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details in one line */}
                    <div className="text-sm text-black mt-1">
                        {[
                            property.size ? `${property.size}` : null,
                            property.bedrooms ? `${property.bedrooms} dormitorios` : null,
                            property.bathrooms ? `${property.bathrooms} baños` : null
                        ].filter(Boolean).join(", ")}
                    </div>

                    {/* Reference */}
                    <div className="text-xs text-gray-400">
                        {displayRef}
                    </div>

                    {/* Ver Ficha Link */}
                    <div className="text-sm text-gray-400 underline group-hover:text-blue-600 transition-colors mt-1">
                        Ver ficha
                    </div>
                </div>
            </Link>
        </div>
    );
}
