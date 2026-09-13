import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiService } from '@/services/api';
import { MapPin, Clock, MessageCircle, X, IndianRupee, Calendar, Tag, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

import { toast } from '@/hooks/use-toast';

interface Requirement {
    id: string | number;
    title?: string;
    type?: string;
    category?: string;
    area: string;
    city?: string;
    budget?: number;
    description: string;
    timeline?: string;
    status: string;
    created_at?: string;
}

const BrowseRequirements = () => {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
    const [submittingInterest, setSubmittingInterest] = useState(false);

    const categories = ['All', 'PG', 'Flat', 'Tiffin', 'Maid', 'Plumber', 'Electrician', 'Internet'];

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        setLoading(true);
        try {
            const { data, error } = await apiService.getAllRequirements();
            if (error) throw error;
            setRequirements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching requirements:', error);
            setRequirements([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequirements = filter === 'All'
        ? requirements
        : requirements.filter(req =>
            req.category?.toLowerCase() === filter.toLowerCase() ||
            req.type?.toLowerCase() === filter.toLowerCase() ||
            req.title?.toLowerCase().includes(filter.toLowerCase())
        );

    const getCategoryColor = (cat?: string) => {
        const map: Record<string, string> = {
            internet: 'bg-blue-50 text-blue-700',
            pg: 'bg-purple-50 text-purple-700',
            flat: 'bg-indigo-50 text-indigo-700',
            tiffin: 'bg-orange-50 text-orange-700',
            maid: 'bg-pink-50 text-pink-700',
            plumber: 'bg-cyan-50 text-cyan-700',
            electrician: 'bg-yellow-50 text-yellow-700',
        };
        return map[cat?.toLowerCase() || ''] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-1">Browse Requirements</h1>
                        <p className="text-muted-foreground">Find customers looking for your services.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filter === cat
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : filteredRequirements.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                            <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium">No requirements found in this category yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">Check back soon or select a different filter.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRequirements.map((req) => (
                                <div key={req.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getCategoryColor(req.category || req.type)}`}>
                                            {req.category || req.type || 'General'}
                                        </span>
                                        {req.created_at && (
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-1">{req.title || 'Relocation Need'}</h4>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{req.description}</p>

                                    <div className="space-y-1.5 text-sm text-gray-500 mb-5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="truncate">{req.area}{req.city ? `, ${req.city}` : ''}</span>
                                        </div>
                                        {req.budget && (
                                            <div className="flex items-center gap-2">
                                                <IndianRupee className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span className="font-medium text-green-700">Budget: ₹{Number(req.budget).toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {req.timeline && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span>{req.timeline}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setSelectedReq(req)}
                                        className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        View & Respond
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Respond Modal ── */}
            {selectedReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slide-up">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedReq(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Category badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getCategoryColor(selectedReq.category || selectedReq.type)}`}>
                            {selectedReq.category || selectedReq.type || 'General'}
                        </span>

                        <h2 className="text-xl font-bold mt-3 mb-1">{selectedReq.title || 'Customer Requirement'}</h2>

                        {/* Details */}
                        <div className="space-y-3 my-4">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">Description</p>
                                    <p className="text-sm text-gray-700">{selectedReq.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                                    </div>
                                    <p className="text-sm font-medium">{selectedReq.area}{selectedReq.city ? `, ${selectedReq.city}` : ''}</p>
                                </div>

                                {selectedReq.budget && (
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Budget</p>
                                        </div>
                                        <p className="text-sm font-bold text-green-700">₹{Number(selectedReq.budget).toLocaleString('en-IN')}</p>
                                    </div>
                                )}

                                {selectedReq.timeline && (
                                    <div className="p-3 bg-orange-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Timeline</p>
                                        </div>
                                        <p className="text-sm font-medium">{selectedReq.timeline}</p>
                                    </div>
                                )}

                                {selectedReq.category && (
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Tag className="w-3.5 h-3.5 text-blue-600" />
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Type</p>
                                        </div>
                                        <p className="text-sm font-medium capitalize">{selectedReq.category}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-xs text-muted-foreground mb-3 text-center">
                                📞 Contact this customer through SettleEase platform
                            </p>
                            <Button
                                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                                disabled={submittingInterest}
                                onClick={async () => {
                                    setSubmittingInterest(true);
                                    const { error } = await apiService.expressInterest(selectedReq.id);
                                    setSubmittingInterest(false);
                                    toast({
                                        title: "Interest Registered! 🎉",
                                        description: "The customer will see your service details on their dashboard.",
                                    });
                                    setSelectedReq(null);
                                }}
                            >
                                <Phone className="w-4 h-4" />
                                {submittingInterest ? 'Registering...' : 'Express Interest'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseRequirements;
