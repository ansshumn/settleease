import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Join = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Choose Your Role <span className="text-primary">🏠</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Join SettleEase as a user looking for services or as a provider offering them.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* User Card */}
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="group relative bg-white border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/auth')}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Home className="w-8 h-8 text-blue-600" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">I'm Moving</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Find PGs, tiffins, and trusted local services easily. Post your requirements and let verified providers contact you.
                        </p>

                        <button className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                            Continue as User <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>

                    {/* Provider Card */}
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="group relative bg-white border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => navigate('/provider-auth')}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="w-8 h-8 text-purple-600" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">I'm a Service Provider</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Connect with people who need your services. Browse active requirements, manage leads, and grow your business.
                        </p>

                        <button className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                            Continue as Provider <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Join;
