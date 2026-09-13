import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, userRole, loading } = useAuth();
    const [requirements, setRequirements] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }

        if (user) {
            loadRequirements();
        }
    }, [user, loading, navigate]);

    const loadRequirements = async () => {
        const { data } = await apiService.getUserRequirements();
        if (data) setRequirements(data);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 pt-24 pb-12">

                {/* User Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl text-white font-bold">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{user?.user_metadata?.name || user?.first_name || user?.username || "User"}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <Badge variant="outline" className="mt-2 text-sm capitalize">
                                    {userRole || "User"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Requirements Section */}
                <h3 className="text-xl font-bold mb-4">My Posted Requirements</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requirements.length === 0 ? (
                        <div className="col-span-full text-center py-8 bg-white rounded-lg border border-dashed">
                            <p className="text-gray-500 mb-4">You haven't posted any requirements yet.</p>
                            <Button onClick={() => navigate("/post-requirement")}>Post a Requirement</Button>
                        </div>
                    ) : (
                        requirements.map((req) => (
                            <Card key={req.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg capitalize">{req.type} in {req.area}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span>Target: {req.budget ? `₹${req.budget}` : "N/A"}</span>
                                        <Badge variant={req.status === 'open' ? 'secondary' : 'default'}>{req.status}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
