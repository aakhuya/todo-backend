import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/user_tasks">User Tasks</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
