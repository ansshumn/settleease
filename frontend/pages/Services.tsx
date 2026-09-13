import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ServiceCard } from '@/components/ServiceCard';
import { pgListings, tiffinServices, localServices } from '@/data/services';
import { apiService } from '@/services/api';
import { Search, Home, UtensilsCrossed, Wrench, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocationContext, CITIES } from '@/hooks/useLocationContext';

type ServiceTab = 'pg' | 'tiffin' | 'local';

const tabs = [
  { id: 'pg' as ServiceTab, label: 'PG & Flats', icon: Home },
  { id: 'tiffin' as ServiceTab, label: 'Tiffin Services', icon: UtensilsCrossed },
  { id: 'local' as ServiceTab, label: 'Local Services', icon: Wrench },
];

const localCategories = ['all', 'maid', 'plumber', 'electrician', 'carpenter', 'internet'];

const Services = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('pg');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentCity, setCurrentCity } = useLocationContext();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [localCategory, setLocalCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [backendServices, setBackendServices] = useState<any[]>([]);

  useEffect(() => {
    const loadBackendServices = async () => {
      try {
        const { data } = await apiService.getServices();
        if (data && Array.isArray(data)) {
          setBackendServices(data);
        }
      } catch (e) {
        console.error("Could not fetch live backend services", e);
      }
    };
    loadBackendServices();
  }, []);

  const handleContact = (name: string, phone: string) => {
    toast({
      title: "Contact Details",
      description: `${name}: ${phone}`,
    });
    window.location.href = `tel:${phone}`;
  };

  // Merge backend services into PG listings
  const allPGs = [
    ...backendServices
      .filter(s => s.category === 'pg')
      .map(s => ({
        id: `db-${s.id}`,
        name: s.name,
        area: s.area,
        city: s.city,
        price: Number(s.price),
        rating: s.rating || 4.8,
        verified: s.verified ?? true,
        isNew: true,
        distance: 'Nearby',
        contact: s.contact_number,
        type: 'unisex' as const,
        amenities: ['WiFi', 'Furnished', 'Verified'],
        image: undefined as string | undefined,
      })),
    ...pgListings,
  ];

  // Merge backend services into Tiffin listings
  const allTiffins = [
    ...backendServices
      .filter(s => s.category === 'tiffin')
      .map(s => ({
        id: `db-${s.id}`,
        name: s.name,
        area: s.area,
        city: s.city,
        pricePerDay: Number(s.price),
        rating: s.rating || 4.9,
        verified: s.verified ?? true,
        isNew: true,
        distance: 'Nearby',
        contact: s.contact_number,
        cuisines: ['North Indian', 'Homestyle'],
        deliveryTime: '30-45 mins',
        image: undefined as string | undefined,
      })),
    ...tiffinServices,
  ];

  // Merge backend services into Local Services listings
  const allLocal = [
    ...backendServices
      .filter(s => !['pg', 'tiffin'].includes(s.category))
      .map(s => ({
        id: `db-${s.id}`,
        name: s.name,
        category: s.category,
        area: s.area,
        city: s.city,
        price: Number(s.price),
        priceUnit: `/${s.price_type || 'visit'}`,
        rating: s.rating || 4.8,
        verified: s.verified ?? true,
        distance: 'Nearby',
        contact: s.contact_number,
        experience: '5+ yrs exp',
        image: undefined as string | undefined,
      })),
    ...localServices,
  ];

  const filteredPGs = allPGs.filter((pg) => {
    const matchesSearch = pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pg.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = currentCity === 'All Cities' || !currentCity || pg.city?.toLowerCase().includes(currentCity.toLowerCase()) || pg.area?.toLowerCase().includes(currentCity.toLowerCase());
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    const matchesPrice = pg.price >= min && pg.price <= max;
    return matchesSearch && matchesCity && matchesPrice;
  });

  const filteredTiffins = allTiffins.filter((tiffin) => {
    const matchesSearch = tiffin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tiffin.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = currentCity === 'All Cities' || !currentCity || tiffin.city?.toLowerCase().includes(currentCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  const filteredLocal = allLocal.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = currentCity === 'All Cities' || !currentCity || service.city?.toLowerCase().includes(currentCity.toLowerCase());
    const matchesCategory = localCategory === 'all' || service.category === localCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });


  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Find Services</span>
            </h1>
            <p className="text-muted-foreground">
              PG, tiffin, maid, plumber – sab verified options yahan milenge!
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 rounded-xl bg-muted gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-card shadow-sm text-foreground active:scale-[0.98]'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted active:scale-[0.98]'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or area..."
                  className="input-glass pl-10"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="input-glass min-w-[200px] appearance-none"
                  >
                    <option value="All Cities">All Cities</option>
                    <optgroup label="Tier 1">
                      {CITIES.tier1.map((city) => <option key={city} value={city}>{city}</option>)}
                    </optgroup>
                    <optgroup label="Tier 2">
                      {CITIES.tier2.map((city) => <option key={city} value={city}>{city}</option>)}
                    </optgroup>
                    <optgroup label="Tier 3">
                      {CITIES.tier3.map((city) => <option key={city} value={city}>{city}</option>)}
                    </optgroup>
                  </select>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all active:scale-[0.98] ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/30 border-border hover:bg-muted/80 active:bg-muted'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                <div className="flex flex-wrap gap-4">
                  {activeTab === 'pg' && (
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="input-glass w-1/2"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="input-glass w-1/2"
                        />
                      </div>
                    </div>
                  )}
                  {activeTab === 'local' && (
                    <div className="flex flex-wrap gap-2">
                      {localCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setLocalCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${localCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          {cat === 'all' ? 'All' : cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === 'pg' && filteredPGs.map((pg) => (
              <ServiceCard
                key={pg.id}
                name={pg.name}
                area={`${pg.area}, ${pg.city}`}
                price={pg.price}
                priceUnit="/month"
                rating={pg.rating}
                verified={pg.verified}
                isNew={pg.isNew}
                distance={pg.distance}
                contact={pg.contact}
                image={pg.image}
                tags={[pg.type === 'boys' ? '🧑 Boys' : pg.type === 'girls' ? '👩 Girls' : '👥 Unisex', ...pg.amenities.slice(0, 2)]}
                onContact={() => handleContact(pg.name, pg.contact)}
              />
            ))}

            {activeTab === 'tiffin' && filteredTiffins.map((tiffin) => (
              <ServiceCard
                key={tiffin.id}
                name={tiffin.name}
                area={`${tiffin.area}, ${tiffin.city}`}
                price={tiffin.pricePerDay}
                priceUnit="/day"
                rating={tiffin.rating}
                verified={tiffin.verified}
                isNew={tiffin.isNew}
                distance={tiffin.distance}
                contact={tiffin.contact}
                image={tiffin.image}
                tags={[...tiffin.cuisines.slice(0, 2), tiffin.deliveryTime]}
                onContact={() => handleContact(tiffin.name, tiffin.contact)}
              />
            ))}

            {activeTab === 'local' && filteredLocal.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                area={`${service.area}, ${service.city}`}
                price={service.price}
                priceUnit={service.priceUnit}
                rating={service.rating}
                verified={service.verified}
                isNew={false}
                distance={service.distance}
                contact={service.contact}
                image={service.image}
                tags={[service.category, service.experience]}
                onContact={() => handleContact(service.name, service.contact)}
              />
            ))}
          </div>

          {/* Empty State */}
          {((activeTab === 'pg' && filteredPGs.length === 0) ||
            (activeTab === 'tiffin' && filteredTiffins.length === 0) ||
            (activeTab === 'local' && filteredLocal.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Koi result nahi mila. Try different filters! 🔍
                </p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Services;
