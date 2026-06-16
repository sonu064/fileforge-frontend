import React, { useEffect, useRef } from "react";
import Modal from "./Modal.jsx";
import { Check, Copy } from "lucide-react";

const LinkShareModal = ({ isOpen, onClose, link, title = "Share Link" }) => {
    const [copied, setCopied] = React.useState(false);
    const linkInputRef = useRef(null);

    useEffect(() => {
        setCopied(false);
        if (isOpen && linkInputRef.current) {
            setTimeout(() => {
                linkInputRef.current.focus();
                linkInputRef.current.select();
            }, 100);
        }
    }, [isOpen]);

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Failed to copy link: ", err));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            confirmText={copied ? "Copied!" : "Copy"}
            cancelText="Close"
            onConfirm={handleCopyLink}
            confirmButtonClass={copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gradient-to-r from-brand-500 to-brand2-500 hover:shadow-lg hover:shadow-brand-500/30"}
            size="md"
        >
            <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300">
                    Share this link with others to give them access to this file:
                </p>
                <div className="flex items-center gap-2">
                    <input ref={linkInputRef} type="text" value={link} readOnly className="input-box flex-1" />
                    <button
                        onClick={handleCopyLink}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                        className={`p-3 rounded-xl transition-colors cursor-pointer ${copied ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>
                {copied && (
                    <p className="text-sm text-emerald-600 flex items-center gap-1">
                        <Check size={16} /> Link copied to clipboard!
                    </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">Anyone with this link can access this file.</p>
            </div>
        </Modal>
    );
};

export default LinkShareModal;
