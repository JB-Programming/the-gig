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
              const response = await axios.get('http://localhost:8000/api/changes/', {
                  headers: { Authorization: `Token ${localStorage.getItem('token')}` }
              });
              setChanges(response.data);
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
                          <TableCell>ID</TableCell>
                          <TableCell>Entität</TableCell>
                          <TableCell>Typ</TableCell>
                          <TableCell>Gültigkeit</TableCell>
                          <TableCell>Änderung</TableCell>
                          <TableCell>Zeitpunkt</TableCell>
                          <TableCell>Geändert von</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {changes.map((change) => (
                          <TableRow key={change.id}>
                              <TableCell>{change.id}</TableCell>
                              <TableCell>{change.entität}</TableCell>
                              <TableCell>{change.typ}</TableCell>
                              <TableCell>{new Date(change.gueltigkeit).toLocaleDateString()}</TableCell>
                              <TableCell>{change.aenderung}</TableCell>
                              <TableCell>{new Date(change.zeitpunkt).toLocaleString()}</TableCell>
                              <TableCell>{change.geaendert_von}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </div>
  );
};

export default ChangeHistory;