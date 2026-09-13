import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { Header } from '@/components/Header';
import { MapPin, Clock, MessageSquare, Plus, X, Phone, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Requirement {
    id: string | number;
    title?: string;
    type?: string;
    category?: string;
    area: string;
    city?: string;
    budget: number;
    description: string;
    timeline?: string;
    status: string;
    created_at: string;
}

const UserDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showResponsesFor, setShowResponsesFor] = useState<string | number | null>(null);
    const [responsesMap, setResponsesMap] = useState<Record<string | number, any[]>>({});
    const [loadingResponses, setLoadingResponses] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth', { replace: true });
                return;
            }
            fetchRequirements();
            apiService.getServices().then(({ data }) => setProviders(data || []));
        }
    }, [user, authLoading, navigate]);

    const fetchRequirements = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getUserRequirements();
            setRequirements(data || []);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResponses = async (reqId: string | number) => {
        setShowResponsesFor(reqId);
        setLoadingResponses(true);
        const { data } = await apiService.getRequirementResponses(reqId);
        setResponsesMap(prev => ({ ...prev, [reqId]: data || [] }));
        setLoadingResponses(false);
    };

    const handleMarkFulfilled = async (id: string | number) => {
        const { error } = await apiService.markRequirementFulfilled(id);
        if (!error) {
            setRequirements(prev =>
                prev.map(r => r.id === id ? { ...r, status: 'fulfilled' as const } : r)
            );
        }
    };

    const currentResponses = showResponsesFor ? (responsesMap[showResponsesFor] || []) : [];

    if (authLoading || loading) {
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
            <main className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* User Profile Card */}
                    <div className="glass-card p-6 mb-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold mb-1">{user?.first_name || user?.username || 'User'}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                <span>{user?.email}</span>
                                <span className="hidden md:inline">•</span>
                                <span>{user?.city || 'India'}</span>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
                            User Account
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Your Posted Requirements</h2>
                        <Button onClick={() => navigate('/post-requirement')} className="btn-primary gap-2">
                            <Plus className="w-4 h-4" />
                            Post New
                        </Button>
                    </div>

                    {requirements.length === 0 ? (
                        <div className="text-center py-16 glass-card border-dashed">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No requirements posted yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Post your first requirement to find PGs, tiffin services, or local help near you.
                            </p>
                            <Button onClick={() => navigate('/post-requirement')} variant="outline">
                                Post Requirement
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requirements.map((req) => (
                                <div
                                    key={req.id}
                                    className={`service-card p-5 transition-all hover:-translate-y-1 ${req.status === 'fulfilled' ? 'opacity-75 bg-gray-50' : 'bg-white'}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${req.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {req.status === 'open' ? 'Active' : req.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {req.created_at ? formatDistanceToNow(new Date(req.created_at), { addSuffix: true }) : ''}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{req.title || `${req.type || req.category} Requirement`}</h3>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{req.area}{req.city ? `, ${req.city}` : ''}</span>
                                        </div>
                                        {req.timeline && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>{req.timeline}</span>
                                            </div>
                                        )}
                                        <div className="font-medium text-foreground">
                                            Budget: ₹{req.budget ? req.budget.toLocaleString('en-IN') : '0'}
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {req.description}
                                    </p>

                                    <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2 text-xs h-9"
                                            disabled={req.status !== 'open'}
                                            onClick={() => handleOpenResponses(req.id)}
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Responses
                                        </Button>
                                        {req.status === 'open' && (
                                            <Button
                                                variant="ghost"
                                                className="flex-1 text-xs h-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => handleMarkFulfilled(req.id)}
                                            >
                                                ✓ Mark Fulfilled
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Responses Modal ── */}
            {showResponsesFor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slide-up max-h-[85vh] overflow-y-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setShowResponsesFor(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Interested Providers</h2>

                        {loadingResponses ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : currentResponses.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">No responses yet ⏳</h3>
                                <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
                                    Service providers in your city haven't expressed interest in this post yet. Check back soon!
                                </p>
                                <Button 
                                    onClick={() => { setShowResponsesFor(null); navigate('/services'); }}
                                    variant="outline" 
                                    className="w-full text-xs"
                                >
                                    Browse Available Services
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentResponses.map((r) => (
                                    <div key={r.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <UserIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{r.provider_service_name || r.provider_name}</h4>
                                                <p className="text-xs text-green-600 font-medium">Verified Partner • Expressed Interest</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                            "{r.message || 'Hi, I am interested in fulfilling your requirement! Please contact me.'}"
                                        </p>
                                        {r.provider_phone ? (
                                            <Button 
                                                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                                                onClick={() => window.location.href = `tel:${r.provider_phone}`}
                                            >
                                                <Phone className="w-4 h-4" />
                                                Call {r.provider_phone}
                                            </Button>
                                        ) : (
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Contact Provider
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
