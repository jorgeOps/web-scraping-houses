import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPriceDual(priceString: string | undefined | null) {
    if (!priceString) return { euro: "", xaf: "", rate: "" };

    // Extract numeric value from "1.200.000 €" -> 1200000
    // Remove "€", remove spaces, remove "." (thosuand separator)
    // Be careful if "," is decimal separator. Assuming integer for property prices usually.
    // If format matches "1.234,56", we replace . with empty and , with .
    // But safe bet for Spain is "." as thousand sep and "," as decimal.
    // Let's standardise: plain digits.

    // Simple approach: remove non-digits.
    const cleanFn = (s: string) => s.replace(/[^0-9,]/g, '').replace(',', '.');
    const numericStr = cleanFn(priceString);
    const val = parseFloat(numericStr);

    if (isNaN(val)) return { euro: priceString, xaf: "", rate: "" };

    const conversionRate = 650;
    const xafVal = Math.round(val * conversionRate);

    // Format Back
    const euroFormatted = priceString; // Keep original formatting
    const xafFormatted = new Intl.NumberFormat('es-ES').format(xafVal) + " FCFA";

    return {
        euro: euroFormatted,
        xaf: xafFormatted,
        rate: "1 € = 650 FCFA (aprox)"
    };
}
