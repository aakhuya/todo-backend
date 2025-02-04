import React, { useState } from 'react';
import { addUser } from '../api';

const AddUser = ({ onUserAdded }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, email };
      const response = await addUser(userData);
      onUserAdded(response.data); 
      setUsername('');
      setEmail('');
      setError('');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Add User</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddUser;
