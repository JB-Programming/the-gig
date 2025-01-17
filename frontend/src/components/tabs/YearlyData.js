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
import { useCallback } from 'react';
import { useMemo } from 'react';


const YearlyData = ({ person }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPlannedData, setMonthlyPlannedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [teamPercentages, setTeamPercentages] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [availableYears, setAvailableYears] = useState([0]);

console.log("teamdata is:",teamData);
console.log("person:",person);
console.log(localStorage.getItem('token'));

// Memoize expensive calculations
const calculateMonthlyBonuses = useCallback(() => {
  const bonuses = [];
  teamData.teams_data?.forEach(teamEntry => {
      teamDetails.forEach(teamDetail => {
          if (teamDetail.primaerteam_id === teamEntry.primaerteam_id) {
              const teamPercentage = teamPercentages.find(percentage =>
                  percentage.team_id === teamDetail.team_id
              );
              if (teamPercentage) {
                  const bonus = Math.round(((teamEntry.umsatz * teamEntry.db_ist *0.01) - teamEntry.schwellenwert) * (teamDetail.provisionssatz * 0.01) * (teamPercentage.percentage * 0.01));
                  bonuses.push({
                      team: teamDetail.team_id,
                      date: `${teamEntry.jahr_und_monat.slice(5,7)}/${teamEntry.jahr_und_monat.slice(0,4)}`,
                      bonus: bonus
                  });
              }
          }
      });
  });
  // Get unique years for menu
  const availableYears = [...new Set(bonuses.map(bonus => 
  bonus.date.split('/')[1]
))].sort();
  setAvailableYears(availableYears);
  return bonuses;
}, [teamData, teamDetails, teamPercentages]);

// Memoize filtered bonuses
const filteredBonuses = useMemo(() => {
  const bonuses = calculateMonthlyBonuses();
  return bonuses.filter(bonus => 
      bonus.date.split('/')[1] === selectedYear
  );
}, [calculateMonthlyBonuses, selectedYear]);

// Single data fetch
const fetchData = useCallback(async () => {
  const token = localStorage.getItem('token');
  try {
      const [teamDataRes, percentagesRes, detailsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/monatsdaten_teams/?person=${encodeURIComponent(person.name)}`, {
              headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
              }
          }),
          axios.get(`http://localhost:8000/api/team-percentages/?person=${encodeURIComponent(person.name)}`, {
              headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
              }
          }),
          axios.get(`http://localhost:8000/api/team-details/?person=${encodeURIComponent(person.name)}`, {
              headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
              }
          })
      ]);

      setTeamData(teamDataRes.data);
      setTeamPercentages(percentagesRes.data.team_percentages);
      setTeamDetails(detailsRes.data.team_details);
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}, [person.name]);

useEffect(() => {
  fetchData();
}, [fetchData]);

/*
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

  fetchTeamData();
  console.log("Hello")
  console.log("Hello")
  console.log("Hello")
  console.log("Hello")

}, [person.name]);

/*

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

*/

/*

const calculateMonthlyBonuses = () => {
  const bonuses = [];

  teamData.teams_data?.forEach(teamEntry => {
    teamDetails.forEach(teamDetail => {
      //console.log("This is teamDetail",teamDetail);
      if (teamDetail.primaerteam_id === teamEntry.primaerteam_id) {
        const teamPercentage = teamPercentages.find(percentage =>
          percentage.team_id === teamDetail.team_id
        );
        if (teamPercentage) {
          const bonus = Math.round(((teamEntry.umsatz * teamEntry.db_ist *0.01) - teamEntry.schwellenwert) * (teamDetail.provisionssatz * 0.01) * (teamPercentage.percentage * 0.01)) //* (teamPercentage.percentage / 100);
          bonuses.push({
            team: teamDetail.team_id,
            date: `${teamEntry.jahr_und_monat.slice(5,7)}/${teamEntry.jahr_und_monat.slice(0,4)}`,
            bonus: bonus
          });
        }
      }
    });
    /*
    const teamDetail = teamDetails.find(detail => detail.primaerteam_id === teamEntry.primaerteam_id);
    const teamPercentage = teamPercentages.find(percentage => 
      percentage.primaerteam_id === teamEntry.primaerteam_id
    );
    console.log("One", teamPercentage);
    console.log("Two", teamEntry);
    
    if (teamDetail && teamPercentage) {
      // Format date from YYYY-MM-DD to MM/YYYY
      //const date = new Date(teamEntry.jahr_und_monat);
      const date = `${teamEntry.jahr_und_monat.slice(5,7)}/${teamEntry.jahr_und_monat.slice(0,4)}`;
      /*console.log("Team Entry:", teamData.teams_data);
      console.log("db_ist:", teamEntry.db_ist);
      console.log("db_plan:", teamEntry.db_plan);
      console.log("provisionssatz:", teamDetail.provisionssatz);
      console.log("percentage:", teamPercentage.percentage);
      console.log("percantage:", teamPercentages);

      
      const bonus = (teamEntry.db_ist - teamEntry.db_plan) * teamDetail.provisionssatz*0.01* teamPercentage.percentage;
      console.log(teamPercentage.team_id)             
      bonuses.push({
        team: teamPercentage.team_id, //teamEntry.primaerteam_id,
        date: date,
        bonus: bonus
      });  *  /
    
    });
    
  console.log("Bonuses:", bonuses);
  return bonuses;
};

// Calculate bonuses first
const bonuses = calculateMonthlyBonuses();
console.log("This runs again")


// Filter bonuses for selected year
const filteredBonuses = bonuses.filter(bonus => 
  bonus.date.split('/')[1] === selectedYear
);
*/
// Calculate total sum instead of average
const totalBonus = filteredBonuses.reduce((sum, curr) => sum + curr.bonus, 0);

