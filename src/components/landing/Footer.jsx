import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Logo from "../common/Logo.jsx";

const footerLinks = {
    Product: ["Features", "Pricing", "Security", "Integrations"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Resources: ["Documentation", "Help Center", "API Reference", "Status"],
    Legal: ["Privacy", "Terms", "Cookies", "Licenses"],
};

const socials = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Mail, label: "Email", href: "mailto:hello@fileforge.app" },
];

const Footer = () => {
    return (
        <footer className="relative bg-slate-950 text-slate-300">
            <div className="section-pad py-16">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
                    {/* Brand + contact */}
                    <div>
                        <Logo size={36} textClassName="text-xl text-white" />
                        <p className="mt-5 text-slate-400 max-w-sm leading-relaxed">
                            FileForge is the modern way to store, share and secure your files in
                            the cloud — fast, beautiful and built for teams.
                        </p>
                        <div className="mt-6 space-y-3 text-sm">
                            <p className="flex items-center gap-3"><Mail size={16} className="text-brand-400" /> hello@fileforge.app</p>
                            <p className="flex items-center gap-3"><Phone size={16} className="text-brand-400" /> +1 (555) 123-4567</p>
                            <p className="flex items-center gap-3"><MapPin size={16} className="text-brand-400" /> San Francisco, CA</p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            {socials.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        aria-label={s.label}
                                        className="grid place-items-center h-10 w-10 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-brand-500 hover:to-accent-500 text-slate-300 hover:text-white transition-all"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h4 className="font-semibold text-white mb-4">{title}</h4>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} FileForge. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500">
                        Crafted with care for modern teams.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
