import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Home, TrendingUp, ChevronRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="SettleEase Logo" className="h-32 md:h-40 w-auto object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Welcome to <span className="text-gradient">SettleEase</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Your friendly AI buddy for a smooth move to a new city! Get connected to local services, stays, and food in just a tap.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Seeker Card */}
            <button
              onClick={() => navigate('/auth')}
              className="w-full glass-card p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--warning))] to-[hsl(38_92%_40%)] flex items-center justify-center flex-shrink-0 shadow-md">
                <Home className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-1">I'm Moving</h3>
                <p className="text-muted-foreground text-sm">
                  Find PGs, tiffins, services & more
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            {/* Provider Card */}
            <button
              onClick={() => navigate('/provider-auth')}
              className="w-full glass-card p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-1">I'm a Service Provider</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with people who need your services
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Already have account */}
          <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-primary font-medium hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default RoleSelection;
