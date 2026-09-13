import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { authService } from "../../services/auth";

export function Chat() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    // Load User & History
    useEffect(() => {
        async function load() {
            const u = await authService.getCurrentUser();
            setUser(u);

            if (u) {
                const { data } = await apiService.getChatHistory();
                if (data) setChatHistory(data);
            }
        }
        load();
    }, []);

    const handleSend = async () => {
        if (!message || !user) return;

        // Optimistic UI could accept here, but let's wait for now
        await apiService.sendMessage(message);
        setMessage("");

        // Refresh history
        const { data } = await apiService.getChatHistory();
        if (data) setChatHistory(data);
    };

    const handleLogin = async () => {
        // Redirect to auth page
        window.location.href = "/auth";
    };

    return (
        <div className="p-4 border rounded max-w-md mx-auto mt-8 bg-white shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700">SettleEase AI Assistant (Supabase)</h2>

            <div className="h-96 overflow-y-auto border p-4 mb-4 bg-gray-50 rounded-lg flex flex-col gap-2">
                {!user ? (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Please log in to chat.</p>
                        <button onClick={handleLogin} className="text-blue-500 underline">Login</button>
                    </div>
                ) : chatHistory.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm">Ask me about PGs, language, or emergency contacts!</p>
                ) : (
                    chatHistory.map((msg) => (
                        <div key={msg.id} className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user'
                            ? 'bg-green-600 text-white self-end rounded-br-none'
                            : 'bg-white border self-start rounded-bl-none shadow-sm'
                            }`}>
                            <p className="text-sm">{msg.message}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-2">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="border flex-1 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your message..."
                    disabled={!user}
                />
                <button
                    onClick={handleSend}
                    disabled={!user || !message}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
