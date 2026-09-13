import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { djangoFetch } from '@/lib/django';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();
    const { signIn, signOut } = useAuth();

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: "Missing Fields",
                description: "Please enter both admin email and password.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) {
                toast({
                    title: "Access Denied 🚫",
                    description: "Invalid admin credentials.",
                    variant: "destructive",
                });
            } else {
                // Verify admin staff privileges
                const { data: profile } = await djangoFetch('/accounts/profile/');
                if (profile && (profile.is_staff || profile.is_superuser || profile.role === 'admin')) {
                    toast({
                        title: "Admin Authenticated 🛡️",
                        description: "Welcome to SettleEase Control Center.",
                    });
                    navigate('/admin');
                } else {
                    await signOut();
                    toast({
                        title: "Access Denied 🚫",
                        description: "This account does not have administrator privileges.",
                        variant: "destructive",
                    });
                }
            }
        } catch (err) {
            toast({
                title: "Login Failed",
                description: "Unable to authenticate admin account.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
                <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-fade-in">
                    
                    {/* Header Icon */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-white mb-2">Admin Portal</h1>
                        <p className="text-sm text-slate-400">
                            Restricted Access • Authorized Personnel Only
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleAdminLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Admin Email
                            </Label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@settleease.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admin-pass" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="admin-pass"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-purple-600/20 transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Secure Admin Login
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500">
                            SettleEase Security System v2.0 • Unauthorized access attempts are logged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
