import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

const CreateFolderModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState("");

    useEffect(() => {
        if (isOpen) setName("");
    }, [isOpen]);

    const submit = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        onCreate(trimmed);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create folder"
            confirmText="Create"
            onConfirm={submit}
            size="sm"
        >
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Folder name</label>
            <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Untitled folder"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
        </Modal>
    );
};

export default CreateFolderModal;
