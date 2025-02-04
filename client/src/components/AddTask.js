import React, { useState } from 'react';
import { addTask } from '../api';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { title, description, user_id: userId, category_id: categoryId };
      const response = await addTask(taskData);
      onTaskAdded(response.data); // Callback to notify parent component
      setTitle('');
      setDescription('');
      setUserId('');
      setCategoryId('');
      setError('');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          required
        />
        <input
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Category ID"
        />
        <button type="submit">Add Task</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddTask;
