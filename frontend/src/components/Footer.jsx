import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Github, Linkedin, Disc } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-gradient-to-b from-zinc-900/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          <div className="md:col-span-5 flex flex-col items-start">
            <Link to="/" className="text-3xl font-black tracking-widest text-white mb-6">
              NEXLOAD
            </Link>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mb-8">
              The premier destination for high-quality developer resources. Empowering creators with curated assets for their next big project.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://medium.com/@jadu07" icon={<BookOpen size={20} />} label="Medium" />
              <SocialLink href="https://github.com/Jadu07" icon={<Github size={20} />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/yash-raj-chouhan/" icon={<Linkedin size={20} />} label="LinkedIn" />
              <SocialLink href="https://yashraj.tech" icon={<Disc size={20} />} label="Portfolio" />
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-white tracking-wide">Explore</h3>
              <FooterLink to="/templates">Templates</FooterLink>
              <FooterLink to="/icons">Icons</FooterLink>
              <FooterLink to="/tools">Tools</FooterLink>
              <FooterLink to="/fonts">Fonts</FooterLink>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-white tracking-wide">Resources</h3>
              <FooterLink to="/themes">Themes</FooterLink>
              <FooterLink to="/plugins">Plugins</FooterLink>
              <FooterLink to="/graphics">Graphics</FooterLink>
              <FooterLink to="/books">Books</FooterLink>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-white tracking-wide">Company</h3>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-500 text-sm">
            Nexload © {currentYear} rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-white hover:text-black transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
