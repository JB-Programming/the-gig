import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

const YearlyData = ({ person }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/yearly-data/${person.id}`);
        
        // Log the raw response to see what we're getting
        const rawResponse = await response.text();
        console.log('Raw API response:', rawResponse);

        // For now, use dummy data until the API is ready
        const dummyData = [
          { month: 'Januar', bonus: 1200, pay: 4500 },
          { month: 'Februar', bonus: 1100, pay: 4500 },
          { month: 'März', bonus: 1300, pay: 4500 },
          { month: 'April', bonus: 1250, pay: 4500 },
          { month: 'Mai', bonus: 1400, pay: 4500 },
          { month: 'Juni', bonus: 1150, pay: 4500 },
          { month: 'Juli', bonus: 1200, pay: 4500 },
          { month: 'August', bonus: 1300, pay: 4500 },
          { month: 'September', bonus: 1250, pay: 4500 },
          { month: 'Oktober', bonus: 1350, pay: 4500 },
          { month: 'November', bonus: 1400, pay: 4500 },
          { month: 'Dezember', bonus: 2000, pay: 4500 },
        ];

        setMonthlyData(dummyData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [person.id]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Typography color="error" sx={{ p: 2 }}>
      Error loading data: {error}
    </Typography>
  );

  // Calculate average bonus
  const averageBonus = monthlyData.reduce((acc, curr) => acc + curr.bonus, 0) / monthlyData.length;

  return (
    <Box>
      {/* Average Bonus Card */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'primary.light',
          color: 'primary.contrastText'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Durchschnittlicher Bonus
        </Typography>
        <Typography variant="h4">
          €{averageBonus.toFixed(2)}
        </Typography>
      </Paper>

      {/* Monthly Data Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Monat</TableCell>
              <TableCell align="right">Bonus (€)</TableCell>
              <TableCell align="right">Gehalt (€)</TableCell>
              <TableCell align="right">Gesamt (€)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyData.map((row) => (
              <TableRow 
                key={row.month}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  {row.month}
                </TableCell>
                <TableCell align="right">{row.bonus.toFixed(2)}</TableCell>
                <TableCell align="right">{row.pay.toFixed(2)}</TableCell>
                <TableCell align="right">{(row.bonus + row.pay).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {/* Summary Row */}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Gesamt</strong></TableCell>
              <TableCell align="right">
                <strong>
                  {monthlyData.reduce((sum, row) => sum + row.bonus, 0).toFixed(2)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {monthlyData.reduce((sum, row) => sum + row.pay, 0).toFixed(2)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {monthlyData.reduce((sum, row) => sum + row.bonus + row.pay, 0).toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default YearlyData; 