"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        setSent(true);
    };

    return (
        <main className="min-h-screen bg-white dark:bg-black font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="group flex items-center gap-2 text-sm font-medium tracking-wide uppercase opacity-80 hover:opacity-100 transition-opacity">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Volver al inicio
                </Link>
                <div className="font-bold tracking-tighter text-xl hidden md:block">O.S ARQUITECTURA</div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Visual / Info Section */}
                <div className="relative bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-center p-8 md:p-20 order-2 lg:order-1">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10"
                    >
                        <h2 className="text-zinc-500 dark:text-zinc-400 font-medium mb-6 uppercase tracking-wider text-sm">Contacto</h2>
                        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-black dark:text-white tracking-tight leading-[0.9]">
                            Hablemos de <br />
                            <span className="text-zinc-400 dark:text-zinc-600">su visión.</span>
                        </h1>

                        <div className="space-y-8">
                            <div className="group flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white dark:bg-black shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-1">Visítenos</p>
                                    <p className="text-lg md:text-xl font-medium">Calle de Serrano, 45<br />28001 Madrid, España</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white dark:bg-black shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-1">Escríbanos</p>
                                    <Link href="mailto:info@osarquitectura.com" className="text-lg md:text-xl font-medium hover:underline decoration-1 underline-offset-4 decoration-zinc-400">
                                        info@osarquitectura.com
                                    </Link>
                                </div>
                            </div>

                            <div className="group flex items-start gap-4">
                                <div className="p-3 rounded-full bg-white dark:bg-black shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-1">Llámenos</p>
                                    <Link href="tel:+34910000000" className="text-lg md:text-xl font-medium hover:underline decoration-1 underline-offset-4 decoration-zinc-400">
                                        +34 910 000 000
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20">
                            <p className="text-sm text-zinc-500">© {new Date().getFullYear()} O.S Arquitectura. Todos los derechos reservados.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Form Section */}
                <div className="bg-white dark:bg-black flex flex-col justify-center p-8 md:p-20 order-1 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md w-full mx-auto"
                    >
                        {!sent ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wide">Nombre</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-4 text-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                        placeholder="Su nombre"
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-4 text-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                        placeholder="correo@ejemplo.com"
                                        value={formState.email}
                                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-wide">Mensaje</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-4 text-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700 resize-none"
                                        placeholder="¿En qué podemos ayudarle?"
                                        value={formState.message}
                                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="group w-full bg-black dark:bg-white text-white dark:text-black py-4 px-8 rounded-full text-lg font-medium tracking-wide hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
                                    <ArrowUpRight className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Mensaje Enviado</h3>
                                <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Gracias por contactar con O.S Arquitectura. Nos pondremos en contacto con usted en breve.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-sm font-medium uppercase tracking-wide border-b border-black dark:border-white pb-1 hover:opacity-50 transition-opacity"
                                >
                                    Enviar otro mensaje
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
