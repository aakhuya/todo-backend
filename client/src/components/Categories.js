import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, deleteCategory } from '../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const getCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;

    const categoryData = { name: categoryName };
    try {
      await addCategory(categoryData);
      setCategoryName('');
      getCategories();  // Refresh the list after adding
    } catch (error) {
      console.error('Error adding category:', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      getCategories();  // Refresh the list after deleting
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <div>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <strong>{category.name}</strong> - {category.tasks?.length || 0} tasks
            <button onClick={() => handleDeleteCategory(category.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
            <ul>
              {category.tasks?.map(task => (
                <li key={task.id}>
                  {task.title} - {task.status}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
