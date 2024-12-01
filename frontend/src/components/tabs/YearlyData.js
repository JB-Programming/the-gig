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
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const YearlyData = ({ person }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPlannedData, setMonthlyPlannedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState([]);

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
          { month: '01/2024', bonus: 1200, pay: 4500 },
          { month: '02/2024', bonus: 1100, pay: 4500 },
          { month: '03/2024', bonus: 1300, pay: 4500 },
          { month: '04/2024', bonus: 1250, pay: 4500 },
          { month: '05/2024', bonus: 1400, pay: 4500 },
          { month: '06/2024', bonus: 1150, pay: 4500 },
          { month: '07/2024', bonus: 1200, pay: 4500 },
          { month: '08/2024', bonus: 1300, pay: 4500 },
          { month: '09/2024', bonus: 1250, pay: 4500 },
          { month: '10/2024', bonus: 1350, pay: 4500 },
          { month: '11/2024', bonus: 1400, pay: 4500 },
          { month: '12/2024', bonus: 2000, pay: 4500 },
        ];

        setMonthlyData(dummyData);

        // Dummy data for planned bonuses
        const plannedData = [
          { month: '01/2024', bonus: 2000 },
          { month: '02/2024', bonus: 2100 },
          { month: '03/2024', bonus: 3200 },
          { month: '04/2024', bonus: 1300 },
          { month: '05/2024', bonus: 1400 },
          { month: '06/2024', bonus: 1500 },
          { month: '07/2024', bonus: 1600 },
          { month: '08/2024', bonus: 1700 },
          { month: '09/2024', bonus: 1800 },
          { month: '10/2024', bonus: 1900 },
          { month: '11/2024', bonus: 2000 },
          { month: '12/2024', bonus: 2100 },
        ];

        setMonthlyPlannedData(plannedData);

        // Dummy data for team bonuses
        const teamData = [
          { team: 'Lager Team', fixedPay: 3500, overallPay: 5561 },
          { team: 'Teamleitung Lager', fixedPay: 3500, overallPay: 5369 },
          { team: 'Festbetrag', fixedPay: 3900, overallPay: 40100 },
        ];

        setTeamData(teamData);
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

  // Calculate average bonuses
  const averageBonus = monthlyData.reduce((acc, curr) => acc + curr.bonus, 0) / monthlyData.length;
  const averagePlannedBonus = monthlyPlannedData.reduce((acc, curr) => acc + curr.bonus, 0) / monthlyPlannedData.length;

  return (
    <Box>
      {/* Display Person's Name */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        {person.name}
      </Typography>

      {/* Overlapping Bar Chart for Actual and Planned Bonuses */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Boni über die Monate
      </Typography>
      <BarChart width={600} height={300} data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bonus" fill="#8884d8" name="Tatsächlicher Bonus" />
        <Bar dataKey="bonus" fill="#82ca9d" data={monthlyPlannedData} name="Geplanter Bonus" />
      </BarChart>

      {/* Average Bonus Card Side by Side */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 4 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            flex: 1, 
            mr: 2, 
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

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            flex: 1, 
            backgroundColor: 'primary.light',
            color: 'primary.contrastText'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Durchschnittlicher geplanter Bonus
          </Typography>
          <Typography variant="h4">
            €{averagePlannedBonus.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* Monthly Data Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Monat</TableCell>
              <TableCell align="right">Tatsächlicher Bonus (€)</TableCell>
              <TableCell align="right">Geplanter Bonus (€)</TableCell>
              <TableCell align="right">Gehalt (€)</TableCell>
              <TableCell align="right">Gesamt (€)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyData.map((row, index) => (
              <TableRow 
                key={row.month}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  {row.month}
                </TableCell>
                <TableCell align="right">{row.bonus.toFixed(2)}</TableCell>
                <TableCell align="right">{monthlyPlannedData[index]?.bonus.toFixed(2) || 'N/A'}</TableCell>
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
                  {monthlyPlannedData.reduce((sum, row) => sum + row.bonus, 0).toFixed(2)}
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

      {/* Matrix Table for Team Bonuses */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Team Boni über die Monate
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Team</TableCell>
              {monthlyData.map(row => (
                <TableCell key={row.month} align="right">{row.month}</TableCell>
              ))}
              <TableCell align="right">Festbetrag (€)</TableCell>
              <TableCell align="right">Gesamt (€)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamData.map(team => (
              <TableRow key={team.team}>
                <TableCell component="th" scope="row">
                  {team.team}
                </TableCell>
                {monthlyData.map((row, index) => (
                  <TableCell key={index} align="right">
                    {row.bonus.toFixed(2)} {/* Display actual bonus for the month */}
                  </TableCell>
                ))}
                <TableCell align="right">{team.fixedPay.toFixed(2)}</TableCell>
                <TableCell align="right">{team.overallPay.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {/* Summary Row for Team Bonuses */}
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Gesamt</strong></TableCell>
              {monthlyData.map((row, index) => (
                <TableCell key={index} align="right">
                  <strong>
                    {teamData.reduce((sum, team) => sum + row.bonus, 0).toFixed(2)}
                  </strong>
                </TableCell>
              ))}
              <TableCell align="right">
                <strong>
                  {teamData.reduce((sum, team) => sum + team.fixedPay, 0).toFixed(2)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {teamData.reduce((sum, team) => sum + team.overallPay, 0).toFixed(2)}
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