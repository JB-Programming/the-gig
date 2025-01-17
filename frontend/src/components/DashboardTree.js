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



// BREAKING PLEASE DELETE IF THIS IS NOT NEEDED ANYMORE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*const DashboardTree = ({ isAdmin = false, isSuperuser = false, userId, onPersonSelect }) => {

const DashboardTree = ({ isAdmin = false, isSuperuser = false, userId }) => {
  console.log('User Access:', {
    isAdmin,
    isSuperuser,
    userId,
    hasFullAccess: isAdmin || isSuperuser
  });

  const [employees, setEmployees] = useState([]);
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
        <List component="nav" sx={{ p: 0 }}>
          <ListItemStyled
            icon={<FolderIcon color="primary" />}
            primary="Hillmann & Geitz"
            onClick={() => handleClick('root')}
            isExpandable
          />

          <Collapse in={open.root} timeout="auto">
            <List component="div" disablePadding>
              {hasFullAccess && (
                <>
                  <ListItemStyled
                    depth={1}
                    icon={<FolderIcon />}
                    primary="Monatspflege"
                  />
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
                </>
              )}
              
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

*/
const DashboardTree = ({ isAdmin = false, isSuperuser = false, userId, onPersonSelect, setNodeLevel, onNodeSelect, setNodeName }) => {
//const DashboardTree = ({ isAdmin = false, isSuperuser = false, userId, setNodeName, setNodeLevel, onNodeSelect }) => {
  const handleNodeClick = (node) => {
    console.log(node);
    setNodeName(node.name);
    console.log(node.name);
    if (node["ordner_id"] != null) {
      setNodeLevel(1);
      console.log(1);
    } else if (node["primär_id"] != null) {
      setNodeLevel(2);
      console.log(2);
    } else if (node["team_id"] != null) {
      setNodeLevel(3);
      console.log(3);
    } else if (node["mitarbeiter_id"] != null) {
      setNodeLevel(4);
      console.log(4);
    } 
    else {
      setNodeLevel(0);
      console.log(0);
    }
    console.log(node.name);
    onNodeSelect(node);
  };

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
    employee.ordner_id = null;
    employee.mitarbeiter_id = 99;
    handleNodeClick(employee);
    /*console.log('Clicked employee:', employee);
    onPersonSelect({
      id: employee.id,
      name: employee.name,
      // Add any other employee data you need
      */
    };

  const renderTreeNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    {/*}
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
                    onClick={() => handleEmployeeClick(node)}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </div>
      );
    }*/}

    return (
      <div key={`folder-${node.struktur_id}`}>
        <ListItemStyled
          key={`item-${node.struktur_id}`}
          depth={depth}
          icon={<FolderIcon />}
          primary={node.name}
          onClick={() => {
            handleNodeClick(node);
            handleClick(node.struktur_id)
          }}
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
          <ListItemStyled
            icon={<FolderIcon color="primary" />}
            primary="Hillmann & Geitz"
            onClick={() => {
              handleNodeClick({ name: "Hillmann & Geitz" });
              handleClick('root');
            }}
            isExpandable
          />

          <Collapse in={open.root} timeout="auto">
            <List component="div" disablePadding>
              {/* Render tree structure */}
              {treeData.map(node => renderTreeNode(node, 1))}

              {/*//{Keep existing admin section}
              {hasFullAccess && (
                <>
                  <ListItemStyled
                    depth={1}
                    icon={<FolderIcon />}
                    primary="Monatspflege"
                  />
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
                </>
              )}
              

              {Keep existing persons section}
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
              */}
            </List>
          </Collapse>
        </List>
      </Box>
    </Paper>
  );
};


export default DashboardTree;