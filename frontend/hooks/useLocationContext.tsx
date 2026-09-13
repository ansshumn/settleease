import React, { createContext, useContext, useState, useEffect } from "react";

// Indian Tier 1, 2, 3 cities classification
export const CITIES = {
    tier1: [
        "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"
    ],
    tier2: [
        "Jaipur", "Lucknow", "Chandigarh", "Indore", "Surat", "Bhopal", "Patna", "Kanpur", "Nagpur", "Vadodara"
    ],
    tier3: [
        "Udaipur", "Nashik", "Dehradun", "Ranchi", "Guwahati", "Mysore", "Bhubaneswar", "Trichy", "Jodhpur", "Gwalior"
    ]
};

// Flattened list for easy mapping
export const ALL_CITIES = [...CITIES.tier1, ...CITIES.tier2, ...CITIES.tier3];

type LocationContextType = {
    currentCity: string;
    setCurrentCity: (city: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [currentCity, setCurrentCity] = useState("All Cities"); // Default to All Cities

    const handleSetCity = (city: string) => {
        setCurrentCity(city);
    };

    return (
        <LocationContext.Provider value={{ currentCity, setCurrentCity: handleSetCity }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error("useLocationContext must be used within a LocationProvider");
    }
    return context;
}
