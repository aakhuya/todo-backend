import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchTasks, addUserTask } from '../api';

const AddUserTask = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const getTasks = async () => {
      try {
        const response = await fetchTasks();
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    getUsers();
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedTask) {
      setError('Please select both a user and a task.');
      return;
    }

    try {
      await addUserTask({ user_id: selectedUser, task_id: selectedTask });
      setError('');
      alert('User-task added successfully!');
      setSelectedUser('');
      setSelectedTask('');
    } catch (err) {
      setError('Error adding user-task.');
      console.error('Error adding user-task:', err);
    }
  };

  return (
    <div>
      <h2>Add User-Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Task:</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">Select a Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Add User-Task</button>
      </form>
    </div>
  );
};

export default AddUserTask;
