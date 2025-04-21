// src/components/Board.js
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';
import './board.css';

// Helper function to reorder an array given start and end indices.
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function Board({ tasks, setTasks, onDeleteTask, onEditTask, onArchiveTask }) {
  function handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // When reordering within the same column
    if (destination.droppableId === source.droppableId) {
      const columnStatus = source.droppableId;
      // Filter tasks in this column and sort by their order property.
      const columnTasks = tasks
        .filter((task) => task.status === columnStatus)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      // Reorder the column tasks.
      const reordered = reorder(columnTasks, source.index, destination.index);
      // Reassign order values (0-based index)
      const updatedColumnTasks = reordered.map((task, idx) => ({
        ...task,
        order: idx,
      }));
      // Build the new global tasks array:
      const newTasks = tasks.map((task) => {
        if (task.status === columnStatus) {
          const updated = updatedColumnTasks.find((ut) => ut.id === task.id);
          return updated ? updated : task;
        }
        return task;
      });
      setTasks(newTasks);
    } else {
      // Moving between columns: update the task's status and maintain position
      setTasks((prevTasks) => {
        // Get tasks in the destination column (sorted by order)
        const destTasks = prevTasks
          .filter((task) => task.status === destination.droppableId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // Insert the task at the dropped position
        const updatedDestTasks = [
          ...destTasks.slice(0, destination.index),
          prevTasks.find(t => t.id === draggableId),
          ...destTasks.slice(destination.index)
        ].filter(Boolean);

        // Update orders for all tasks in the destination column
        const reorderedDestTasks = updatedDestTasks.map((task, idx) => ({
          ...task,
          status: destination.droppableId,
          order: idx
        }));

        // Update the tasks array with the reordered destination column
        return prevTasks.map(task => {
          if (task.id === draggableId) {
            const updatedTask = reorderedDestTasks.find(t => t.id === draggableId);
            return updatedTask || task;
          }
          if (task.status === destination.droppableId) {
            const updatedTask = reorderedDestTasks.find(t => t.id === task.id);
            return updatedTask || task;
          }
          return task;
        });
      });
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        <Column
          title="Not Started"
          status="not-started"
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onArchiveTask={onArchiveTask}
        />
        <Column
          title="In-Progress"
          status="in-progress"
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onArchiveTask={onArchiveTask}
        />
        <Column
          title="Blocked"
          status="blocked"
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onArchiveTask={onArchiveTask}
        />
        <Column
          title="Resolved"
          status="resolved"
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onArchiveTask={onArchiveTask}
        />
      </div>
    </DragDropContext>
  );
}

export default Board;