import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Box,
  Typography,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';

const DashboardTree = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState({
    root: true,
    admin: false,
    persons: false,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/employees/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setEmployees(response.data.employees);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed to fetch employees: ${err.message}`);
      setLoading(false);
    }
  };

  const handleClick = (section) => {
    setOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const ListItemStyled = ({ depth = 0, icon, primary, onClick, isExpandable = false }) => (
    <ListItem 
      onClick={onClick}
      sx={{ 
        pl: 1 + (depth * 1.5),
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        transition: 'background-color 0.2s',
        borderRadius: '4px',
        my: 0.25,
        height: 32 - (depth * 2),
        '& .MuiSvgIcon-root': {
          fontSize: 20 - (depth * 3)
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 24 }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={primary} 
        sx={{ 
          '& .MuiTypography-root': { 
            fontWeight: depth === 0 ? 500 : 400,
            fontSize: `${0.9 - (depth * 0.15)}rem`,
            color: depth === 0 ? 'text.primary' : `text.primary`
          },
          margin: 0
        }}
      />
      {isExpandable && (
        open[primary.toLowerCase()] ? 
          <ExpandLessIcon sx={{ fontSize: 16 - (depth * 2) }} /> : 
          <ExpandMoreIcon sx={{ fontSize: 16 - (depth * 2) }} />
      )}
    </ListItem>
  );

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        maxWidth: 280,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 0.5 }}>
        <List 
          component="nav" 
          sx={{ 
            p: 0,
            '& .MuiCollapse-root': {
              my: 0
            }
          }}
        >
          {/* Root */}
          <ListItemStyled
            icon={<FolderIcon color="primary" />}
            primary="Hillmann & Geitz"
            onClick={() => handleClick('root')}
            isExpandable
          />

          <Collapse in={open.root} timeout="auto">
            <List component="div" disablePadding>
              {/* Monatspflege */}
              <ListItemStyled
                depth={1}
                icon={<FolderIcon />}
                primary="Monatspflege"
              />

              {/* Administrator */}
              <ListItemStyled
                depth={1}
                icon={<FolderIcon />}
                primary="Administrator"
                onClick={() => handleClick('admin')}
                isExpandable
              />

              <Collapse in={open.admin} timeout="auto">
                <List component="div" disablePadding>
                  <ListItemStyled
                    depth={2}
                    icon={<PersonIcon />}
                    primary="Heiko"
                  />
                </List>
              </Collapse>

              {/* Personen */}
              <ListItemStyled
                depth={1}
                icon={<FolderIcon />}
                primary="Personen"
                onClick={() => handleClick('persons')}
                isExpandable
              />

              <Collapse in={open.persons} timeout="auto">
                <List component="div" disablePadding>
                  {employees.map((employee, index) => (
                    <ListItemStyled
                      key={index}
                      depth={2}
                      icon={<PersonIcon />}
                      primary={`${employee.vorname} ${employee.nachname}`}
                    />
                  ))}
                </List>
              </Collapse>
            </List>
          </Collapse>
        </List>
      </Box>
    </Paper>
  );
};

export default DashboardTree;