import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Phone, Eye, EyeOff, Briefcase, MapPin } from 'lucide-react';
import { z } from 'zod';

const providerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15, 'Phone is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  serviceType: z.string().min(1, 'Please select a service type'),
  city: z.string().min(2, 'City is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const serviceTypes = [
  { value: 'pg', label: 'PG / Hostel' },
  { value: 'tiffin', label: 'Tiffin Service' },
  { value: 'maid', label: 'Maid Service' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'internet', label: 'Internet Provider' },
];

const ProviderAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceType: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, signInAsDemo, user, userRole } = useAuth();

  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'service_provider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back! 🎉',
            description: 'Successfully logged in',
          });
          // Redirect handled by useEffect
        }
      } else {
        const result = providerSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          'service_provider',
          formData.phone,
          formData.city,
          formData.serviceType
        );


        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please login instead.',
              variant: 'destructive',
            });
          } else if (error.message.toLowerCase().includes('rate limit')) {
            toast({
              title: 'Too Many Attempts',
              description: 'You have exceeded the signup rate limit. Please wait a while before trying again.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Registration Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Registration Successful! 🎉',
            description: `Welcome! Your ${formData.serviceType} service is now registered.`,
          });
          navigate('/provider-dashboard');
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="glass-card p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? 'Provider Login 💼' : 'Become a Provider 💼'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? 'Login to manage your services'
                  : 'Register your service on SettleEase'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Business / Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Service name / Owner name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select onValueChange={(val) => handleSelectChange('serviceType', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && <p className="text-xs text-destructive">{errors.serviceType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Bangalore"
                        value={formData.city}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}

              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register as Provider'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  const { error } = await signInAsDemo('service_provider');
                  if (!error) {
                    toast({
                      title: 'Demo Provider Mode! 🚀',
                      description: 'You are now logged in as a demo provider.',
                    });
                    navigate('/provider-dashboard');
                  }
                }}
              >
                Try Demo Provider (No Signup Required)
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "New provider? " : 'Already registered? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? 'Register here' : 'Login'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Looking for services? {' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth')}
                  className="text-primary font-medium hover:underline"
                >
                  User Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderAuth;
