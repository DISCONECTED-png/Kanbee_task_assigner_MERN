import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const KanbanColumn = ({ status, tasks, onSmartAssign, onDelete, onEdit }) => {
  const { setNodeRef } = useDroppable({
    id: status, // ✅ this matches what onDragEnd expects
  });

  return (
    <div ref={setNodeRef} className="column">
      <h3>{status}</h3>

      <SortableContext
        id={status} // ✅ this must match Droppable ID
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableItem
            key={task._id}
            id={task._id.toString()}
            task={task}
            onSmartAssign={onSmartAssign}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </SortableContext>
    </div>
  );
};