// Get unique years for menu
/*
const availableYears = [...new Set(bonuses.map(bonus => 
  bonus.date.split('/')[1]
))].sort();
*/

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

        {(() => {
          const monthlyTotalBonuses = Array.from({length: 12}, (_, i) => {
            const month = String(i + 1).padStart(2, '0')
            const monthTotal = filteredBonuses
              .filter(b => b.date.split('/')[0] === month)
              .reduce((sum, b) => sum + b.bonus, 0)
            
            return {
              month: month,
              bonus: monthTotal
            }
          })

          return (
            <BarChart width={800} height={300} data={monthlyTotalBonuses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bonus" fill="#8884d8" name="Total Bonus" />
            </BarChart>
          )
        })()}

        {/* Matrix-style Monthly Data Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: 'primary.main',
                '& th': { 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }
              }}>
                <TableCell>Team</TableCell>
                {Array.from({length: 12}, (_, i) => (
                  <TableCell 
                    key={i} 
                    align="right"
                    sx={{
                      position: 'relative',
                      '&:hover::after': {
                        content: '""',
                        position: 'absolute',
                        backgroundColor: 'rgba(227, 242, 253, 0.3)',
                        width: '100%',
                        height: '1000%',
                        left: 0,
                        top: 0,
                        zIndex: 0,
                      }
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </TableCell>
                ))}
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...new Set(filteredBonuses.map(b => b.team))].map(teamId => {
                const teamMonthlyBonuses = Array.from({length: 12}, (_, i) => {
                  const month = String(i + 1).padStart(2, '0')
          return filteredBonuses.find(b => 
            b.team === teamId && 
            b.date.split('/')[0] === month
          )?.bonus || 0
        })
        
        const teamTotal = teamMonthlyBonuses.reduce((sum, bonus) => sum + bonus, 0)

        return (
          <TableRow 
            key={teamId}
            sx={{ 
              '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
              '&:hover': { backgroundColor: '#e3f2fd' },
              '& td': { 
                padding: '16px',
                borderRight: '1px solid rgba(224, 224, 224, 1)'
              }
            }}
          >
            <TableCell sx={{ 
              fontWeight: 'bold',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }}>
              Team {teamId}
            </TableCell>
            {teamMonthlyBonuses.map((bonus, index) => (
              <TableCell key={index} align="right">
                {bonus > 0 ? bonus.toFixed(2) : '-'}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ 
              fontWeight: 'bold',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }}>
              {teamTotal.toFixed(2)}
            </TableCell>
          </TableRow>
        )
      })}
      <TableRow sx={{ 
        backgroundColor: 'primary.dark',
        '& td': { 
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }
      }}>
        <TableCell>Total</TableCell>
        {Array.from({length: 12}, (_, i) => {
          const month = String(i + 1).padStart(2, '0')
          const monthTotal = filteredBonuses
            .filter(b => b.date.split('/')[0] === month)
            .reduce((sum, b) => sum + b.bonus, 0)
          return (
            <TableCell key={i} align="right">
              {monthTotal > 0 ? monthTotal.toFixed(2) : '-'}
            </TableCell>
          )
        })}
        <TableCell align="right">{totalBonus.toFixed(2)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
        </>
    )}
    {/* DB Performance Charts */}
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
      Team DB Performance {selectedYear}
    </Typography>

    {[...new Set(teamData.teams_data?.filter(t => 
        t.jahr_und_monat.slice(0,4) === selectedYear
      ).map(t => t.primaerteam_id))]
      .map(teamId => {
        // Create full year dataset
        const months = Array.from({length: 12}, (_, i) => {
          const month = String(i + 1).padStart(2, '0');
          const existingData = teamData.teams_data?.find(t => 
            t.primaerteam_id === teamId && 
            t.jahr_und_monat === `${selectedYear}-${month}-01`
          );
          return {
            month: month,
            db_ist: existingData?.db_ist || 0,
            db_plan: existingData?.db_plan || 0
          };
        });

        return (
          <Box key={teamId} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Team {teamId}
            </Typography>
            <BarChart width={800} height={300} data={months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="db_ist" fill="#8884d8" name="DB Ist" />
              <Bar dataKey="db_plan" fill="#82ca9d" name="DB Plan" />
            </BarChart>
          </Box>
        );
      })}
  </Box>
  
);
};

export default YearlyData;