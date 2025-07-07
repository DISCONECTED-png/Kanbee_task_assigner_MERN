import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditModal from './EditModal';

export const SortableItem = ({ id, task, onSmartAssign, onDelete, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // ✅ detect drag state
  } = useSortable({
    id,
    disabled: showEdit,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 'auto',
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>

      <small>
        Priority:{' '}
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </small>

      {task.assignedTo?.name && (
        <div className="assigned-badge">
          👤 {task.assignedTo.name}
        </div>
      )}
      <div className="task-buttons">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onSmartAssign(task._id)}
        >
          Smart Assign
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
      </div>

      {showEdit && (
        <EditModal
          task={task}
          onSave={onEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};
