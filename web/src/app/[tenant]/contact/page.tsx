"use client";

import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif p-4 md:p-12">
            <header className="mb-8 border-b-2 border-black pb-4">
                <Link href="/" className="text-sm text-gray-600 underline mb-2 block">&lt; Volver al inicio</Link>
                <h1 className="text-3xl md:text-4xl font-bold text-black uppercase">Contacto</h1>
            </header>

            <div className="max-w-2xl mx-auto space-y-8 text-lg text-gray-800">
                <section>
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">O.S Arquitectura</h2>
                    <p className="mb-2">
                        Estudio de arquitectura especializado en reformas integrales y gestión de patrimonio inmobiliario en el Barrio de Salamanca.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold mb-2">Dirección</h3>
                        <p>Calle Velázquez 15<br />28001 Madrid<br />España</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Contacto</h3>
                        <p>
                            <a href="mailto:info@well-come-home.com" className="underline hover:text-blue-800">info@well-come-home.com</a>
                        </p>
                        <p>
                            <a href="tel:+34910000000" className="underline hover:text-blue-800">+34 91 000 0000</a>
                        </p>
                    </div>
                </section>

                <section className="bg-gray-50 p-6 border border-gray-100">
                    <p className="text-sm text-gray-600">
                        Si está interesado en alguna de nuestras propiedades exclusivas o desea que gestionemos la venta de su inmueble, no dude en contactarnos.
                    </p>
                </section>
            </div>
        </main>
    );
}
