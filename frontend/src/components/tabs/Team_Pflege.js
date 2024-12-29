import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button
} from '@mui/material';
import axios from 'axios';

const Team_Pflege = (selectedNode) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyData, setMonthlyData] = useState([
        { month: 'Januar', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Februar', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'März', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'April', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Mai', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Juni', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Juli', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'August', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'September', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Oktober', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'November', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' },
        { month: 'Dezember', teamentgeltPlan: '0', teamentgeltIst: '0', schwellenwertMA: '0', schwellenwert: '0' }
    ]);

    const generateYearOptions = () => {
        const options = [];
        const currentYear = new Date().getFullYear();
        options.push((currentYear + 1).toString());
        options.push(currentYear.toString());
        for (let i = 1; i <= 5; i++) {
            options.push((currentYear - i).toString());
        }
        return options;
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/api/get_team_data/', {
                year: selectedYear,
                team: selectedNode.selectedNode.name
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                console.log(response.data);
                console.log(response.data);
                console.log(response.data[0].teamentgeltPlan)
                const newMonthlyData = monthlyData.map((row, index) => ({
                    ...row,
                    teamentgeltPlan: formatNumber(response.data[index].teamentgeltPlan || '0'),
                    teamentgeltIst: formatNumber(response.data[index].teamentgeltIst || '0'),
                    schwellenwertMA: formatNumber(response.data[index].schwellenwertMA || '0'),
                    schwellenwert: formatNumber(response.data[index].schwellenwert || '0'),

                }));
                setMonthlyData(newMonthlyData);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear, selectedNode]);


    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const stripFormatting = (str) => {
        return str.replace(/\./g, '');
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">MONATLICHE ÜBERSICHT - {selectedNode.selectedNode.name}</Typography>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ 
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                >
                    {generateYearOptions().map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                            <TableCell>Monat</TableCell>
                            <TableCell>Teamentgelt PLAN</TableCell>
                            <TableCell>Teamentgelt IST</TableCell>
                            <TableCell>Schwellenwert / MA</TableCell>
                            <TableCell>Schwellenwert</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {monthlyData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.month}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{formatNumber(row.teamentgeltPlan)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{formatNumber(row.teamentgeltIst)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{formatNumber(row.schwellenwertMA)}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{formatNumber(row.schwellenwert)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                            <TableCell>Summe</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {formatNumber(monthlyData.reduce((sum, row) => sum + parseInt(stripFormatting(row.teamentgeltPlan)), 0))}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {formatNumber(monthlyData.reduce((sum, row) => sum + parseInt(stripFormatting(row.teamentgeltIst)), 0))}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {formatNumber(monthlyData.reduce((sum, row) => sum + parseInt(stripFormatting(row.schwellenwertMA)), 0))}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {formatNumber(monthlyData.reduce((sum, row) => sum + parseInt(stripFormatting(row.schwellenwert)), 0))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Team_Pflege;
