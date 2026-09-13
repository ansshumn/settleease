import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { djangoFetch } from '@/lib/django';
import {
    Users, Briefcase, ClipboardList, TrendingUp,
    Trash2, Shield, ShieldOff, Search, X,
    CheckCircle2, XCircle, BarChart3, Home, LogOut, Eye
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    role: string;
    city: string;
    is_active: boolean;
    date_joined: string;
}
interface Service {
    id: number;
    name: string;
    category: string;
    city: string;
    price: string;
    rating: number;
    verified: boolean;
    user: number;
}
interface Requirement {
    id: number;
    title: string;
    category: string;
    area: string;
    budget: string;
    status: string;
    created_at: string;
    user: number;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }: {
    icon: any; label: string; value: number | string; color: string;
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="text-3xl font-black text-gray-900 mt-0.5">{value}</p>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'services' | 'requirements'>('overview');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ type: string; id: number; name: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // ── Auth guard: only superuser/staff ──────────────────────────────────────
    useEffect(() => {
        if (!user) { navigate('/auth'); return; }
        // Allow access only to admin users (is_staff or role === 'admin')
        const u = user as any;
        if (!u.is_staff && !u.is_superuser && u.role !== 'admin') {
            navigate('/');
        }
    }, [user]);

    // ── Fetch all data ────────────────────────────────────────────────────────
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [uRes, sRes, rRes] = await Promise.all([
                djangoFetch('/accounts/admin/users/'),
                djangoFetch('/services/'),
                djangoFetch('/requirements/'),
            ]);
            setUsers(uRes.data || []);
            setServices(sRes.data || []);
            setRequirements(rRes.data || []);
        } catch (e) {
            showToast('Failed to load data', false);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Delete service ────────────────────────────────────────────────────────
    const deleteService = async (id: number) => {
        setActionLoading(true);
        const { error } = await djangoFetch(`/services/${id}/`, { method: 'DELETE' });
        if (!error) {
            setServices(prev => prev.filter(s => s.id !== id));
            showToast('Service deleted', true);
        } else showToast('Delete failed', false);
        setActionLoading(false);
        setDeleteModal(null);
    };

    // ── Delete requirement ────────────────────────────────────────────────────
    const deleteRequirement = async (id: number) => {
        setActionLoading(true);
        const { error } = await djangoFetch(`/requirements/${id}/`, { method: 'DELETE' });
        if (!error) {
            setRequirements(prev => prev.filter(r => r.id !== id));
            showToast('Requirement deleted', true);
        } else showToast('Delete failed', false);
        setActionLoading(false);
        setDeleteModal(null);
    };

    // ── Delete user ────────────────────────────────────────────────────────────
    const deleteUser = async (id: number) => {
        setActionLoading(true);
        const { error } = await djangoFetch(`/accounts/admin/users/${id}/delete/`, { method: 'DELETE' });
        if (!error) {
            setUsers(prev => prev.filter(u => u.id !== id));
            showToast('User deleted successfully', true);
        } else showToast('User delete failed', false);
        setActionLoading(false);
        setDeleteModal(null);
    };

    // ── Filtered lists ────────────────────────────────────────────────────────
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(search.toLowerCase())
    );
    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRequirements = requirements.filter(r =>
        (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.area || '').toLowerCase().includes(search.toLowerCase())
    );

    const providerCount = users.filter(u => u.role === 'service_provider').length;
    const userCount = users.filter(u => u.role === 'user').length;
    const openReqs = requirements.filter(r => r.status === 'open').length;

    const tabs = [
        { key: 'overview', label: 'Overview', icon: BarChart3 },
        { key: 'users', label: 'Users', icon: Users },
        { key: 'services', label: 'Services', icon: Briefcase },
        { key: 'requirements', label: 'Requirements', icon: ClipboardList },
    ] as const;

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading Admin Panel...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* ── Sidebar ── */}
            <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col fixed inset-y-0 left-0 z-30 shadow-2xl">
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">SettleEase</p>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => { setActiveTab(key); setSearch(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === key
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            {key === 'users' && <span className="ml-auto bg-slate-600 text-slate-200 text-xs px-2 py-0.5 rounded-full">{users.length}</span>}
                            {key === 'services' && <span className="ml-auto bg-slate-600 text-slate-200 text-xs px-2 py-0.5 rounded-full">{services.length}</span>}
                            {key === 'requirements' && <span className="ml-auto bg-slate-600 text-slate-200 text-xs px-2 py-0.5 rounded-full">{requirements.length}</span>}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                        <Home className="w-4 h-4" /> Back to Site
                    </button>
                    <button onClick={() => { signOut(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="ml-64 flex-1 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">
                            {activeTab === 'overview' && '📊 Dashboard Overview'}
                            {activeTab === 'users' && '👥 Manage Users'}
                            {activeTab === 'services' && '🏢 Manage Services'}
                            {activeTab === 'requirements' && '📋 Manage Requirements'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Welcome, {user?.first_name || user?.username}</p>
                    </div>
                    <button onClick={fetchAll} className="text-xs bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition font-medium">
                        ↻ Refresh
                    </button>
                </div>

                {/* Search bar (not on overview) */}
                {activeTab !== 'overview' && (
                    <div className="relative mb-6 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
                    </div>
                )}

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={Users} label="Total Users" value={userCount} color="bg-blue-50 text-blue-600" />
                            <StatCard icon={Briefcase} label="Providers" value={providerCount} color="bg-purple-50 text-purple-600" />
                            <StatCard icon={TrendingUp} label="Services Live" value={services.length} color="bg-green-50 text-green-600" />
                            <StatCard icon={ClipboardList} label="Open Requirements" value={openReqs} color="bg-amber-50 text-amber-600" />
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Users */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" /> Recently Joined Users
                                </h2>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map(u => (
                                        <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                {(u.first_name || u.username).charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{u.first_name || u.username}</p>
                                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'service_provider' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {u.role === 'service_provider' ? 'Provider' : 'User'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Requirements */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-amber-500" /> Recent Requirements
                                </h2>
                                <div className="space-y-3">
                                    {requirements.slice(0, 5).map(r => (
                                        <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                <ClipboardList className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{r.title || r.category}</p>
                                                <p className="text-xs text-gray-400">{r.area} • ₹{Number(r.budget).toLocaleString('en-IN')}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {r.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── USERS TABLE ── */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">User</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Role</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">City</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {(u.first_name || u.username).charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{u.first_name || u.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'service_provider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role === 'service_provider' ? 'Provider' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.city || '—'}</td>
                                        <td className="px-6 py-4">
                                            {u.is_active
                                                ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
                                                : <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Inactive</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setDeleteModal({ type: 'user', id: u.id, name: u.first_name || u.username })}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── SERVICES TABLE ── */}
                {activeTab === 'services' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Service</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Category</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">City</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Price</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Verified</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredServices.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No services found</td></tr>
                                ) : filteredServices.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold capitalize">{s.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{s.city}</td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">₹{Number(s.price).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            {s.verified
                                                ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Shield className="w-3.5 h-3.5" /> Verified</span>
                                                : <span className="flex items-center gap-1 text-gray-400 text-xs font-medium"><ShieldOff className="w-3.5 h-3.5" /> Unverified</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setDeleteModal({ type: 'service', id: s.id, name: s.name })}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete service"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── REQUIREMENTS TABLE ── */}
                {activeTab === 'requirements' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Title</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Category</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Area</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Budget</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredRequirements.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No requirements found</td></tr>
                                ) : filteredRequirements.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{r.title || r.category || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold capitalize">{r.category || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{r.area}</td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">₹{Number(r.budget).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {r.status === 'open' ? 'Open' : r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setDeleteModal({ type: 'requirement', id: r.id, name: r.title || r.category })}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete requirement"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* ── Delete Confirm Modal ── */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete {deleteModal.type}?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            "<span className="font-medium text-gray-700">{deleteModal.name}</span>" permanently delete ho jayegi. Yeh action undo nahi hoga.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button
                            onClick={() => {
                                if (deleteModal.type === 'service') deleteService(deleteModal.id);
                                else if (deleteModal.type === 'requirement') deleteRequirement(deleteModal.id);
                                else deleteUser(deleteModal.id);
                            }}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast ── */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
