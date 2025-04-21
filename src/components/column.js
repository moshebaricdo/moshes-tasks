// src/components/Column.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './taskcard';
import TaskIconButton from './TaskIconButton';
import './column.css';

// Custom hook for scrollbar calculations
function useCustomScrollbar(ref) {
  const updateScrollbar = useCallback(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;
    
    // Calculate thumb height and position
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      30 // Minimum thumb height in pixels
    );
    const thumbTop = (scrollTop / scrollHeight) * clientHeight;
    
    // Update CSS variables
    element.style.setProperty(
      '--scrollbar-thumb-height',
      `${thumbHeight / clientHeight}`
    );
    element.style.setProperty(
      '--scrollbar-thumb-top',
      `${thumbTop / clientHeight}`
    );
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial update
    updateScrollbar();

    // Add scroll event listener
    element.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    // Cleanup
    return () => {
      element.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [updateScrollbar]);

  return updateScrollbar;
}

function Column({ title, status, tasks = [], onDeleteTask, onEditTask, onArchiveTask }) {
  const columnTasks = tasks
    .filter((task) => task.status === status)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Local state for empty state fade effects
  const [showEmpty, setShowEmpty] = useState(columnTasks.length === 0);
  const [fadeOutEmpty, setFadeOutEmpty] = useState(false);
  const [fadeInEmpty, setFadeInEmpty] = useState(false);
  
  // Ref for scroll container
  const scrollRef = useRef(null);
  const updateScrollbar = useCustomScrollbar(scrollRef);

  // Handle resolve all tasks
  const handleResolveAll = useCallback(() => {
    // Create a copy of tasks to avoid mutation during iteration
    const tasksToResolve = [...columnTasks];
    tasksToResolve.forEach(task => {
      onArchiveTask(task.id);
    });
  }, [columnTasks, onArchiveTask]);

  useEffect(() => {
    if (columnTasks.length > 0) {
      if (showEmpty) {
        setFadeOutEmpty(true);
        const timer = setTimeout(() => {
          setShowEmpty(false);
          setFadeOutEmpty(false);
        }, 200);
        return () => clearTimeout(timer);
      }
    } else {
      setShowEmpty(true);
      setFadeInEmpty(true);
      const timer = setTimeout(() => {
        setFadeInEmpty(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [columnTasks.length]);

  // Update scrollbar when tasks change
  useEffect(() => {
    updateScrollbar();
  }, [columnTasks.length, updateScrollbar]);

  return (
    <div className="column" data-status={status}>
      <div className="column-header">
        <div className="column-header-content">
          <span className="column-title">{title}</span>
          <div className="column-actions">
            <span className="column-task-count">{columnTasks.length}</span>
            {status === 'resolved' && columnTasks.length > 0 && (
              <TaskIconButton
                icon="fa-solid fa-check-circle"
                onClick={handleResolveAll}
                tooltip="Resolve all tasks"
                variant="success"
                className="resolve-all-button"
                tooltipPosition="left"
              />
            )}
          </div>
        </div>
      </div>
      <Droppable droppableId={status}>
        {(provided, droppableSnapshot) => (
          <div
            className="column-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Add scroll track element */}
            <div className="scroll-track" />
            {/* The scroll-inner container wraps all tasks */}
            <div className="scroll-inner" ref={scrollRef}>
              {showEmpty && (
                <div
                  className={`column-empty-state ${
                    fadeOutEmpty ? 'fade-out' : ''
                  } ${fadeInEmpty ? 'fade-in' : ''}`}
                >
                  <i className="fa-solid fa-box-empty empty-state-icon" />
                  <p className="empty-state-title">There's nothing here!</p>
                  <p className="empty-state-subtitle">
                    Drag a card into the column or create a new task.
                  </p>
                </div>
              )}
              {columnTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => {
                    const style = {
                      ...provided.draggableProps.style,
                      willChange: 'transform',
                      transition: 'transform 0.05s ease, box-shadow 0.05s ease',
                    };
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={style}
                      >
                        <TaskCard
                          name={task.name}
                          description={task.description}
                          tag={task.tag}
                          priority={task.priority}
                          onDelete={() => onDeleteTask(task.id)}
                          onEdit={() => onEditTask(task)}
                          onArchive={() => onArchiveTask(task.id)}
                        />
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;