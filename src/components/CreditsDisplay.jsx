import { Coins } from "lucide-react";

const CreditsDisplay = ({ credits }) => {
    const display = credits ?? "—";
    return (
        <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/15 px-3.5 py-2 rounded-full text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/20 hover:border-brand-300 transition-colors">
            <Coins size={16} />
            <span className="font-bold text-sm">{display}</span>
            <span className="text-xs hidden sm:inline">{display === 1 ? "Credit" : "Credits"}</span>
        </div>
    );
};

export default CreditsDisplay;
