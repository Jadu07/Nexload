import React, { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import UploadPopup from "./UploadPopup";

const fmt = (n = 0) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M+" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k+" : n);
const BENEFITS = [
    ["Global Reach", "Your work, instantly available to thousands of creators worldwide."],
    ["Impact", "Shape design trends and help others ship faster."],
    ["Recognition", "Build your portfolio and establish yourself as an expert."],
];
const STAT = [
    ["resources", "Active Resources"],
    ["users", "Contributors"],
    ["downloads", "Downloads"],
];

export default function Careers({ user }) {
    const [open, setOpen] = useState(false);
    const [stats, setStats] = useState();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then((r) => (r.ok ? r.json() : { resources: 0, downloads: 0, users: 0 }))
            .then(setStats)
            .catch(() => setStats({ resources: 0, downloads: 0, users: 0 }));
    }, []);

    const start = () => (user ? setOpen(true) : (window.location.href = `${API_BASE_URL}/auth/google`));

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300 mb-8 backdrop-blur-sm">
                        <span># Creators Programme</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-medium tracking-tighter mb-8 text-white">Share your craft.</h1>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        Upload your resources, gain global recognition, and help build the future of the web.
                    </p>

                    <div className="flex flex-col items-center">
                        <button
                            onClick={start}
                            className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 transition-all hover:pr-10"
                        >
                            Start Uploading <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <p className="mt-4 text-sm text-zinc-500 font-medium">
                            {user ? `Logged in as ${user.displayName}` : "Requires Google account *"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-16 md:gap-32 mb-32 border-y border-white/10 py-16">
                    {!stats ? (
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading stats...</span>
                        </div>
                    ) : (
                        STAT.map(([k, label]) => (
                            <div key={k} className="text-center">
                                <span className="block text-white text-4xl md:text-5xl font-bold mb-2 tracking-tight">{fmt(stats[k])}</span>
                                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{label}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
                    {BENEFITS.map(([t, d]) => (
                        <div key={t} className="flex flex-col items-center p-4">
                            <h3 className="text-2xl font-medium text-white mb-4">{t}</h3>
                            <p className="text-zinc-400 font-light leading-relaxed text-lg">{d}</p>
                        </div>
                    ))}
                </div>
            </div>

            <UploadPopup isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
}
