import React, { useState, useEffect } from 'react';
import { Target, Zap, Globe, Github, ArrowRight, Loader2, Twitter } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const FEATURES = [
    { Icon: Target, title: 'Curated Quality', text: 'Hand-picked resources verified for design excellence and code cleanliness.' },
    { Icon: Zap, title: 'Lightning Speed', text: 'Optimized for speed. Find, preview, and download in seconds.', className: 'border-y md:border-y-0 md:border-x border-gray-100 py-8 md:py-0' },
    { Icon: Globe, title: 'Open for All', text: 'Free and accessible to creators worldwide, from Mumbai to San Francisco.' }
];

const formatNum = (n) => n > 999 ? (n / 1000).toFixed(1) + 'K' : n;

export default function About() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then(res => res.ok ? res.json() : {})
            .then(setStats)
            .catch(() => setStats({ resources: 0, downloads: 0, users: 0 }));
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" alt="Office" className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-6 pt-20 text-white">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-lg">Built for creators who ship.</h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-medium drop-shadow-md">Nexload is a curated library of premium design resources. No fluff, no paywalls.</p>
                </div>
            </section>

            {/* Philosophy Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {FEATURES.map(({ Icon, title, text, className = '' }, i) => (
                    <div key={i} className={`space-y-4 px-4 ${className}`}>
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-black" /></div>
                        <h3 className="text-xl font-bold text-black">{title}</h3>
                        <p className="text-gray-500 leading-relaxed">{text}</p>
                    </div>
                ))}
            </section>

            {/* Stats */}
            <section className="bg-black text-white py-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 text-center">
                    {!stats ? <Loader2 className="w-8 h-8 animate-spin text-white/50" /> :
                        ['resources', 'downloads', 'users'].map((key, i) => (
                            <React.Fragment key={key}>
                                <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 delay-${i * 100}`}>
                                    <div className="text-6xl md:text-8xl font-black mb-2 tracking-tighter">{formatNum(stats[key] || 0)}</div>
                                    <div className="text-gray-500 uppercase text-xs tracking-[0.2em] font-bold">{key}</div>
                                </div>
                                {i < 2 && <div className="w-px h-24 bg-white/20 hidden md:block" />}
                            </React.Fragment>
                        ))
                    }
                </div>
            </section>

            {/* Footer */}
            <section className="py-32 px-6 max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-black mb-6 tracking-tight">Join the movement.</h2>
                <p className="text-gray-500 mb-10 text-lg max-w-xl mx-auto">We're building the future of design resources, open source and community driven.</p>
                <div className="flex items-center justify-center gap-6">
                    <a href="https://github.com/Jadu07/nexload" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-black font-bold hover:gap-4 transition-all">
                        <Github className="w-5 h-5" /> <span>Star on GitHub</span> <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-gray-300">|</span>
                    <a href="https://x.com/Jadu_07" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-500 font-medium hover:text-black transition-colors">
                        <Twitter className="w-4 h-4" /> <span>Follow on X</span>
                    </a>
                </div>
            </section>
        </div>
    );
}