import { useState, useEffect } from "react";
import { apiService } from "../../services/api";

interface Service {
    id: string; // Supabase uses id (uuid), not _id
    name: string;
    category: string;
    city: string;
    price: number;
    price_type: string; // Snake_case in DB
    verified: boolean;
}

export function ServicesList() {
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [services, setServices] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            const { data, error } = await apiService.getServices({ category });
            if (error) {
                console.error(error);
            } else {
                setServices(data as any);
            }
            setLoading(false);
        }
        fetchServices();
    }, [category]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Available Services (Supabase)</h2>

            <div className="flex gap-2 mb-4">
                <button onClick={() => setCategory(undefined)} className="px-4 py-2 bg-gray-200 rounded">All</button>
                <button onClick={() => setCategory("pg")} className="px-4 py-2 bg-gray-200 rounded">PGs</button>
                <button onClick={() => setCategory("tiffin")} className="px-4 py-2 bg-gray-200 rounded">Tiffin</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services?.map((service) => (
                    <div key={service.id} className="border p-4 rounded shadow">
                        <h3 className="text-xl font-semibold">{service.name}</h3>
                        <p className="text-gray-600">{service.category} - {service.city}</p>
                        <p className="font-bold mt-2">₹{service.price} / {service.price_type}</p>
                        <p className="text-sm text-green-600">{service.verified ? "Verified" : ""}</p>
                    </div>
                ))}
                {services && services.length === 0 && <p>No services found.</p>}
                {loading && <p>Loading...</p>}
            </div>
        </div>
    );
}
