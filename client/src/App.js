import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Users from './components/Users';
import Tasks from './components/Tasks';
import Categories from './components/Categories';
import UserTasks from './components/UserTasks';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Welcome to To-Do List App</h1>
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/user_tasks" element={<UserTasks />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
