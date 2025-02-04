import React, { useState } from 'react';
import { addCategory } from '../api';

const AddCategory = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = { name };
      const response = await addCategory(categoryData);
      onCategoryAdded(response.data);
      setName('');
      setError('');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddCategory;
