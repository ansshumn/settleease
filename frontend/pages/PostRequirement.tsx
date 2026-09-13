import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FileText, Send, CheckCircle, Trash2, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';

interface Requirement {
  id?: string | number;
  category?: string;
  type?: string;
  title?: string;
  area: string;
  budget?: number;
  description: string;
  timeline?: string;
  status?: string;
}

const requirementTypes = [
  'PG',
  'Flat',
  'Tiffin',
  'Maid',
  'Plumber',
  'Electrician',
  'Internet',
];

const timelines = [
  'Immediate',
  'Within 1 week',
  'Within 1 month',
  'No rush',
];

const PostRequirement = () => {
  const [formData, setFormData] = useState({
    type: '',
    area: '',
    budget: '',
    description: '',
    timeline: '',
  });
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Load existing user requirements from Django
  useEffect(() => {
    if (user) {
      apiService.getUserRequirements().then(({ data }) => {
        if (Array.isArray(data)) {
          setRequirements(data);
        }
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) newErrors.type = 'Please select a requirement type';
    if (!formData.area) newErrors.area = 'Please enter area/pincode';
    if (!formData.budget || parseInt(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }
    if (!formData.description) newErrors.description = 'Please describe your requirement';
    if (!formData.timeline) newErrors.timeline = 'Please select a timeline';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to post your requirement",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    // Django API Call - Real Database Insert
    const payload = {
      title: `${formData.type} in ${formData.area}`,
      category: formData.type.toLowerCase(),
      type: formData.type,
      area: formData.area,
      budget: parseInt(formData.budget),
      description: formData.description,
      timeline: formData.timeline,
      status: 'open'
    };

    const { data, error } = await apiService.createRequirement(payload);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Failed to post",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      setRequirements(prev => [data, ...prev]);
      setFormData({ type: '', area: '', budget: '', description: '', timeline: '' });
      setShowSuccess(true);

      toast({
        title: "Requirement Posted! ✅",
        description: "Your requirement is now live for service providers!",
      });

      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-md text-center">
            <div className="glass-card p-8 animate-slide-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Login Required 🔐</h2>
              <p className="text-muted-foreground mb-6">
                Please login to post your requirements and find services easily.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full bg-gradient-primary"
                >
                  Login / Sign Up
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Post Your Requirement</span>
            </h1>
            <p className="text-muted-foreground">
              Batao kya chahiye, hum best options dhoond kar denge! 🎯
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-accent" />
              <div>
                <p className="font-medium text-foreground">Requirement Posted Successfully!</p>
                <p className="text-sm text-muted-foreground">Providers in your area can now see your request.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
            <div className="space-y-5">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  What do you need? <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={`input-glass ${errors.type ? 'border-destructive' : ''}`}
                >
                  <option value="">Select requirement type</option>
                  {requirementTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Area / Pincode <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  placeholder="e.g., Koramangala or 560034"
                  className={`input-glass ${errors.area ? 'border-destructive' : ''}`}
                />
                {errors.area && <p className="text-sm text-destructive mt-1">{errors.area}</p>}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Budget (₹) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Enter your budget"
                    className={`input-glass pl-8 ${errors.budget ? 'border-destructive' : ''}`}
                    min="0"
                  />
                </div>
                {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your requirements in detail..."
                  rows={4}
                  className={`input-glass resize-none ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Timeline <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  className={`input-glass ${errors.timeline ? 'border-destructive' : ''}`}
                >
                  <option value="">When do you need this?</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
                {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Post Requirement
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Requirements List */}
          {requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Posted Requirements</h2>
              <div className="space-y-4">
                {requirements.map((req, idx) => (
                  <div key={req.id || idx} className="service-card p-4 animate-fade-in">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
                          {req.category || 'General'}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-foreground mb-1">{req.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Area: {req.area}</span>
                      {req.budget && <span className="font-bold text-primary">Budget: ₹{req.budget}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostRequirement;
