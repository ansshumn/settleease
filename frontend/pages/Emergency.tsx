import { useState } from 'react';
import { Header } from '@/components/Header';
import { EmergencyCard } from '@/components/EmergencyCard';
import { emergencyData, nationalEmergency } from '@/data/emergency';
import { AlertTriangle, Search, Phone, MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Emergency = () => {
  const [pincode, setPincode] = useState('');
  const [searchedPincode, setSearchedPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const contacts = searchedPincode ? emergencyData[searchedPincode] : null;

  const handleSearch = async () => {
    if (!pincode) {
      setError('Please enter a pincode');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSearchedPincode(pincode);
    setIsLoading(false);

    if (!emergencyData[pincode]) {
      toast({
        title: "Area not found",
        description: "We don't have data for this pincode yet. Showing national helplines.",
        variant: "destructive",
      });
    }
  };

  const hospitals = contacts?.filter(c => c.type === 'hospital') || [];
  const police = contacts?.filter(c => c.type === 'police') || [];
  const pharmacies = contacts?.filter(c => c.type === 'pharmacy') || [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-destructive mx-auto mb-4 flex items-center justify-center animate-pulse-soft">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-destructive">Emergency SOS</span>
            </h1>
            <p className="text-muted-foreground">
              Nearby hospitals, police stations & pharmacies at your fingertips 🚨
            </p>
          </div>

          {/* National Emergency Numbers */}
          <div className="glass-card p-4 mb-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-destructive" />
              National Emergency Numbers
            </h2>
            <div className="flex flex-wrap gap-2">
              {nationalEmergency.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive font-medium hover:bg-destructive hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{item.name}: {item.number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Pincode Search */}
          <div className="glass-card p-6 mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Find Emergency Services Near You
            </h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter your pincode (e.g., 560078)"
                  className={`input-glass ${error ? 'border-destructive' : ''}`}
                  maxLength={6}
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="btn-gradient flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try: 560078 (JP Nagar), 560034 (Koramangala), 560066 (Whitefield), 560102 (Marathahalli), 560068 (BTM)
            </p>
          </div>

          {/* Results */}
          {searchedPincode && (
            <div className="space-y-8 animate-fade-in">
              {contacts ? (
                <>
                  {/* Hospitals */}
                  {hospitals.length > 0 && (
                    <section>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        🏥 Hospitals
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {hospitals.map((contact) => (
                          <EmergencyCard key={contact.id} contact={contact} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Police Stations */}
                  {police.length > 0 && (
                    <section>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        👮 Police Stations
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {police.map((contact) => (
                          <EmergencyCard key={contact.id} contact={contact} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Pharmacies */}
                  {pharmacies.length > 0 && (
                    <section>
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        💊 24/7 Pharmacies
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {pharmacies.map((contact) => (
                          <EmergencyCard key={contact.id} contact={contact} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="text-center py-12 glass-card">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    No local data available for pincode {searchedPincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please use the national emergency numbers above for immediate help.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Emergency;
