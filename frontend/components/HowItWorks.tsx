import { motion } from 'framer-motion';
import { Search, CheckCircle, Smile } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'Search or Ask AI',
        description: 'Tell our AI what you need - "PG near Whitefield" or "Tiffin service in Koramangala".'
    },
    {
        icon: CheckCircle,
        title: 'Get Verified Results',
        description: 'Browse through verified listings with real photos, reviews & direct contact details.'
    },
    {
        icon: Smile,
        title: 'Connect & Settle',
        description: 'Connect directly with providers and settle down in your new city with zero stress.'
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-purple-600 font-semibold tracking-wider text-sm uppercase">Simple Process</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-2">How SettleEase Works</h2>
                </div>

                <div className="relative grid md:grid-cols-3 gap-12">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-gray-50 shadow-sm mb-6 relative z-10">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-white">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
