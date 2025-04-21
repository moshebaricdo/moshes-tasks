// src/components/NewTaskModal.js
import React, { useState } from 'react';
import './newtaskmodal.css';
import ActionButton from './actionbutton';
import PriorityToggle from './prioritytoggle';
import TagDropdown from './tagdropdown';

function NewTaskModal({ onAddTask, onCancel, initialData }) {
  // Use initialData if provided; otherwise, default to empty fields.
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  const [tag, setTag] = useState(initialData ? initialData.tag : '');
  const [priority, setPriority] = useState(initialData ? initialData.priority.toLowerCase() : 'low');

  // Form is valid if all fields have non-empty trimmed values
  const isFormValid =
    name.trim() !== '' &&
    description.trim() !== '' &&
    tag.trim() !== '' &&
    priority.trim() !== '';

  // Assign order to a new task
  const task = {
    id: initialData ? initialData.id : Date.now().toString(),
    name,
    description,
    tag,
    priority, // "low" or "high"
    status: initialData ? initialData.status : 'not-started',
    order: initialData ? initialData.order : 0,
  };
  
  // Determine mode text and submit icon based on initialData
  const modeText = initialData ? 'Save Edits' : 'Create';
  const headerText = initialData ? 'Edit Task' : 'Create a New Task';
  const submitIcon = initialData ? 'pen-to-square' : 'plus';

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    const task = {
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      description,
      tag,
      priority, // "low" or "high"
      status: initialData ? initialData.status : 'not-started',
    };
    onAddTask(task);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="modal-header">
            <h2>{headerText}</h2>
            {/* Only show subtitle in create mode */}
            {!initialData && (
              <p>Fill out the fields to add a new task. Drag between columns to change its status.</p>
            )}
          </div>

          {/* Modal Body (form fields) */}
          <div className="modal-body">
            <div className="form-row">
              <label>Task Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Tag</label>
              <TagDropdown value={tag} onChange={setTag} />
            </div>

            <div className="form-row">
              <label>Priority</label>
              <PriorityToggle value={priority} onChange={setPriority} />
            </div>
          </div>

          {/* Modal Footer (actions) */}
          <div className="modal-actions">
            <ActionButton
              type="button"
              icon="xmark"
              label="Cancel"
              hasIcon={false}
              onClick={onCancel}
            />
            <ActionButton
              type="submit"
              icon={submitIcon}
              label={modeText}
              hasIcon={true}
              disabled={!isFormValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;