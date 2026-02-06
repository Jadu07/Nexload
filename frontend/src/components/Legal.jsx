
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        const id = pathname.replace('/', '');
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 font-sans selection:bg-white selection:text-black">
            <div className="max-w-3xl mx-auto space-y-24">

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Legal</h1>
                    <p className="text-zinc-400 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <section id="privacy" className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                    <div className="space-y-4 text-zinc-400 leading-relaxed">
                        <p>
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                            We only collect information necessary to provide our services, such as your name, email address (via Google Login),
                            and usage data related to resource uploads and downloads.
                        </p>
                        <p>
                            We do not sell your personal data to third parties. We use industry-standard security measures to protect your information.
                            Address: [Your Address/Location]
                            Contact: yashrajchouhan14@gmail.com
                        </p>
                    </div>
                </section>

                <hr className="border-zinc-900" />

                <section id="terms" className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
                    <div className="space-y-4 text-zinc-400 leading-relaxed">
                        <p>
                            By accessing Nexload, you agree to be bound by these terms. If you do not agree, please do not use our services.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You retain ownership of the resources you upload, but grant us a license to display and distribute them.</li>
                            <li>You must not upload content that violates copyright laws or is harmful/illegal.</li>
                            <li>We reserve the right to remove any content or terminate accounts at our discretion.</li>
                            <li>The platform is provided "as is" without warranties of any kind.</li>
                        </ul>
                    </div>
                </section>

                <hr className="border-zinc-900" />

                <section id="cookies" className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Cookie Policy</h2>
                    <div className="space-y-4 text-zinc-400 leading-relaxed">
                        <p>
                            We use cookies to enhance your experience, specifically for maintaining your session (authentication) and
                            analyzing site traffic.
                        </p>
                        <p>
                            <strong>Essential Cookies:</strong> Required for login and site functionality.<br />
                            <strong>Analytics Cookies:</strong> Help us understand how visitors use the site (e.g., download counts).
                        </p>
                        <p>
                            By continuing to use Nexload, you consent to our use of cookies.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}
