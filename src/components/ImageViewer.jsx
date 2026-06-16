import { useRef, useState } from "react";
import { Maximize2, Minus, Plus, RotateCw } from "lucide-react";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;

/** Image preview with zoom, rotate and fullscreen support. */
const ImageViewer = ({ url, name }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef(null);

    const clamp = (v) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));
    const zoomIn = () => setZoom((z) => clamp(+(z + 0.25).toFixed(2)));
    const zoomOut = () => setZoom((z) => clamp(+(z - 0.25).toFixed(2)));
    const reset = () => {
        setZoom(1);
        setRotation(0);
    };
    const rotate = () => setRotation((r) => (r + 90) % 360);

    const onWheel = (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        setZoom((z) => clamp(+(z + (e.deltaY < 0 ? 0.15 : -0.15)).toFixed(2)));
    };

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
        <div
            ref={containerRef}
            onWheel={onWheel}
            className="relative h-full w-full flex items-center justify-center overflow-auto bg-slate-100 dark:bg-slate-950"
        >
            <img
                src={url}
                alt={name}
                draggable={false}
                onDoubleClick={() => (zoom === 1 ? setZoom(2) : reset())}
                style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.15s ease-out",
                }}
                className="max-h-full max-w-full object-contain select-none"
            />

            {/* Floating toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur px-2 py-1.5 text-white shadow-lg">
                <button onClick={zoomOut} title="Zoom out" className="p-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer">
                    <Minus size={16} />
                </button>
                <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} title="Zoom in" className="p-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer">
                    <Plus size={16} />
                </button>
                <span className="mx-1 h-5 w-px bg-white/20" />
                <button onClick={rotate} title="Rotate" className="p-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer">
                    <RotateCw size={16} />
                </button>
                <button onClick={toggleFullscreen} title="Fullscreen" className="p-2 rounded-full hover:bg-white/15 transition-colors cursor-pointer">
                    <Maximize2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;
