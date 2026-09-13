import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "kn", name: "Kannada" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "te", name: "Telugu" },
    { code: "gu", name: "Gujarati" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" }
];

export function Translator() {
    const [inputText, setInputText] = useState("");
    const [targetLang, setTargetLang] = useState("hi");
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|${targetLang}`
            );
            const data = await response.json();

            if (data.responseStatus === 200) {
                setTranslatedText(data.responseData.translatedText);
            } else {
                throw new Error(data.responseDetails || "Translation failed");
            }
        } catch (error) {
            toast({
                title: "Translation Error",
                description: "Could not translate text. Please try again later.",
                variant: "destructive",
            });
            console.error("Translation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 mb-8 animate-fade-in border-primary/20 bg-gradient-to-br from-white/80 to-primary/5">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <h2 className="text-xl font-bold text-gradient">Instant AI Translator</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
                {/* Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">English Text</label>
                    <Textarea
                        placeholder="Type anything here (e.g., 'Where can I find good food?')"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="h-32 resize-none bg-white/50 focus:bg-white transition-colors"
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2 pt-8">
                    <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleTranslate}
                        className="w-[140px] btn-primary hover:opacity-90"
                        disabled={loading || !inputText}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Translate"}
                    </Button>
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Original Translation</label>
                    <div className="h-32 p-3 rounded-md border bg-primary/5 text-lg font-medium content-center break-words overflow-y-auto">
                        {translatedText || <span className="text-muted-foreground/40 italic">Translation will appear here...</span>}
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
                Powered by MyMemory AI. Translations may not be 100% accurate.
            </p>
        </div>
    );
}
