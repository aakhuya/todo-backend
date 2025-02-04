import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, updateTask, deleteTask, fetchCategories } from '../api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [categoryId, setCategoryId] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const response = await fetchTasks();
      setTasks(response.data);
    };
    const getCategories = async () => {
      const response = await fetchCategories();
      setCategories(response.data);
    };
    getTasks();
    getCategories();
  }, []);

  const handleAddOrUpdateTask = async () => {
    const taskData = { title, description, status, category_id: categoryId };

    if (editingTaskId) {
      // Update task
      const response = await updateTask(editingTaskId, taskData);
      setTasks(tasks.map(task => (task.id === editingTaskId ? response.data : task)));
      setEditingTaskId(null);
    } else {
      // Add new task
      const response = await addTask(taskData);
      setTasks([...tasks, response.data]);
    }

    setTitle('');
    setDescription('');
    setStatus('pending');
    setCategoryId('');
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setCategoryId(task.category_id);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <h2>Tasks</h2>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleAddOrUpdateTask}>
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description} [{task.status}] (Category: {task.category?.name})
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
