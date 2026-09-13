import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "Rahul Sharma",
        role: "Software Engineer",
        text: "Moving to Bangalore was overwhelming until I found SettleEase. Found a great PG near my office in 2 days!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        name: "Priya Patel",
        role: "Student",
        text: "The language guide is a lifesaver! I can now bargain with auto drivers in Kannada. Tiffin service is also amazing.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        name: "Amit Kumar",
        role: "Product Designer",
        text: "Best UI/UX I've seen in a utility app. Smooth experience and very helpful verified listings.",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by 1000+ Users</h2>
                    <p className="text-gray-600 text-lg">See what people are saying about their relocation experience.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-8 leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
