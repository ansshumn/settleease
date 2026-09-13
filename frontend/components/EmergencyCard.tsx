import { MapPin, Phone, Navigation, Clock } from 'lucide-react';
import { EmergencyContact } from '@/data/emergency';

interface EmergencyCardProps {
  contact: EmergencyContact;
}

const typeColors = {
  hospital: 'border-destructive bg-destructive/5',
  police: 'border-primary bg-primary/5',
  pharmacy: 'border-accent bg-accent/5',
  fire: 'border-warning bg-warning/5',
  ambulance: 'border-destructive bg-destructive/5',
};

const typeLabels = {
  hospital: '🏥 Hospital',
  police: '👮 Police Station',
  pharmacy: '💊 Pharmacy',
  fire: '🚒 Fire Station',
  ambulance: '🚑 Ambulance',
};

export function EmergencyCard({ contact }: EmergencyCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        contact.name + ' ' + contact.address
      )}`,
      '_blank'
    );
  };

  return (
    <div className={`rounded-xl border-l-4 p-4 shadow-sm ${typeColors[contact.type]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-muted-foreground mb-1 block">
            {typeLabels[contact.type]}
          </span>
          <h3 className="font-semibold text-foreground">{contact.name}</h3>
        </div>
        {contact.is24x7 && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <Clock className="w-3 h-3" />
            24/7
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{contact.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Navigation className="w-4 h-4" />
          <span>{contact.distance} away</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium transition-all hover:bg-destructive/90"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </button>
        <button
          onClick={handleDirections}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-card font-medium transition-all hover:bg-muted"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
      </div>
    </div>
  );
}
