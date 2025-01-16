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

const Primärteam_Pflege = (selectedNode) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyData, setMonthlyData] = useState([
        { month: 'Januar', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Februar', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'März', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'April', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Mai', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Juni', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Juli', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'August', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'September', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Oktober', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'November', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' },
        { month: 'Dezember', umsatzPlan: '0', umsatzIst: '0', umsatzDelta: '0', dbPlanPercent: '0,0000', dbIstPercent: '0,0000', dbPlan: '0', dbIst: '0', dbDeltaPlan: '0', dbSchwellwert: '0', dbDeltaSchwellwert: '0' }
    ]);
    const [primaryID, setPrimaryID] = useState(null);
    const [planDeckungsbeitrag, setPlanDeckungsbeitrag] = useState(null);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/api/get_monthly_data/', {
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
                console.log(typeof(response.data.monthlyData[0].umsatzPlan));
                console.log(response.data.monthlyData[0].umsatzIst);
                console.log(response.data.monthlyData[0].dbPlanPercent);
                console.log(response.data.monthlyData[0].dbIstPercent);
                console.log(response.data.monthlyDataSchwellenwert);
                console.log(response.data.monthlyData[0].dbPlanPercent)
                console.log(response.data);
                console.log(response.data.primär_id)
                setPrimaryID(response.data.primär_id);
                setPlanDeckungsbeitrag(response.data.monthlyDataSchwellenwert[0][12].toString());
                
                const newMonthlyData = monthlyData.map((row, index) => ({
                    ...row,
                    umsatzPlan: formatNumber(response.data.monthlyData[index].umsatzPlan || '0'),
                    umsatzIst: formatNumber(response.data.monthlyData[index].umsatzIst || '0'),
                    dbPlanPercent: (response.data.monthlyData[index].dbPlanPercent || '0') ? formatPercentage(response.data.monthlyDataSchwellenwert[0][12].toString()) : formatPercentage(response.data.monthlyData[index].dbPlanPercent.toString() || '0'),
                    dbIstPercent: formatPercentage(response.data.monthlyData[index].dbIstPercent.toString()),
                    dbSchwellwert: formatNumber(response.data.monthlyDataSchwellenwert[0][index] || '0'),

                }));
    
                setMonthlyData(newMonthlyData);
                // Recalculate all derived values
                newMonthlyData.forEach((_, index) => {
                    calculateDerivedValues(newMonthlyData, index);
                });
                console.log(response.data);

            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const saveData = async () => {
        const token = localStorage.getItem('token');
        console.log(planDeckungsbeitrag)
        console.log(stripComma(monthlyData[0].dbPlanPercent));
        // Convert the data to the desired format
        const data = monthlyData.map(row => ({
            month: row.month,
            umsatzPlan: stripFormatting(row.umsatzPlan),
            umsatzIst: stripFormatting(row.umsatzIst),
            dbPlanPercent: stripComma(row.dbPlanPercent), //=== planDeckungsbeitrag ? '0.0000' : stripComma(row.dbPlanPercent),
            dbIstPercent: stripComma(row.dbIstPercent),
            dbPlan: stripFormatting(row.dbPlan),
            dbIst: stripFormatting(row.dbIst),
            dbDeltaPlan: stripFormatting(row.dbDeltaPlan),
            dbSchwellwert: stripFormatting(row.dbSchwellwert),
            dbDeltaSchwellwert: stripFormatting(row.dbDeltaSchwellwert)
          }));

        try {
            const response = await axios.post('http://localhost:8000/api/save_monthly_data/', {
                data: data,
                year: selectedYear,
                id: primaryID
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data saved successfully', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
    

    const handleInputChange = (index, field, value) => {
        const newData = [...monthlyData];
        if (field === 'dbPlanPercent' || field === 'dbIstPercent') {
            const numericValue = validateNumericInput(value);
            newData[index][field] = numericValue;
        } else {
            const numericValue = value.replace(/[^\d]/g, '');
            newData[index][field] = numericValue;
        }
        calculateDerivedValues(newData, index);
        setMonthlyData(newData);
    };

    const calculateDerivedValues = (newData, index) => {
        const row = newData[index];
        row.umsatzDelta = formatNumber((parseInt(stripFormatting(row.umsatzIst)) - parseInt(stripFormatting(row.umsatzPlan))).toString());
        row.dbPlan = formatNumber(Math.round(parseInt(stripFormatting(row.umsatzPlan)) * parseFloat(stripPercentage(row.dbPlanPercent).replace(',','.')) / 100).toString());
        row.dbIst = formatNumber(Math.round(parseInt(stripFormatting(row.umsatzIst)) * parseFloat(stripPercentage(row.dbIstPercent).replace(',','.')) / 100).toString());
        row.dbDeltaPlan = formatNumber((parseInt(stripFormatting(row.dbIst)) - parseInt(stripFormatting(row.dbPlan))).toString());
        row.dbDeltaSchwellwert = formatNumber((parseInt(stripFormatting(row.dbIst)) - parseInt(stripFormatting(row.dbSchwellwert))).toString());
    };

    const handleInputBlur = (index, field) => {
        const newData = [...monthlyData];
        let value = newData[index][field];
        value = value.replace(/^0+(?=\d)/, '');
        if (!value) value = '0';
        
        // Format differently based on field type
        if (field === 'dbPlanPercent' || field === 'dbIstPercent') {
            newData[index][field] = formatPercentage(value);
        } else {
            newData[index][field] = formatNumber(value);
        }
        
        setMonthlyData(newData);
    };

    const handleInputFocus = (index, field) => {
        const newData = [...monthlyData];
        newData[index][field] = stripFormatting(newData[index][field]);
        setMonthlyData(newData);
    };

    const generateYearOptions = () => {
        const options = [];
        const currentYear = new Date().getFullYear();
        
        // Add next year
        options.push((currentYear + 1).toString());
        
        // Add current year
        options.push(currentYear.toString());
        
        // Add past 5 years
        for (let i = 1; i <= 5; i++) {
            options.push((currentYear - i).toString());
        }
        
        return options;
    };


    const formatPercentage = (num) => {
        if (!num) return '0,0000';
        
        // Convert dot to comma if present
        const numWithComma = num.replace('.', ',');
        
        // Split by comma if exists, otherwise treat as whole number
        const parts = numWithComma.includes(',') ? numWithComma.split(',') : [numWithComma, ''];
        
        // Round decimal part to 4 digits if longer
        let decimalPart = parts[1];
        if (decimalPart.length > 4) {
            decimalPart = Math.round(parseFloat('0.' + decimalPart) * 10000) / 10000;
            decimalPart = decimalPart.toString().split('.')[1] || '0000';
        }
        
        // Pad decimal part with zeros to exactly 4 digits
        decimalPart = decimalPart.padEnd(4, '0').substring(0, 4);
        
        return `${parts[0]},${decimalPart}`;
    };

    const stripComma = (str) => {
        return str.replace(',','.');
      };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    const stripFormatting = (str) => {
        return str.replace(/\./g, '');
    };

    const validateNumericInput = (value) => {
        const cleanValue = value.replace(/[^0-9,]/g, '');
        const parts = cleanValue.split(',');
        return parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    };

    const stripPercentage = (value) => {
        return value || '0,0000';
    };

    // Add these calculation functions
    const calculateUmsatzPlanSum = () => {
        return formatNumber(monthlyData.reduce((sum, row) => {
            return sum + parseFloat(stripFormatting(row.umsatzPlan));
        }, 0).toString());
    };

    const calculateUmsatzIstSum = () => {
        return formatNumber(monthlyData.reduce((sum, row) => {
            return sum + parseFloat(stripFormatting(row.umsatzIst));
        }, 0).toString());
    };

    const calculateUmsatzDeltaSum = () => {
        return formatNumber(monthlyData.reduce((sum, row) => {
            return sum + parseFloat(stripFormatting(row.umsatzDelta));
        }, 0).toString());
    };

    const calculateAverageDBPlanPercent = () => {
        let count = 0;
        const sum = monthlyData.reduce((sum, row) => {
            const value = stripPercentage(row.dbPlanPercent).replace(',', '.');
            if (value && value !== '0') {
                count++;
                return sum + parseFloat(value);
            }
            return sum;
        }, 0);
        const average = count > 0 ? sum / count : 0;
        return formatPercentage(average.toString().replace('.', ','));
    };

    const calculateAverageDBIstPercent = () => {
        let count = 0;
        const sum = monthlyData.reduce((sum, row) => {
            const value = stripPercentage(row.dbIstPercent).replace(',', '.');
            if (value && value !== '0') {
                count++;
                return sum + parseFloat(value);
            }
            return sum;
        }, 0);
        const average = count > 0 ? sum / count : 0;
        return formatPercentage(average.toString().replace('.', ','));
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">MONATLICHE ÜBERSICHT - {selectedNode.selectedNode.name}</Typography>
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
                        <TableRow sx={{ backgroundColor: 'primary.light' }}>
                            <TableCell>Monat</TableCell>
                            <TableCell>Umsatz PLAN</TableCell>
                            <TableCell>Umsatz IST</TableCell>
                            <TableCell>Umsatz DELTA</TableCell>
                            <TableCell>DB PLAN in %</TableCell>
                            <TableCell>DB IST in %</TableCell>
                            <TableCell>DB PLAN</TableCell>
                            <TableCell>DB IST</TableCell>
                            <TableCell>DB DELTA Ist/PLAN</TableCell>
                            <TableCell>DB Schwellwert</TableCell>
                            <TableCell>DB DELTA Ist/Schwellwert</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {monthlyData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.month}</TableCell>
                                <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                                    <input 
                                        type="text"
                                        value={row.umsatzPlan}
                                        onChange={(e) => handleInputChange(index, 'umsatzPlan', e.target.value)}
                                        onBlur={(e) => handleInputBlur(index, 'umsatzPlan', e.target.value)}
                                        onFocus={(e) => handleInputFocus(index, 'umsatzPlan', e.target.value)}
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
                                <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                                    <input 
                                        type="text"
                                        value={row.umsatzIst}
                                        onChange={(e) => handleInputChange(index, 'umsatzIst', e.target.value)}
                                        onBlur={(e) => handleInputBlur(index, 'umsatzIst', e.target.value)}
                                        onFocus={(e) => handleInputFocus(index, 'umsatzIst', e.target.value)}
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
                                <TableCell sx={{ textAlign: 'right' }}>{row.umsatzDelta}</TableCell>
                                <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                                    <input 
                                        type="text"
                                        value={row.dbPlanPercent}
                                        onChange={(e) => handleInputChange(index, 'dbPlanPercent', e.target.value)}
                                        onBlur={(e) => handleInputBlur(index, 'dbPlanPercent', e.target.value)}
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
                                <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                                    <input 
                                        type="text"
                                        value={row.dbIstPercent}
                                        onChange={(e) => handleInputChange(index, 'dbIstPercent', e.target.value)}
                                        onBlur={(e) => handleInputBlur(index, 'dbIstPercent', e.target.value)}
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
                                <TableCell sx={{ textAlign: 'right' }}>{row.dbPlan}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{row.dbIst}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{row.dbDeltaPlan}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{row.dbSchwellwert}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>{row.dbDeltaSchwellwert}</TableCell>
                            </TableRow>
                            
                        ))}
                        <TableRow sx={{ backgroundColor: '#bcbcbc', fontWeight: 'bold' }}>
                            <TableCell>Summe</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{calculateUmsatzPlanSum()}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{calculateUmsatzIstSum()}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{calculateUmsatzDeltaSum()}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{calculateAverageDBPlanPercent()}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{calculateAverageDBIstPercent()}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{formatNumber(monthlyData.reduce((sum, row) => sum + parseFloat(stripFormatting(row.dbPlan)), 0))}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{formatNumber(monthlyData.reduce((sum, row) => sum + parseFloat(stripFormatting(row.dbIst)), 0))}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{formatNumber(monthlyData.reduce((sum, row) => sum + parseFloat(stripFormatting(row.dbDeltaPlan)), 0))}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{formatNumber(monthlyData.reduce((sum, row) => sum + parseFloat(stripFormatting(row.dbSchwellwert)), 0))}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{formatNumber(monthlyData.reduce((sum, row) => sum + parseFloat(stripFormatting(row.dbDeltaSchwellwert)), 0))}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Primärteam_Pflege;
