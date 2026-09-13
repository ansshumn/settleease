import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React, { Component, ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong 🚨</h1>
                        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            <pre className="text-sm font-mono text-red-800 whitespace-pre-wrap">
                                {this.state.error?.toString()}
                            </pre>
                            <pre className="text-xs font-mono text-gray-600 mt-2 whitespace-pre-wrap">
                                {this.state.error?.stack}
                            </pre>
                        </div>
                        <p className="mt-4 text-gray-600">Please copy the text in the red box above and share it with me.</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
