import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardTree from './components/DashboardTree';
<<<<<<< HEAD
import { Box, Paper, Typography, Avatar, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import YearlyData from './components/tabs/YearlyData';
import Agreements from './components/tabs/Agreements';
import MasterData from './components/tabs/MasterData';
import ChangeHistory from './components/tabs/ChangeHistory';
=======
import { Box, Paper, Typography, Avatar, AppBar, Toolbar, Button} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Structure from './Structure';
import Monatspflege from './components/tabs/Monatspflege';
import Primärteam_Stamm from './components/tabs/Primärteam_Stamm';
import Primärteam_Pflege from './components/tabs/Primärteam_Pflege';
import Team_Pflege from './components/tabs/Team_Pflege';
<<<<<<< HEAD
import Teamschlüssel from './components/tabs/Teamschlüssel';
import Teamschlüssel_Team from './components/tabs/Teamschlüssel_Team';
>>>>>>> remotes/origin/12-teamschlüssel
=======
import CreateAccount from './components/tabs/CreateAccount';
>>>>>>> remotes/origin/16-person-in-django-mit-account-und-passwort-1preusse

const DashboardPage = ({ setIsLoggedIn }) => {

  const [userData, setUserData] = useState(null);
<<<<<<< HEAD
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    console.log('Selected person changed:', selectedPerson);
  }, [selectedPerson]);
=======
  const [showNavBar, setShowNavBar] = useState(true);
  const [nodeName, setNodeName] = useState(null);
  const [nodeLevel, setNodeLevel] = useState(null);
  const [activeTab, setActiveTab] = useState('struktur');
  const [selectedNode, setSelectedNode] = useState(null);
  

  // Add this handler
  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };
>>>>>>> remotes/origin/12-teamschlüssel

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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePersonSelect = (person) => {
    console.log('Person selected in DashboardPage:', person);
    setSelectedPerson(person);
  };

  // TabPanel Komponente für den Inhalt
  function TabPanel({ children, value, index }) {
    return (
      <div hidden={value !== index} style={{ padding: '20px 0' }}>
        {value === index && children}
      </div>
    );
  }

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
<<<<<<< HEAD
            onPersonSelect={handlePersonSelect}
=======
            setNodeName={setNodeName}
            setNodeLevel={setNodeLevel}
            onNodeSelect={handleNodeSelect}
>>>>>>> remotes/origin/12-teamschlüssel
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
<<<<<<< HEAD
        <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
        
        {selectedPerson ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedPerson.vorname} {selectedPerson.nachname}
            </Typography>
            
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: '#fff',
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 120,
                  }
                }}
              >
                <Tab label="Jahresdaten" />
                <Tab label="Vereinbarungen" />
                <Tab label="Stammdaten" />
                <Tab label="Änderungshistorie" />
              </Tabs>
            </Box>

            <TabPanel value={selectedTab} index={0}>
              <YearlyData person={selectedPerson} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <Agreements person={selectedPerson} />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <MasterData person={selectedPerson} />
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <ChangeHistory person={selectedPerson} />
            </TabPanel>
          </>
        ) : (
          <Typography>Bitte wählen Sie eine Person aus</Typography>
        )}
=======
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
              {(userData?.is_staff || userData?.is_superuser) && (
                <Button
                  onClick={() => setActiveTab('createAccount')}
                  sx={{ 
                    color: activeTab === 'createAccount' ? 'primary.main' : 'text.primary',
                    mx: 1
                  }}
                >
                  Create Account
                </Button>
              )}
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
        
        {nodeName == "Hillmann & Geitz" && activeTab === 'struktur' && <Structure setIsLoggedIn={setIsLoggedIn} />}
        {nodeName === "Monatspflege" && <Monatspflege />}
        {nodeLevel === 2 && nodeName !== "DB Kunden 03" && activeTab === 'struktur' && <Primärteam_Pflege selectedNode={selectedNode}/>}
        {nodeName === "DB Kunden 03" && <Primärteam_Stamm selectedNode={selectedNode}/>}
<<<<<<< HEAD
        {nodeLevel === 3 && activeTab == "struktur" && <Team_Pflege selectedNode={selectedNode}/>}
        {nodeLevel === 2 && nodeName !== "DB Kunden 03" && activeTab == 'stammdaten' && <Teamschlüssel selectedNode={selectedNode}/>}
        {nodeLevel === 3 && nodeName !== "DB Kunden 03" && activeTab == 'stammdaten' && <Teamschlüssel_Team selectedNode={selectedNode}/>}
=======
        {nodeLevel === 3 && <Team_Pflege selectedNode={selectedNode}/>}
        {activeTab === 'createAccount' && <CreateAccount />}
>>>>>>> remotes/origin/16-person-in-django-mit-account-und-passwort-1preusse

>>>>>>> remotes/origin/12-teamschlüssel
      </Box>
    </Box>
  );
};

export default DashboardPage;


