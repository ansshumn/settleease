import { motion } from 'framer-motion';
import { Star, MapPin, Phone, CheckCircle, Sparkles, Heart, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceCardProps {
  name: string;
  area: string;
  price: number;
  priceUnit: string;
  rating: number;
  verified: boolean;
  isNew: boolean;
  distance: string;
  contact: string;
  tags?: string[];
  image?: string;
  type?: string;
  onContact: () => void;
}

export function ServiceCard({
  name,
  area,
  price,
  priceUnit,
  rating,
  verified,
  isNew,
  distance,
  contact,
  tags = [],
  image,
  type,
  onContact,
}: ServiceCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getPlaceholderImage = () => {
    if (image) return image;
    if (type?.includes('boy') || type?.includes('girl') || type?.includes('pg'))
      return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (type?.includes('tiffin') || type?.includes('food'))
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1581578731117-104529302f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = contact.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi! I am interested in your service "${name}" on SettleEase.`);
    window.open(`https://wa.me/91${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsOpen(true)}
        className="group relative bg-white rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Image Banner */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getPlaceholderImage()}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {verified && (
              <div className="glass-card px-2 py-1 flex items-center gap-1 text-xs font-medium text-emerald-600 bg-white/90 backdrop-blur-md">
                <CheckCircle className="w-3 h-3 fill-emerald-100" />
                Verified
              </div>
            )}
            {isNew && (
              <div className="glass-card px-2 py-1 flex items-center gap-1 text-xs font-medium text-blue-600 bg-white/90 backdrop-blur-md animate-pulse">
                <Sparkles className="w-3 h-3 fill-blue-100" />
                New
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2 rounded-full glass hover:scale-110 transition-transform active:scale-95"
          >
            <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
          </button>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">₹{price.toLocaleString('en-IN')}</span>
              <span className="text-sm opacity-90">{priceUnit}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-700">{rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{area}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{distance}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5 h-12 overflow-hidden content-start">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-gray-100 text-gray-600 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Contact</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-3 py-2.5 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 active:scale-95 transition-all font-medium"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 🌟 Detail Modal Popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl bg-white border">
          <div className="relative h-56 w-full">
            <img src={getPlaceholderImage()} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              {verified && (
                <span className="px-2 py-1 text-xs font-semibold bg-emerald-500 text-white rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Provider
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <DialogTitle className="text-2xl font-bold text-white mb-1">{name}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <MapPin className="w-4 h-4" />
                <span>{area}</span>
                <span>•</span>
                <span>{distance}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Price & Rating */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Pricing</p>
                <p className="text-2xl font-black text-primary">₹{price.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-600">{priceUnit}</span></p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-800 text-lg">{rating}</span>
              </div>
            </div>

            {/* Features / Tags */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Highlights & Features</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-medium text-xs rounded-lg border border-blue-100">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details & Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onContact();
                  setIsOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-95 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call ({contact})
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
