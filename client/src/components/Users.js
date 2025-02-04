import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, addUser, updateUser } from '../api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingUserId, setEditingUserId] = useState(null); 

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetchUsers();
      setUsers(response.data);
    };
    getUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setEmail(user.email);
  };

  const handleAddOrUpdateUser = async () => {
    if (editingUserId) {
      const userData = { username, email };
      const response = await updateUser(editingUserId, userData);
      setUsers(users.map(user => user.id === editingUserId ? response.data : user));
      setEditingUserId(null); 
    } else {
      const userData = { username, email };
      const response = await addUser(userData);
      setUsers([...users, response.data]);
    }
    setUsername('');
    setEmail('');
  };

  return (
    <div>
      <h2>Users</h2>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={handleAddOrUpdateUser}>
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
      </div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
