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
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const YearlyData = ({ person }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPlannedData, setMonthlyPlannedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

console.log("teamdata is:",teamData);
console.log(localStorage.getItem('token'));
useEffect(() => {
  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Current token:", token);
      
      const response = await axios.get(`http://localhost:8000/api/monatsdaten_teams/?person=${encodeURIComponent(person.name)}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Team data:", response.data);
      setTeamData(response.data);
    } catch (error) {
      console.log("Error details:", error.response?.data);
    }
  };

  fetchTeamData();
}, [person.name]);


const [teamPercentages, setTeamPercentages] = useState([]);

useEffect(() => {
  const fetchTeamPercentages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/team-percentages/?person=${encodeURIComponent(person.name)}`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTeamPercentages(response.data.team_percentages);
    } catch (error) {
      console.error("Error fetching team percentages:", error);
    }
  };

  fetchTeamPercentages();
}, [person.name]);
console.log("teamPercentages areq:",teamPercentages);




const [teamDetails, setTeamDetails] = useState([]);

useEffect(() => {
  const fetchTeamDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/team-details/?person=${encodeURIComponent(person.name)}`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTeamDetails(response.data.team_details);
      console.log("Team details:", response.data.team_details);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  fetchTeamDetails();
}, [person.name]);



const calculateMonthlyBonuses = () => {
  const bonuses = [];
  
  teamData.teams_data?.forEach(teamEntry => {
    const teamDetail = teamDetails.find(detail => detail.team_id === teamEntry.primaerteam_id);
    const teamPercentage = teamPercentages.find(percentage => 
      percentage.team_id === teamEntry.primaerteam_id
    );
    
    if (teamDetail && teamPercentage) {
      // Format date from YYYY-MM-DD to MM/YYYY
      //const date = new Date(teamEntry.jahr_und_monat);
      const date = `${teamEntry.jahr_und_monat.slice(5,7)}/${teamEntry.jahr_und_monat.slice(0,4)}`;


      
      const bonus = (teamEntry.db_ist - teamEntry.db_plan) * teamDetail.provisionssatz* teamPercentage.percentage;
                   
      bonuses.push({
        team: teamEntry.primaerteam_id,
        date: date,
        bonus: bonus
      });
    }
  });
  
  return bonuses;
};

// Calculate bonuses first
const bonuses = calculateMonthlyBonuses();

// Get unique years for menu
const availableYears = [...new Set(bonuses.map(bonus => 
  bonus.date.split('/')[1]
))].sort();

// Filter bonuses for selected year
const filteredBonuses = bonuses.filter(bonus => 
  bonus.date.split('/')[1] === selectedYear
);

// Calculate total sum instead of average
const totalBonus = filteredBonuses.reduce((sum, curr) => sum + curr.bonus, 0);

return (
  <Box>
    <FormControl sx={{ mb: 3, minWidth: 120 }}>
      <InputLabel>Year</InputLabel>
      <Select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        label="Year"
      >
        {availableYears.map(year => (
          <MenuItem key={year} value={year}>{year}</MenuItem>
        ))}
      </Select>
    </FormControl>

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
        Total Bonus for {selectedYear}
      </Typography>
      <Typography variant="h4">
        €{totalBonus.toFixed(2)}
      </Typography>
    </Paper>

    {/* Display Person's Name */}
    <Typography variant="h5" sx={{ mb: 2 }}>
      {person.name}
    </Typography>

    {/* Year Selector (as before) */}

    {selectedYear && (
      <>
        {/* Bonus Bar Chart */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Boni über die Monate
        </Typography>
        <BarChart width={600} height={300} data={filteredBonuses}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bonus" fill="#8884d8" name="Bonus" />
        </BarChart>

        {/* Monthly Data Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell>Monat</TableCell>
                <TableCell align="right">Team</TableCell>
                <TableCell align="right">Bonus (€)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBonuses.map((row) => (
                <TableRow 
                  key={`${row.month}-${row.team}`}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>{row.month}</TableCell>
                  <TableCell align="right">{row.team}</TableCell>
                  <TableCell align="right">{row.bonus.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* Summary Row */}
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell colSpan={2}><strong>Gesamt</strong></TableCell>
                <TableCell align="right">
                  <strong>
                    {totalBonus.toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )}
  </Box>
);
};

export default YearlyData; 


