import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography 
} from '@mui/material';

const ChangeHistory = () => {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
      const fetchChangeHistory = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/aenderungsblog/', {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            });
            
              setChanges(response.data);
              console.log('Change history:', response.data);
          } catch (error) {
              console.error('Failed to fetch change history:', error);
          }
      };

      fetchChangeHistory();
  }, []);

  return (
      <div>
          <Typography variant="h6" gutterBottom>
              Änderungshistorie
          </Typography>
          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>Entität</TableCell>
                          <TableCell>Typ</TableCell>
                          <TableCell>Änderungszeitpunkt</TableCell>
                          <TableCell>Änderung</TableCell>
                          <TableCell>Geändert von</TableCell>
                      </TableRow>
                  </TableHead>
                    <TableBody>
                        {changes.map((change, index) => (
                            <TableRow key={index}>
                                <TableCell>{change.entität}</TableCell>
                                <TableCell>{change.typ}</TableCell>
                                <TableCell>{new Date(change.zeitpunkt).toLocaleString()}</TableCell>
                                <TableCell>{change.aenderung}</TableCell>
                                <TableCell>{change.user_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>  
              </Table>
          </TableContainer>
      </div>
  );
};

export default ChangeHistory;
