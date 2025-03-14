
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import Structure from './Structure';
import TreeView from './TreeView';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardPage setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      
      <Route 
        path="/structure"
        element={
            isLoggedIn ? (
              <Structure setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/structure"/>
            )
          }
      />
      <Route
          path="/treeview"
          element={<TreeView/>}
        />
      </Routes>
    </Router>
  );
};

export default App;
