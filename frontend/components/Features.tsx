import { motion } from 'framer-motion';
import { Home, Utensils, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        icon: Home,
        title: 'Find PG & Flats',
        description: 'Verified accommodations across all budgets. Zero brokerage options available.',
        path: '/services',
        color: 'bg-blue-500',
        gradient: 'from-blue-500 to-cyan-400'
    },
    {
        icon: Utensils,
        title: 'Daily Tiffin Services',
        description: 'Ghar jaisa khana, delivered daily. North, South, Jain & Healthy options.',
        path: '/services',
        color: 'bg-purple-500',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: AlertTriangle,
        title: 'Emergency SOS',
        description: '24/7 Support for medical emergency, police & local guardians.',
        path: '/emergency',
        color: 'bg-red-500',
        gradient: 'from-red-500 to-orange-500'
    }
];

export function Features() {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
                    <p className="text-gray-600 text-lg">We've got your relocation needs covered with our premium services.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(feature.path)}
                                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`} />

                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-6">{feature.description}</p>

                                <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">
                                    Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
