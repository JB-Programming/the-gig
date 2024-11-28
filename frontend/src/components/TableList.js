import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TableList = () => {
  const [tables, setTables] = useState({});
  const [expandedApps, setExpandedApps] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tables/');
      setTables(response.data);
      // Initialize all apps as collapsed
      const initialExpandState = Object.keys(response.data).reduce((acc, app) => {
        acc[app] = false;
        return acc;
      }, {});
      setExpandedApps(initialExpandState);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tables');
      setLoading(false);
    }
  };

  const handleToggleApp = (appName) => {
    setExpandedApps(prev => ({
      ...prev,
      [appName]: !prev[appName]
    }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Database Tables
      </Typography>
      {Object.entries(tables).map(([appName, models]) => (
        <Card key={appName} sx={{ mb: 2 }}>
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleToggleApp(appName)}
            >
              <Typography variant="h6" component="div">
                {appName.charAt(0).toUpperCase() + appName.slice(1)} App
              </Typography>
              <IconButton size="small">
                {expandedApps[appName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedApps[appName]}>
              <List>
                {models.map((model) => (
                  <ListItem key={model.name}>
                    <ListItemText
                      primary={model.verbose_name_plural}
                      secondary={`${model.count} records`}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TableList; 