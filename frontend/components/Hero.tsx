import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const heroImages = [
    {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2671&auto=format&fit=crop",
        location: "Agra, Uttar Pradesh"
    },
    {
        url: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2574&auto=format&fit=crop",
        location: "Mumbai, Maharashtra"
    },
    {
        url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2670&auto=format&fit=crop",
        location: "Jaipur, Rajasthan"
    },
    {
        url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=2574&auto=format&fit=crop",
        location: "Kerala, God's Own Country"
    }
];

export function Hero() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const yBackend = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 bg-gradient-brand-warm">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-teal-50 -z-20" />

            {/* Animated Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '3s' }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 -z-10 mix-blend-soft-light" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-orange-200 backdrop-blur-md text-orange-700 font-medium text-sm mb-8 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>India's #1 Relocation Companion</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight font-display text-gray-900">
                        Settle<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Ease</span>
                        <br />
                        <span className="text-4xl lg:text-6xl text-gray-700 font-semibold mt-2 block">
                            Feel at Home, <br className="hidden lg:block" /> Anywhere in India 🇮🇳
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Moving to a new city? <span className="text-teal-700 font-semibold">Chinta mat karo!</span> From finding PGs to tiffin services, we've got everything sorted for your smooth transition.
                    </p>

                    {/* Zomato Style Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-8 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto lg:mx-0 relative z-20">
                        {/* Location Dropdown inside Search Bar */}
                        <div className="flex items-center gap-2 w-full sm:w-1/3 px-4 py-3 sm:border-r border-gray-200">
                            <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <select
                                className="w-full bg-transparent text-gray-700 font-medium outline-none cursor-pointer appearance-none"
                                defaultValue="Bangalore"
                            >
                                <optgroup label="Tier 1">
                                    <option>Bangalore</option>
                                    <option>Mumbai</option>
                                    <option>Delhi NCR</option>
                                    <option>Hyderabad</option>
                                </optgroup>
                                <optgroup label="Tier 2">
                                    <option>Pune</option>
                                    <option>Jaipur</option>
                                    <option>Lucknow</option>
                                </optgroup>
                                <optgroup label="Tier 3">
                                    <option>Udaipur</option>
                                    <option>Nashik</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 w-full sm:w-2/3 px-4 py-3">
                            <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                            <input
                                type="text"
                                placeholder="Search for PGs, Tiffins, or 'Need Help'"
                                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                                onClick={() => document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                        </div>

                        <button
                            onClick={() => navigate('/services')}
                            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white px-8 py-4 rounded-xl font-semibold shadow-md transition-all flex-shrink-0"
                        >
                            Search
                        </button>
                    </div>

                    {/* Stats or Trust Markers */}
                    <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-gray-600">Verified Listings</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-gray-600">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-sm font-medium text-gray-600">Pan-India</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Visua */}
                <motion.div
                    style={{ y: yBackend, opacity }}
                    initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                    className="relative hidden lg:block h-full min-h-[500px]"
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Main Illustration Image Slider */}
                        <div className="relative z-20 w-[500px] h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.02] transition-transform duration-500 bg-gray-100">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={heroImages[currentImageIndex].url}
                                    alt="India Travel and Relocation"
                                    className="w-full h-full object-cover absolute inset-0"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                />
                            </AnimatePresence>

                            {/* Overlay Content on Image */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 text-white z-20">
                                <p className="font-medium text-lg mb-1">New Beginnings in</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-400" />
                                    <AnimatePresence mode="wait">
                                        <motion.h3
                                            key={currentImageIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-3xl font-bold"
                                        >
                                            {heroImages[currentImageIndex].location}
                                        </motion.h3>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 -right-8 z-30 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
                        >
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">🏠</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Find Home</p>
                                <p className="text-sm font-bold text-gray-800">Verified PGs</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-32 -left-12 z-30 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
                        >
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">🍲</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Food</p>
                                <p className="text-sm font-bold text-gray-800">Tiffin Services</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
