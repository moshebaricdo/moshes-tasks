// src/App.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Board from './components/board';
import NewTaskModal from './components/newtaskmodal';
import "./app.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resolvedTasks, setResolvedTasks] = useState([]);
  const [totalResolved, setTotalResolved] = useState(100);

  // Add keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e) {
      // Check for Command + N (Mac) or Control + N (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault(); // Prevent default browser behavior
        handleCreateClick();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array since handleCreateClick is stable

  // Load tasks from main process on mount
  useEffect(() => {
    window.electronAPI.loadTasks().then((loaded) => {
      // Separate active and resolved tasks
      const active = loaded.filter(task => !task.isResolved);
      const resolved = loaded.filter(task => task.isResolved);
      setTasks(active);
      setResolvedTasks(resolved);
      // Add the base value to the actual resolved count
      setTotalResolved(100 + resolved.length);
    });
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    // Combine active and resolved tasks for saving
    const allTasks = [...tasks, ...resolvedTasks];
    window.electronAPI.saveTasks(allTasks);
  }, [tasks, resolvedTasks]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  function handleToggleTheme() {
    setIsDarkMode((prev) => !prev);
  }

  function handleCreateClick() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleBoardClick() {
    setActiveItem("board");
  }

  function handleAddOrEditTask(task) {
    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === task.id) {
            // Preserve the existing order and status when editing
            return { ...task, order: t.order, status: t.status };
          }
          return t;
        })
      );
    } else {
      // For new tasks, add them to the end of the not-started column
      const notStartedTasks = tasks
        .filter(t => t.status === 'not-started')
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      
      const newOrder = notStartedTasks.length;
      setTasks((prevTasks) => [...prevTasks, { ...task, status: 'not-started', order: newOrder }]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  }

  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function handleArchiveTask(taskId) {
    setTasks(prevTasks => {
      const taskToArchive = prevTasks.find(t => t.id === taskId);
      if (!taskToArchive) return prevTasks;

      // Move task to resolved tasks
      setResolvedTasks(prev => [...prev, { ...taskToArchive, isResolved: true }]);
      setTotalResolved(prev => prev + 1);

      // Remove task from active tasks
      return prevTasks.filter(t => t.id !== taskId);
    });
  }

  return (
    <div className="app-container">
      <Sidebar
        activeItem={activeItem}
        onCreateClick={handleCreateClick}
        onBoardClick={handleBoardClick}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      {activeItem === "board" && (
        <Board
          tasks={tasks}
          setTasks={setTasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onArchiveTask={handleArchiveTask}
        />
      )}

      {isModalOpen && (
        <NewTaskModal
          onAddTask={handleAddOrEditTask}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          initialData={editingTask}
        />
      )}
    </div>
  );
}

export default App;