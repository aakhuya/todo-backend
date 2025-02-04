import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchTasks, fetchUserTasks, addUserTask } from '../api';

const UserTasks = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]); 
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        const tasksResponse = await fetchTasks();
        const assignedTasksResponse = await fetchUserTasks(); 

        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setAssignedTasks(assignedTasksResponse.data); 
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleAssignTask = async () => {
    if (!selectedUser || !selectedTask) {
      setError('Please select both a user and a task.');
      return;
    }

    try {
      const data = { user_id: selectedUser, task_id: selectedTask };
      await addUserTask(data);

      const updatedAssignedTasks = await fetchUserTasks();
      setAssignedTasks(updatedAssignedTasks.data);

      setError('');
    } catch (error) {
      setError('Error assigning task');
    }
  };

  return (
    <div>
      <h3>Assign Task to User</h3>
      <div>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
          <option value="">Select Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        <button onClick={handleAssignTask}>Assign Task</button>
      </div>

      {error && <p>{error}</p>}

      {/* Display Assigned Tasks */}
      <h3>Assigned Tasks</h3>
      <ul>
        {assignedTasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          assignedTasks.map((task) => (
            <li key={task.id}>
              User: {task.username} | Task: {task.task_id}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserTasks;
