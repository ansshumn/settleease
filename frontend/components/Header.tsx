import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Briefcase, FileText, AlertTriangle, Languages, LogIn, LogOut, User, ChevronDown, LayoutDashboard, Search, MapPin, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocationContext, CITIES } from '@/hooks/useLocationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut, loading } = useAuth();
  const { currentCity, setCurrentCity } = useLocationContext();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = (user as any)?.is_staff || (user as any)?.is_superuser || user?.role === 'admin';

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/services', label: 'Services', icon: Briefcase },
    ];

    if (!user) {
      return [
        ...commonItems,
        { path: '/emergency', label: 'Emergency', icon: AlertTriangle },
        { path: '/language', label: 'Language', icon: Languages },
      ];
    }

    if (userRole === 'service_provider') {
      return [
        ...commonItems,
        { path: '/browse-requirements', label: 'Browse Requirements', icon: Search },
        { path: '/provider-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ];
    }

    // Default User Role
    return [
      ...commonItems,
      { path: '/post-requirement', label: 'Post Requirement', icon: FileText },
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SettleEase Logo" className="h-20 md:h-24 w-auto object-contain hover:scale-105 transition-transform drop-shadow-sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Join Dropdown (Only for non-logged-in users) */}
            {!user && (
              <HoverCard openDelay={100} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <Link
                    to="/join"
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 group ${isActive('/join')
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground font-medium hover:bg-muted bg-white/50 border border-border/50 shadow-sm'
                      }`}
                  >
                    <span className="text-sm">Join SettleEase</span>
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 p-2" align="center">
                  <div className="grid gap-1">
                    <Link
                      to="/auth"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Home className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">I'm Moving</div>
                        <div className="text-xs text-muted-foreground">Find homes & services</div>
                      </div>
                    </Link>
                    <Link
                      to="/provider-auth"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">I'm a Provider</div>
                        <div className="text-xs text-muted-foreground">Offer your services</div>
                      </div>
                    </Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </nav>

          {/* City Selector */}
          <div className="hidden md:flex items-center gap-2 mr-4 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-primary/20 hover:bg-primary/5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{currentCity}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => setCurrentCity('All Cities')} className={currentCity === 'All Cities' ? "bg-primary/10 font-medium" : ""}>
                  All Cities
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Tier 1 Cities</div>
                {CITIES.tier1.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setCurrentCity(city)} className={currentCity === city ? "bg-primary/10 font-medium" : ""}>
                    {city}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Tier 2 Cities</div>
                {CITIES.tier2.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setCurrentCity(city)} className={currentCity === city ? "bg-primary/10 font-medium" : ""}>
                    {city}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Tier 3 Cities</div>
                {CITIES.tier3.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setCurrentCity(city)} className={currentCity === city ? "bg-primary/10 font-medium" : ""}>
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 rounded-full border border-border/50 hover:bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-inner">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-medium">
                        {user.user_metadata?.name || user.first_name || user.username || 'User'}
                      </span>
                      <span className="text-muted-foreground">
                        {userRole === 'service_provider' ? 'Provider' : 'User'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs text-muted-foreground font-mono">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(userRole === 'service_provider' ? '/provider-dashboard' : '/dashboard')}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="text-purple-600 font-semibold">
                      <Shield className="w-4 h-4 mr-2 text-purple-600" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="btn-primary flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-muted/40 hover:bg-muted active:bg-muted/80 active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in bg-background/95 backdrop-blur-md absolute left-0 right-0 px-4 shadow-xl rounded-b-2xl">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {!user && (
                <div className="pt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Join SettleEase
                  </div>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Home className="w-5 h-5" />
                    <span>I'm Moving</span>
                  </Link>
                  <Link
                    to="/provider-auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>I'm a Provider</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-border/50">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.user_metadata?.name || user.first_name || user.username || 'User'}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="destructive"
                    className="w-full justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
