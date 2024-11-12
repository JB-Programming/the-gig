import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardTree from './components/DashboardTree';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

  return (
   
<Box 
sx={{ 
  display: 'flex',
  minHeight: '100vh',
}}
>
{/* Left Side Container */}
<Box 
        sx={{ 
          width: '280px',
          position: 'fixed',
          left: 0,
          top: 64,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // This pushes the account box to the bottom
          borderRight: '1px solid #e0e0e0',
        }}
      >
        {/* Tree Container */}
        <Box 
          sx={{ 
            overflowY: 'auto',
            flexGrow: 1,
            p: 1,
          }}
        >
          <DashboardTree />
        </Box>

        {/* Account Info Box */}
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            m: 1,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircleIcon />
          </Avatar>
          <Box>
            {userData && (
              <div>
                <p>Email: {userData.email}</p>
                <p>{userData.first_name} {userData.last_name} </p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </Box>
        </Paper>
      </Box>

{/* Main Content Area */}
<Box 
  sx={{ 
    flexGrow: 1,
    ml: '400px', // Match the width of the tree container
    p: 3,
  }}
>
  <h1>Dashboard</h1>
  
  {/* Add your main dashboard content here */}
</Box>
</Box>
  );
};

export default DashboardPage;