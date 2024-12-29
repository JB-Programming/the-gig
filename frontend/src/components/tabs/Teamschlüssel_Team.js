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

const Teamschlüssel_Team = (selectedNode) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyData, setMonthlyData] = useState([
        { team: '', team_id: '', provisionssatz: '0,0000' }
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
            const response = await axios.post('http://localhost:8000/api/get_teamschluessel_data_team/', {
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
                let new_data = response.data.map((row, index) => ({
                    ...row,
                    provisionssatz: (response.data[index].provisionssatz || '0'),
                    }));
                console.log(new_data);
                setMonthlyData(new_data);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const saveData = async () => {
        const token = localStorage.getItem('token');
        try {
            const data = monthlyData.map(row => ({
                ...row,
                provisionssatz: parseFloat((row.provisionssatz))
              }));
            console.log(selectedNode.selectedNode)
            const response = await axios.post('http://localhost:8000/api/save_teamschluessel_team/', {
                data: data,
                year: selectedYear,
                team: selectedNode.selectedNode
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log(selectedYear)
    }, [selectedYear]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (index, field, value) => {
        const newData = [...monthlyData];
        const numericValue = validateNumericInput(value);
        newData[index][field] = numericValue;
        setMonthlyData(newData);
    };
    
    const handleInputBlur = (index, field) => {
        const newData = [...monthlyData];
        let value = newData[index][field];
        value = value.replace(/^0+(?=\d)/, '');
        if (!value) value = '0';
        newData[index][field] = (value);
        setMonthlyData(newData);
    };
    
    const handleInputFocus = (index, field) => {
        const newData = [...monthlyData];
        newData[index][field] = (newData[index][field]);
        setMonthlyData(newData);
    };
    
    const validateNumericInput = (value) => {
        const cleanValue = value.replace(/[^0-9,]/g, '');
        const parts = cleanValue.split(',');
        return parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    };
    
    const stripFormatting = (str) => {
        return str.replace(/,/g, '.');
    };
    

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">TEAMSCHLÜSSEL - {selectedNode.selectedNode.name}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button variant="contained" onClick={saveData}>
                        Speichern
                    </Button>
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
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                            <TableCell>Team</TableCell>
                            <TableCell>Provisionssatz</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {monthlyData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.team}</TableCell>
                                <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                                    <input 
                                        type="text" 
                                        value={row.provisionssatz}
                                        onChange={(e) => handleInputChange(index, 'provisionssatz', e.target.value)}
                                        onBlur={() => handleInputBlur(index, 'provisionssatz')}
                                        onFocus={() => handleInputFocus(index, 'provisionssatz')}
                                        style={{ 
                                            width: '100%', 
                                            border: 'none', 
                                            backgroundColor: 'transparent',
                                            margin: '0px 0px 0px -16px',
                                            outline: 'none',
                                            textAlign: 'right'
                                        }}
                                    />
                                </TableCell>

                            </TableRow>
                        ))}
                        <TableRow sx={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                            <TableCell>Summe</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>
                                {(monthlyData.reduce((sum, row) => {
                                    return sum + ((row.provisionssatz));
                                }, 0).toString())}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Teamschlüssel_Team;
