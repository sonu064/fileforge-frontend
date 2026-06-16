/**
 * FileForge brand logo: a file/document combined with a cloud and a lightning bolt.
 * `variant` controls whether the wordmark is shown next to the mark.
 */
const LogoMark = ({ size = 36, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="ff-grad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="ff-grad-soft" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.75" />
            </linearGradient>
        </defs>

        {/* Rounded badge */}
        <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#ff-grad)" />

        {/* File / document silhouette */}
        <path
            d="M17 12h9.5L33 18.5V33a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z"
            fill="url(#ff-grad-soft)"
        />
        {/* Folded corner */}
        <path d="M26.5 12 33 18.5h-4.5a2 2 0 0 1-2-2V12Z" fill="#C4B5FD" />

        {/* Lightning bolt */}
        <path
            d="M24.6 19.5 19.5 27h3.6l-1.4 6 6.2-8.5h-3.7l1.4-5h-1Z"
            fill="url(#ff-grad)"
            stroke="#ffffff"
            strokeWidth="0.6"
            strokeLinejoin="round"
        />
    </svg>
);

const Logo = ({ size = 36, showText = true, textClassName = "", className = "" }) => {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <LogoMark size={size} className="drop-shadow-sm" />
            {showText && (
                <span className={`font-display font-extrabold tracking-tight ${textClassName}`}>
                    File<span className="gradient-text">Forge</span>
                </span>
            )}
        </div>
    );
};

export { LogoMark };
export default Logo;
