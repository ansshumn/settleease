import { djangoFetch } from "../lib/django";

export const apiService = {
    // 1. SERVICES API
    async getServices(filters?: { category?: string; city?: string; priceMin?: number; priceMax?: number; sortBy?: string; my_services?: boolean }) {
        const queryParams = new URLSearchParams();

        if (filters?.category) queryParams.append("category", filters.category);
        if (filters?.city) queryParams.append("city", filters.city);
        if (filters?.my_services) queryParams.append("my_services", "true");

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const { data, error } = await djangoFetch(`/services/${queryString}`);
        return { data: data || [], error };
    },


    async createService(serviceData: any) {
        const { data, error } = await djangoFetch("/services/", {
            method: "POST",
            body: JSON.stringify(serviceData)
        });
        return { data, error };
    },

    async deleteService(id: number | string) {
        const { data, error } = await djangoFetch(`/services/${id}/`, {
            method: "DELETE"
        });
        return { data, error };
    },

    // 2. REQUIREMENTS API
    async createRequirement(requirement: any) {
        const { data, error } = await djangoFetch("/requirements/", {
            method: "POST",
            body: JSON.stringify(requirement)
        });
        return { data, error };
    },

    // Get all requirements (for providers to browse)
    async getAllRequirements(filters?: { area?: string; category?: string }) {
        const queryParams = new URLSearchParams();
        if (filters?.area) queryParams.append("area", filters.area);
        if (filters?.category) queryParams.append("category", filters.category);
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        const { data, error } = await djangoFetch(`/requirements/${queryString}`);
        return { data: data || [], error };
    },

    // Get only logged-in user's own requirements
    async getUserRequirements() {
        const { data, error } = await djangoFetch("/requirements/?my=true");
        return { data: data || [], error };
    },

    // Mark requirement as fulfilled
    async markRequirementFulfilled(id: number | string) {
        const { data, error } = await djangoFetch(`/requirements/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status: "fulfilled" })
        });
        return { data, error };
    },

    // Provider expresses interest in a requirement
    async expressInterest(requirementId: number | string, message?: string) {
        const { data, error } = await djangoFetch(`/requirements/${requirementId}/respond/`, {
            method: "POST",
            body: JSON.stringify({ message: message || "Hi, I am interested in fulfilling your requirement!" })
        });
        return { data, error };
    },

    // Get responses for a specific requirement
    async getRequirementResponses(requirementId: number | string) {
        const { data, error } = await djangoFetch(`/requirements/${requirementId}/responses/`);
        return { data: data || [], error };
    },

    // 3. EMERGENCY CONTACTS API
    async getEmergencyContacts(pincode?: string) {
        const queryString = pincode ? `?pincode=${pincode}` : "";
        const { data, error } = await djangoFetch(`/emergency/${queryString}`);
        return { data: data || [], error };
    },

    // 4. LANGUAGES API
    async getLanguages(category?: string) {
        const queryString = category ? `?category=${category}` : "";
        const { data, error } = await djangoFetch(`/languages/${queryString}`);
        return { data: data || [], error };
    },

    // 5. CHATBOT API
    async getChatHistory() {
        const { data, error } = await djangoFetch("/chat/");
        return { data: data || [], error };
    },

    async sendMessage(message: string) {
        const { data, error } = await djangoFetch("/chat/", {
            method: "POST",
            body: JSON.stringify({ message })
        });
        return { data, error };
    }
};
