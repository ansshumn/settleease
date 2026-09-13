import { djangoFetch, setTokens, logout } from "../lib/django";

export const authService = {
    async signUp(
        email: string,
        password: string,
        name: string,
        role: "user" | "service_provider" = "user",
        phone?: string,
        city?: string,
        serviceType?: string
    ) {
        // Username automatic email se generate kar rahe hain
        const username = email.split("@")[0] + "_" + Math.floor(Math.random() * 1000);

        const { data, error } = await djangoFetch("/accounts/register/", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
                first_name: name,
                role,
                city
            })
        });

        if (error) {
            // Backend se aaye error ko properly surface karo
            const errMsg = typeof error === 'object'
                ? (error as any)?.email?.[0] || (error as any)?.username?.[0] || JSON.stringify(error)
                : String(error);
            return { data: null, error: errMsg };
        }

        if (data && !error) {
            // Register hone ke baad email se login karo
            const loginRes = await this.signIn(email, password);

            // Agar provider hai aur serviceType chuni thi, to automatically service create karo
            // Pehle check karo ki service already exist toh nahi karti
            if (role === "service_provider" && serviceType) {
                try {
                    const { data: existingServices } = await djangoFetch("/services/?my_services=true");
                    const alreadyExists = Array.isArray(existingServices) && existingServices.length > 0;

                    if (!alreadyExists) {
                        await djangoFetch("/services/", {
                            method: "POST",
                            body: JSON.stringify({
                                name: `${name} Services`,
                                category: serviceType,
                                city: city || "Bangalore",
                                area: `${city || "Bangalore"} Central`,
                                price: serviceType === 'pg' ? 8000 : serviceType === 'tiffin' ? 150 : 799,
                                price_type: serviceType === 'tiffin' ? 'daily' : 'monthly',
                                contact_number: phone || '',
                                rating: 0,
                                verified: true
                            })
                        });
                    }
                } catch (e) {
                    console.error("Auto service listing creation failed:", e);
                }
            }

            return loginRes;
        }
        return { data: null, error };
    },


    // 2. Sign In / Login (Django JWT Token)
    async signIn(usernameOrEmail: string, password: string) {
        const { data, error } = await djangoFetch("/accounts/login/", {
            method: "POST",
            body: JSON.stringify({
                username: usernameOrEmail,
                password
            })
        });

        if (data?.access && data?.refresh) {
            // Tokens ko localStorage mein save kar rahe hain
            setTokens(data.access, data.refresh);
            const user = await this.getCurrentUser();
            return { data: { user }, error: null };
        }

        return { data: null, error: error || "Invalid credentials" };
    },

    // 3. Sign Out / Logout
    async signOut() {
        logout();
        return { error: null };
    },

    // 4. Get Logged-in User Profile
    async getCurrentUser() {
        const { data, error } = await djangoFetch("/accounts/profile/");
        if (error || !data) return null;
        return data;
    },

    async createAnonymousUser() {
        return null;
    }
};
