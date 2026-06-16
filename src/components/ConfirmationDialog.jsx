import Modal from "./Modal.jsx";

const ConfirmationDialog = ({
    isOpen,
    onClose,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmButtonClass = "bg-red-600 hover:bg-red-700",
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={onConfirm}
            confirmButtonClass={confirmButtonClass}
            size="sm"
        >
            <p className="text-slate-600 dark:text-slate-300">{message}</p>
        </Modal>
    );
};

export default ConfirmationDialog;
