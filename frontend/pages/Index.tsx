import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { ChatBot } from '@/components/ChatBot';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Header } from '@/components/Header';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans selection:bg-purple-100 selection:text-purple-900">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* AI Chatbot Section */}
      <section className="py-24 bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="font-medium">24/7 AI Assistant</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Personal Relocation Guide</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Ask anything in Hindi, English, or Hinglish. We're here to help you settle down.
            </p>
          </div>

          <ChatBot onNavigate={navigate} />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <img src="/logo.png" alt="SettleEase Logo" className="h-24 w-auto mb-4 object-contain brightness-0 invert opacity-90" />
              <p className="text-gray-400 leading-relaxed max-w-sm">
                Making relocation in India simple, safe, and stress-free. Your AI-powered buddy for finding home, food, and local help.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/services" className="hover:text-white transition-colors">PG & Flats</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Tiffin Service</a></li>
                <li><a href="/emergency" className="hover:text-white transition-colors">Emergency SOS</a></li>
                <li><a href="/language" className="hover:text-white transition-colors">Language Help</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 SettleEase. Made with ❤️ for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
