import {
    CreditCard,
    Files,
    LayoutDashboard,
    Receipt,
    Star,
    Trash2,
    Upload,
} from "lucide-react";

/* --------------------------------- Features -------------------------------- */
export const features = [
    {
        iconName: "ArrowUpCircle",
        gradient: "from-brand-500 to-brand2-500",
        title: "Lightning Uploads",
        description:
            "Drag, drop and done. Upload multiple files in seconds with a buttery-smooth interface.",
    },
    {
        iconName: "Shield",
        gradient: "from-emerald-500 to-teal-500",
        title: "Bank-Grade Security",
        description:
            "Your files are encrypted at rest and in transit with enterprise-grade protection.",
    },
    {
        iconName: "Share2",
        gradient: "from-accent-500 to-rose-500",
        title: "Effortless Sharing",
        description:
            "Generate secure, controllable links and share any file with anyone, anywhere.",
    },
    {
        iconName: "CreditCard",
        gradient: "from-amber-500 to-orange-500",
        title: "Flexible Credits",
        description:
            "Pay only for what you use with a transparent, credit-based pricing model.",
    },
    {
        iconName: "FileText",
        gradient: "from-brand2-500 to-sky-500",
        title: "Smart File Management",
        description:
            "Organize, preview and manage every file from any device, beautifully.",
    },
    {
        iconName: "Clock",
        gradient: "from-fuchsia-500 to-brand-500",
        title: "Full History",
        description:
            "Track every upload, purchase and transaction with a complete activity log.",
    },
];

/* --------------------------------- Pricing --------------------------------- */
// Monthly prices are the base. Yearly applies ~2 months free (price * 10).
export const pricingPlans = [
    {
        name: "Free",
        monthly: 0,
        yearly: 0,
        description: "Perfect for getting started",
        features: [
            "5 file uploads",
            "Basic file sharing",
            "7-day file retention",
            "Email support",
        ],
        cta: "Get Started",
        highlighted: false,
    },
    {
        name: "Premium",
        monthly: 500,
        yearly: 5000,
        description: "For individuals with larger needs",
        features: [
            "500 file uploads",
            "Advanced file sharing",
            "30-day file retention",
            "Priority email support",
            "File analytics",
        ],
        cta: "Go Premium",
        highlighted: true,
    },
    {
        name: "Ultimate",
        monthly: 2500,
        yearly: 25000,
        description: "For teams and businesses",
        features: [
            "5000 file uploads",
            "Team sharing capabilities",
            "Unlimited file retention",
            "24/7 priority support",
            "Advanced analytics",
            "API access",
        ],
        cta: "Go Ultimate",
        highlighted: false,
    },
];

/* --------------------------- Feature comparison ---------------------------- */
export const comparisonFeatures = [
    { label: "File uploads", free: "5", premium: "500", ultimate: "5,000" },
    { label: "File retention", free: "7 days", premium: "30 days", ultimate: "Unlimited" },
    { label: "Secure share links", free: true, premium: true, ultimate: true },
    { label: "File analytics", free: false, premium: true, ultimate: true },
    { label: "Team sharing", free: false, premium: false, ultimate: true },
    { label: "Priority support", free: false, premium: true, ultimate: true },
    { label: "API access", free: false, premium: false, ultimate: true },
];

/* ------------------------------- Testimonials ------------------------------ */
export const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Marketing Director",
        company: "CreativeMinds Inc.",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        quote:
            "FileForge completely changed how our team ships creative assets. Secure sharing plus a gorgeous interface made file management a non-issue.",
        rating: 5,
    },
    {
        name: "Michael Chen",
        role: "Freelance Designer",
        company: "Self-employed",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        quote:
            "I send huge design files to clients every day. FileForge's simple flow and fair pricing make it the only tool I reach for now.",
        rating: 5,
    },
    {
        name: "Priya Sharma",
        role: "Project Manager",
        company: "TechSolutions Ltd.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        quote:
            "Juggling files across teams used to be chaos. With FileForge everything is organized, searchable and available exactly when we need it.",
        rating: 5,
    },
    {
        name: "David Okafor",
        role: "Engineering Lead",
        company: "Northwind Labs",
        image: "https://randomuser.me/api/portraits/men/15.jpg",
        quote:
            "The API access and analytics are fantastic. We integrated FileForge into our pipeline in an afternoon. Rock solid and fast.",
        rating: 5,
    },
    {
        name: "Elena Rossi",
        role: "Product Designer",
        company: "Lumen Studio",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        quote:
            "Dark mode, micro-interactions, the whole experience feels premium. It's rare to find a file tool this delightful to use.",
        rating: 5,
    },
    {
        name: "James Carter",
        role: "Founder",
        company: "Indie Stack",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        quote:
            "As a solo founder, credits-based pricing is perfect. I only pay for what I use and never worry about storage limits.",
        rating: 4,
    },
];

/* ----------------------------- Hero statistics ----------------------------- */
export const heroStats = [
    { value: 50000, suffix: "+", label: "Active users" },
    { value: 2, suffix: "M+", label: "Files shared" },
    { value: 99.9, suffix: "%", label: "Uptime" },
    { value: 150, suffix: "+", label: "Countries" },
];

/* ----------------------------- Side menu data ------------------------------ */
export const SIDE_MENU_DATA = [
    { id: "01", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "02", label: "Upload", icon: Upload, path: "/upload" },
    { id: "03", label: "My Files", icon: Files, path: "/my-files" },
    { id: "04", label: "Favorites", icon: Star, path: "/favorites" },
    { id: "05", label: "Trash", icon: Trash2, path: "/trash" },
    { id: "06", label: "Subscription", icon: CreditCard, path: "/subscriptions" },
    { id: "07", label: "Transactions", icon: Receipt, path: "/transactions" },
];
