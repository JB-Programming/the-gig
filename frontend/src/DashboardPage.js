import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardTree from './components/DashboardTree';
import { Box, Paper, Typography, Avatar, AppBar, Toolbar, Button} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Structure from './Structure';
import Monatspflege from './components/tabs/Monatspflege';

const DashboardPage = ({ setIsLoggedIn }) => {

  const [userData, setUserData] = useState(null);
  const [showNavBar, setShowNavBar] = useState(null);
  const [activeTab, setActiveTab] = useState('struktur');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        console.log('User Data:', response.data);
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

  /*
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
    </div> {**/

  const userRole = userData?.is_superuser ? 'Superuser' : 
                  userData?.is_staff ? 'Administrator' : 'User';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box 
        sx={{ 
          width: '320px',
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
        <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 1 }}>
          <DashboardTree 
            isAdmin={userData?.is_staff}
            isSuperuser={userData?.is_superuser}
            userId={userData?.id}
            setShowNavBar={setShowNavBar}
          />
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
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {userData.first_name} {userData.last_name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  {userRole}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  {userData.email}
                </Typography>
                <button 
                  onClick={handleLogout}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1,
          ml: '320px',
          p: 3,
        }}
      >
        {showNavBar && (
          <AppBar position="fixed" 
            sx={{ 
              width: 'calc(100% - 320px)',
              ml: '320px',
              backgroundColor: '#f5f5f5',
              color: 'text.primary',
              boxShadow: 1
            }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <Button 
                onClick={() => setActiveTab('stammdaten')}
                sx={{ 
                  color: activeTab === 'stammdaten' ? 'primary.main' : 'text.primary',
                  mx: 1
                }}
              >
                Stammdaten
              </Button>
              <Button 
                onClick={() => setActiveTab('historie')}
                sx={{ 
                  color: activeTab === 'historie' ? 'primary.main' : 'text.primary',
                  mx: 1
                }}
              >
                Änderungshistorie
              </Button>
              <Button 
                onClick={() => setActiveTab('struktur')}
                sx={{ 
                  color: activeTab === 'struktur' ? 'primary.main' : 'text.primary',
                  mx: 1
                }}
              >
                Struktur
              </Button>
            </Toolbar>
          </AppBar>
        )}
        
        {showNavBar && <Toolbar />}
        
        {showNavBar == "Hillmann & Geitz" && activeTab === 'struktur' && <Structure setIsLoggedIn={setIsLoggedIn} />}
        {showNavBar === "Monatspflege" && <Monatspflege />}
      </Box>
    </Box>
  );
};

export default DashboardPage;