import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CompanyStructure.module.css';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ setIsLoggedIn }) => {

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const navigate = useNavigate();
  const goToStructure = () => navigate('/structure');

  return (
    <div>
      <h1>Dashboard</h1>
      {userData && (
        <div>
          <p>Welcome, {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToStructure}>Structure</button>
    </div>
  );
};

export default DashboardPage;