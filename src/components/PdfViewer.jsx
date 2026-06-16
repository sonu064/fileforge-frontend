import { useRef } from "react";
import { Maximize2 } from "lucide-react";

/** Embedded PDF viewer using the browser's native PDF renderer via an object URL. */
const PdfViewer = ({ url, name }) => {
    const containerRef = useRef(null);

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        } else {
            el.requestFullscreen?.();
        }
    };

    return (
        <div ref={containerRef} className="relative h-full w-full bg-slate-100 dark:bg-slate-950">
            <iframe
                title={name || "PDF preview"}
                src={`${url}#view=FitH`}
                className="h-full w-full border-0"
            />
            <button
                onClick={toggleFullscreen}
                title="Fullscreen"
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer shadow-lg"
            >
                <Maximize2 size={16} />
            </button>
        </div>
    );
};

export default PdfViewer;
