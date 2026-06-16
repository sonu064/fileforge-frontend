import { useDraggable } from "@dnd-kit/core";

/**
 * Wraps a file tile so it can be dragged into a folder. We attach the drag listeners to a
 * thin wrapper; the PointerSensor's activation distance lets normal button clicks still work.
 */
const DraggableFile = ({ id, fileId, selected, children }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: { fileId, selected },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`touch-none ${isDragging ? "opacity-40" : ""}`}
        >
            {children}
        </div>
    );
};

export default DraggableFile;
