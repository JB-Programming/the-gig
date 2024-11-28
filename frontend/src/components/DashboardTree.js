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

const DashboardTree = ({ isAdmin = false, isSuperuser = false, userId, onPersonSelect }) => {
  const [employees, setEmployees] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState({
    root: true,
    admin: false,
    persons: false,
  });

  const hasFullAccess = isAdmin || isSuperuser;

  useEffect(() => {
    fetchEmployees();
    fetchTreeData();
  }, []);

  const fetchTreeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/structure/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setTreeData(response.data);
    } catch (err) {
      console.error('Error fetching tree:', err);
      setError(`Failed to fetch structure: ${err.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/employees/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const employeeData = response.data.employees;
      setEmployees(hasFullAccess ? employeeData : employeeData.filter(emp => emp.id === userId));
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

  const handleEmployeeClick = (employee) => {
    console.log('Clicked employee:', employee);
    onPersonSelect({
      id: employee.id,
      name: employee.name,
      // Add any other employee data you need
    });
  };

  const renderTreeNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    
    if (node.name === "Personen" && node.children) {
      return (
        <div key={`folder-${node.struktur_id}`}>
          <ListItemStyled
            key={`item-${node.struktur_id}`}
            depth={depth}
            icon={<FolderIcon />}
            primary={node.name}
            onClick={() => handleClick(node.struktur_id)}
            isExpandable={hasChildren}
          />
          
          {open[node.struktur_id] && (
            <Collapse in={open[node.struktur_id]} timeout="auto">
              <List component="div" disablePadding>
                {node.children.map(person => (
                  <ListItemStyled
                    key={`person-${person.id}`}
                    depth={depth + 1}
                    icon={<PersonIcon />}
                    primary={person.name}
                    onClick={() => handleEmployeeClick(person)}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </div>
      );
    }

    return (
      <div key={`folder-${node.struktur_id}`}>
        <ListItemStyled
          key={`item-${node.struktur_id}`}
          depth={depth}
          icon={<FolderIcon />}
          primary={node.name}
          onClick={() => handleClick(node.struktur_id)}
          isExpandable={hasChildren}
        />
        
        {hasChildren && open[node.struktur_id] && (
          <Collapse in={open[node.struktur_id]} timeout="auto">
            <List component="div" disablePadding>
              {node.children.map(child => renderTreeNode(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

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
          fontSize: 20
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
            fontSize: '0.9rem',
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={2} sx={{ maxWidth: 400, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 0.5 }}>
        <List component="nav" sx={{ p: 0 }}>
          {treeData.map(node => (
            <React.Fragment key={`tree-${node.struktur_id}`}>
              {renderTreeNode(node, 0)}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default DashboardTree;