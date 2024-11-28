import React, { useState, useEffect } from 'react';
import DashboardTree from '../components/DashboardTree';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/user-data/', {
        headers: {
          'Authorization': `Token ${token}`,
        }
      });
      
      // Print user data to console
      console.log('User Data:', {
        username: response.data.username,
        isSuperuser: response.data.is_superuser,
        isStaff: response.data.is_staff,
        id: response.data.id,
      });

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <Box 
        sx={{ 
          width: '280px',
          position: 'fixed',
          left: 0,
          top: 64,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <Box 
          sx={{ 
            overflowY: 'auto',
            flexGrow: 1,
            p: 1,
          }}
        >
          <DashboardTree 
            isAdmin={user?.is_staff}
            isSuperuser={user?.is_superuser}
            userId={user?.id}
          />
        </Box>

        {/* Debug Info Box */}
        <Paper 
          elevation={2}
          sx={{ 
            m: 1, 
            p: 1.5, 
            backgroundColor: '#f5f5f5',
            fontSize: '12px'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            User Info:
          </Typography>
          <pre style={{ margin: 0, overflow: 'auto' }}>
            {JSON.stringify({
              username: user?.username,
              isSuperuser: user?.is_superuser,
              isStaff: user?.is_staff,
              id: user?.id,
              firstName: user?.first_name,
              lastName: user?.last_name,
            }, null, 2)}
          </pre>
        </Paper>

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
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {user?.is_superuser ? 'Superuser' : 
               user?.is_staff ? 'Administrator' : 'User'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1,
          ml: '280px',
          p: 3,
        }}
      >
        <h1>Dashboard</h1>
      </Box>
    </Box>
  );
}

export default DashboardPage; 