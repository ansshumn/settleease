import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { apiService } from '@/services/api';
import { 
  MessageSquare, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Loader2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceItem {
  id?: number;
  name: string;
  category: string;
  area: string;
  city: string;
  price: number | string;
  price_type: string;
  contact_number: string;
  rating?: number;
  verified?: boolean;
}

const ProviderDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State for new service
  const [formData, setFormData] = useState({
    name: '',
    category: 'internet',
    city: user?.city || 'Bangalore',
    area: '',
    price: '',
    price_type: 'monthly',
    contact_number: user?.phone || '',
  });

  const displayName = user?.first_name || user?.username || 'Partner';

  // Load Services & Leads from Django
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [servicesRes, requirementsRes] = await Promise.all([
        apiService.getServices({ my_services: true }),
        apiService.getAllRequirements(),
      ]);

      if (servicesRes.data && Array.isArray(servicesRes.data)) {
        const myServices = user?.id 
          ? servicesRes.data.filter((s: any) => s.user === user.id)
          : servicesRes.data;
        setServices(myServices);
      }
      if (requirementsRes.data && Array.isArray(requirementsRes.data)) {
        setLeadsCount(requirementsRes.data.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/provider-auth', { replace: true });
        return;
      }
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.area || !formData.price || !formData.contact_number) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill out all service details.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        city: formData.city,
        area: formData.area,
        price: parseFloat(formData.price),
        price_type: formData.price_type,
        contact_number: formData.contact_number,
        rating: 5.0,
        verified: true
      };

      const { error } = await apiService.createService(payload);

      if (error) {
        toast({
          title: "Failed to Add Service",
          description: typeof error === 'string' ? error : "Could not create service. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Service Listed Successfully! 🎉",
          description: `"${formData.name}" is now live and visible to customers.`,
        });
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          category: 'internet',
          city: user?.city || 'Bangalore',
          area: '',
          price: '',
          price_type: 'monthly',
          contact_number: user?.phone || '',
        });
        fetchDashboardData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error occurred while listing service.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to remove this service listing?")) return;

    try {
      const { error } = await apiService.deleteService(id);
      if (error) {
        toast({
          title: "Delete Failed",
          description: "Could not remove service.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Service Removed",
          description: "The service listing has been removed.",
        });
        setServices(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic rating calculation
  const avgRating = services.length > 0 
    ? (services.reduce((acc, s) => acc + (s.rating || 5.0), 0) / services.length).toFixed(1)
    : '5.0';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Service Partner
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome, {displayName} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your services, track active leads, and grow your relocation business.
              </p>
            </div>

            {/* Main Action: Add New Service Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add New Service</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div 
              onClick={() => navigate('/browse-requirements')}
              className="glass-card p-5 flex items-start justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Customer Leads</p>
                <h3 className="text-3xl font-black text-gray-900">{leadsCount}</h3>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-2 font-medium">
                  <TrendingUp className="w-3 h-3" /> Live inquiries
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-card p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">My Listed Services</p>
                <h3 className="text-3xl font-black text-gray-900">{services.length}</h3>
                <p className="text-xs text-blue-600 mt-2 font-medium">{services.length === 0 ? 'No services listed' : 'Live on platform'}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-card p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Provider Rating</p>
                {services.length > 0 && services.some(s => Number(s.rating) > 0) ? (
                  <>
                    <h3 className="text-3xl font-black text-gray-900">{avgRating} ★</h3>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Based on customer feedback</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800">New 🌟</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Awaiting first customer review</p>
                  </>
                )}
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>


            <div className="glass-card p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Account Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-green-700 text-lg">Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Accepting inquiries</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>


          {/* Manage Services Section */}
          <div className="glass-card p-6 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Manage Your Listed Services
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View and manage all services currently listed under your provider account.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Service
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm">Loading your services from database...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-gray-700">No Services Listed Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  Aapne abhi tak koi service add nahi ki hai. Naye customers paane ke liye apni pehli service list karein!
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm"
                >
                  <Plus className="w-4 h-4" /> List Your First Service
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((item) => (
                  <div 
                    key={item.id || item.name} 
                    className="bg-white rounded-xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {item.category}
                        </span>
                        {item.verified && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.area}, {item.city}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.contact_number}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">Price: </span>
                        <span className="font-bold text-primary text-sm">
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-muted-foreground">/{item.price_type}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteService(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-bold mb-4">Provider Hub</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate('/browse-requirements')}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:-translate-y-1 transition-transform group"
            >
              <Search className="w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Browse Customer Leads</h3>
              <p className="text-blue-100 text-sm">Find new users seeking PG, tiffin, or maintenance services.</p>
            </div>

            <div
              onClick={() => navigate('/services')}
              className="bg-white border border-border/50 p-6 rounded-2xl text-foreground shadow-sm hover:shadow-lg cursor-pointer hover:-translate-y-1 transition-transform group"
            >
              <Briefcase className="w-8 h-8 mb-4 text-purple-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">View Public Marketplace</h3>
              <p className="text-muted-foreground text-sm">See how your services look live to moving customers.</p>
            </div>

            {/* 🆕 Post Requirement card */}
            <div
              onClick={() => navigate('/post-requirement')}
              className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 rounded-2xl text-white shadow-lg shadow-orange-400/20 cursor-pointer hover:-translate-y-1 transition-transform group"
            >
              <FileText className="w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-1">Post a Requirement</h3>
              <p className="text-orange-100 text-sm">Khud kuch chahiye? PG, tiffin ya koi service — yahan post karo!</p>
            </div>

          </div>

        </div>
      </main>

      {/* 🌟 Add New Service Dialog Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg p-6 rounded-2xl bg-white border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> List a New Service
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateService} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Service / Business Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Anand PG for Men, Swad Home Tiffin"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="pg">PG / Hostel</option>
                  <option value="tiffin">Tiffin / Food Mess</option>
                  <option value="plumber">Plumber</option>
                  <option value="maid">Maid / Housekeeping</option>
                  <option value="electrician">Electrician</option>
                  <option value="internet">Internet / WiFi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Area / Locality *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g. Koramangala 5th Block, Andheri West"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g. 7500"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price Frequency *</label>
                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="monthly">Monthly (/month)</option>
                  <option value="daily">Daily (/day)</option>
                  <option value="per_visit">Per Visit (/visit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Save & List Service
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderDashboard;

