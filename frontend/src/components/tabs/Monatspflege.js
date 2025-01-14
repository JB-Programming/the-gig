import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Box,
  Typography,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';

const Monatspflege = ({ isAdmin = false, isSuperuser = false, userId, setShowNavBar }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      );
      const [employeeData, setEmployeeData] = useState([]);
      
    const fetchEntities = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/primary/');
          const initialData = response.data.teams.map((team, index) => ({
            entity: team,
            revenue: data[index]?.revenue || '0',
            dbPercent: data[index]?.dbPercent || '0,0000%',
            db: data[index]?.db || '',
            teamAdjustment: data[index]?.teamAdjustment || '0'
        }));
            return initialData;  
        } catch (error) {
          console.log('Error fetching entities:', error);
        }
    };

    

    useEffect(() => {
        fetchEntities().then(result => {
            setData(result)
        });
        console.log('DataEmp:', employeeData);
        console.log('Data:', data);
      }, []);
    
    useEffect(() => {
        const fetchMonthlyData = async (selectedMonth) => {
            const token = localStorage.getItem('token');
            try{
                const [year, month] = selectedMonth.split('-');
                const response = await axios.post('http://localhost:8000/api/monthly/', {
                    year: parseInt(year),
                    month: parseInt(month),
                    day: 1
                }, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                fetchEntities().then(result => {
                    if(response.data != null && response.data.length > 0){
                        var mappedData = response.data.map((item, index) => ({
                            entity: result[index]?.entity,  // Keep existing entity name
                            revenue: formatNumber(item.umsatz),
                            dbPercent: formatPercentage((item.db_ist)),
                            db: formatNumber(Math.round((item.umsatz*(item.db_ist/100)),0).toString()),
                            teamAdjustment: item.teamanpassung.toString()
                        }));
                    
                        if (mappedData && mappedData.length > 0) {
                            setData(mappedData);
                        }
                    } 
                    else {
                        const resetData = result.map(item => ({
                            entity: item.entity,
                            revenue: '0',
                            dbPercent: '0,0000%',
                            db: '',
                            teamAdjustment: '0'
                        }));
                        setData(resetData);
                    }
                })

                const response2 = await axios.post('http://localhost:8000/api/monthly_employees/', {
                    year: parseInt(year),
                    month: parseInt(month),
                    day: 1
                }, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if(response2.data != null && response2.data.length > 0){
                    var mappedData = response2.data.map((item, index) => ({
                        mitarbeiter_id: item.mitarbeiter_id,  // Keep existing entity name
                        festbetrag: formatNumber(item.festbetrag),
                        fixum: formatNumber(item.fixum),
                        fehltage: formatNumber(item.fehltage),
                        teiler: formatNumber(item.teiler),
                        name: item.name
                    }));
                
                    if (mappedData && mappedData.length > 0) {
                        setEmployeeData(mappedData);
                    }
                }
            } catch (error) {
                console.log('Error fetching entities:', error);
            }
        };
        fetchMonthlyData(selectedMonth);
    }, [selectedMonth]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const data1 = data.map(row => ({
          entity: row.entity,
          revenue: stripFormatting(row.revenue),
          dbPercent: stripPercentage(row.dbPercent).replace(',','.'),
          db: stripFormatting(row.db),
          teamAdjustment: row.teamAdjustment
        }));
        const data3 = employeeData.map(row => ({
            mitarbeiter_id: row.mitarbeiter_id,
            festbetrag: stripFormatting(row.festbetrag),
            fixum: stripFormatting(row.fixum),
            fehltage: stripFormatting(row.fehltage),
            teiler: stripFormatting(row.teiler),
            name: row.name
          }));
        const [year, month] = selectedMonth.split('-');
        const data2 = {
            date: `${year}-${month}-01`,
            data: data1,
            data2: data3
        };

        try {
            const response = await axios.post('http://localhost:8000/api/monthly_save/', data2, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Data saved successfully:', response.data);
        } catch (error) {
            console.log('Error saving data:', error);
        }
    };

    const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        console.log("Hochladen: ", selectedFile);
    };

    const handleMonthClose = () => {
        console.log("Monatsabschluss durchgeführt");
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    const stripFormatting = (str) => {
        return str.replace(/\./g, '');
    };
    
    const formatPercentage = (num) => {
        var parts
        const hasComma = str => str.includes(',');
        if (!num) return '0,0000%';
        
        if (hasComma(num)) {
            parts = num.split(',');
        } else {
            parts = num.split('.');
        }

        if (!parts[1]) {
          parts[1] = '0000';
        } else {
          parts[1] = parts[1].padEnd(4, '0').substring(0, 4);
        }
        
        return `${parts.join(',')}%`;
    };
      
    
    const stripPercentage = (str) => {
        return str.replace(/[%]/g, '');
    };

    const calculateDB = (revenue, dbPercent) => {
        if (!revenue || !dbPercent) return '';
        
        const cleanRevenue = stripFormatting(revenue);
        const cleanDBPercent = stripPercentage(dbPercent);
        const numericDBPercent = cleanDBPercent.replace(',', '.');
        
        const result = (parseFloat(cleanRevenue) * parseFloat(numericDBPercent)) / 100;
        return formatNumber(Math.round(result).toString());
    };
    
    const handleInputChange = (index, field, value) => {
        if (field === "revenue" || field === "dbPercent" || field === "teamAdjustment") {
            const newData = [...data];
            if (field === 'dbPercent') {
                const commaCount = (value.match(/,/g) || []).length;
                if (commaCount > 1) return;
                const numericValue = value.replace(/[^\d,]/g, '');
                newData[index][field] = numericValue;
            } else {
                const numericValue = value.replace(/[^\d]/g, '');
                newData[index][field] = numericValue;
            }
            newData[index].db = calculateDB(newData[index].revenue, newData[index].dbPercent);
            setData(newData);
        } else {
            const newEmployeeData = [...employeeData];
            const numericValue = value.replace(/[^\d]/g, '');
            newEmployeeData[index][field] = numericValue;
            setEmployeeData(newEmployeeData);
        }
    };
    
    const handleInputBlur = (index, field) => {
        if (field === "revenue" || field === "dbPercent" || field === "teamAdjustment") {
            const newData = [...data];
            if (field === 'dbPercent') {
                let value = newData[index][field];
                value = value.replace(/^0+(?=\d)/, '');
                if (!value) value = '0';
                newData[index][field] = formatPercentage(value);
            } else {
                let value = newData[index][field];
                value = value.replace(/^0+(?=\d)/, '');
                if (!value) value = '0';
                newData[index][field] = formatNumber(value);
            }
            setData(newData);
        } else {
            const newEmployeeData = [...employeeData];
            let value = newEmployeeData[index][field];
            value = value.replace(/^0+(?=\d)/, '');
            if (!value) value = '0';
            newEmployeeData[index][field] = formatNumber(value);
            setEmployeeData(newEmployeeData);
        }
    };
    
    
    const handleInputFocus = (index, field) => {
        var newData
        if (field === "revenue" || field === "dbPercent" || field === "teamAdjustment") {
            newData = [...data];
        }
        else {
            newData = [...employeeData];
        }
        if (field === 'dbPercent') {
            newData[index][field] = stripPercentage(newData[index][field]);
        } else {
            newData[index][field] = stripFormatting(newData[index][field]);
        }
        if (field === "revenue" || field === "dbPercent" || field === "teamAdjustment") {
            setData(newData);
        }
        else {
            setEmployeeData(newData);
        }
        };

    const calculateRevenueSum = () => {
        return data.reduce((sum, row) => {
          const value = stripFormatting(row.revenue);
          return sum + (parseInt(value) || 0);
        }, 0);
      };
      
    const calculateAverageDBPercent = () => {
        let count = 0;
        const sum = data.reduce((sum, row) => {
          const value = stripPercentage(row.dbPercent).replace(',', '.');
          if (value && value !== '0') {
            count++;
            return sum + parseFloat(value);
          }
          return sum;
        }, 0);
        
        const average = count > 0 ? sum / count : 0;
        return formatPercentage(average.toString().replace('.', ','));
    };
      
      const calculateDBSum = () => {
        return data.reduce((sum, row) => {
          const value = stripFormatting(row.db);
          return sum + (parseInt(value) || 0);
        }, 0);
      };
      
      const calculateTeamAdjustmentSum = () => {
        return data.reduce((sum, row) => {
          const value = stripFormatting(row.teamAdjustment);
          return sum + (parseInt(value) || 0);
        }, 0);
      };

      const generateMonthOptions = () => {
        const options = [];
        const today = new Date();
        
        // Add next 2 months
        for (let i = 2; i >= 0; i--) {
          const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const option = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
          options.push(option);
        }
        
        // Add past 24 months
        for (let i = 1; i <= 24; i++) {
          const pastDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const option = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}`;
          options.push(option);
        }
        
        return options;
      };

      const calculateBetragSum = () => {
        return formatNumber(employeeData.reduce((sum, row) => {
            const value = stripFormatting(row.festbetrag);
            return sum + (parseInt(value) || 0);
          }, 0))
    };
    
    const calculateFixumSum = () => {
        return formatNumber(employeeData.reduce((sum, row) => {
            const value = stripFormatting(row.fixum);
            return sum + (parseInt(value) || 0);
          }, 0))
    };
    
    const calculateFehltageSum = () => {
        return formatNumber(employeeData.reduce((sum, row) => {
            const value = stripFormatting(row.fehltage);
            return sum + (parseInt(value) || 0);
          }, 0))
    };
    
    const calculateTeilerAverage = () => {
        const validTeiler = employeeData.filter(row => row.teiler);
        const sum = validTeiler.reduce((sum, row) => sum + parseFloat(row.teiler), 0);
        return validTeiler.length ? (sum / validTeiler.length).toFixed(2) : '0.00';
    };

      const handleDateChange = (e) => {
        const date = e.target.value;
        console.log(date)
        setSelectedMonth(date);
        console.log('Selected date:', selectedMonth);
      };
      

    return (
    <div style={{ padding: "20px" }}>
        <h2>Monatspflege</h2>
        <h3>Summen im November 2024</h3>
        {/* Add dropdown above the table */}
        <select 
        value={selectedMonth} 
        onChange={handleDateChange}
        style={{ 
            marginBottom: '20px', 
            padding: '8px', 
            marginRight: '10px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
         }}
        >
        {generateMonthOptions().map(month => (
            <option key={month} value={month}>{month}</option>
        ))}
        </select>

        {/* Dateiimport und Buttons */}
        <div style={{ marginBottom: "20px" }}>
        <label>
            CSV Datei importieren:{" "}
            <input type="file" onChange={handleFileUpload} />
        </label>
        <button onClick={handleUpload} style={{ marginLeft: "10px", backgroundColor: "green", color: "white" }}>
            Hochladen
        </button>
        <button onClick={handleSave} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
            Speichern
        </button>
        <button onClick={handleMonthClose} style={{ marginLeft: "10px", backgroundColor: "purple", color: "white" }}>
            Monatsabschluss
        </button>
        </div>


        {/* Tabelle */}
        <TableContainer component={Paper}>
            <Table sx={{
                /*'& th,'*/ '& td': {
                    border: '1px solid #e0e0e0'
                }
            }}>
                <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell width="20%">Entität</TableCell>
                    <TableCell width="20%">Umsatz</TableCell>
                    <TableCell width="20%">DB IST in %</TableCell>
                    <TableCell width="20%">DB</TableCell>
                    <TableCell width="20%">Teamanpassung</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                    <TableCell width="20%">{row.entity}</TableCell>
                    <TableCell width="20%" sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                        <input 
                        type="text" 
                        value={row.revenue} 
                        onChange={(e) => handleInputChange(index, 'revenue', e.target.value)}
                        onBlur={() => handleInputBlur(index, 'revenue')}
                        onFocus={() => handleInputFocus(index, 'revenue')}
                        style={{ 
                            width: '98%', 
                            border: 'none', 
                            backgroundColor: 'transparent',
                            outline: 'none',
                            textAlign: 'right',  
                        }}
                        />
                    </TableCell>
                    <TableCell width="20%" sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                        <input 
                        type="text" 
                        value={row.dbPercent} 
                        onChange={(e) => handleInputChange(index, 'dbPercent', e.target.value)}
                        onBlur={() => handleInputBlur(index, 'dbPercent')}
                        onFocus={() => handleInputFocus(index, 'dbPercent')}
                        style={{ 
                            width: '98%', 
                            border: 'none', 
                            backgroundColor: 'transparent', 
                            //padding: '8px',
                            outline: 'none',
                            textAlign: 'right'
                        }}
                        />
                    </TableCell>
                    <TableCell width="20%" sx={{ 
                        backgroundColor: '#e3f2fd', 
                        padding: '12px',
                        textAlign: 'right'
                        }}
                        >{row.db}</TableCell>
                    <TableCell width="20%" sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                        <input 
                        type="text" 
                        value={row.teamAdjustment} 
                        onChange={(e) => handleInputChange(index, 'teamAdjustment', e.target.value)}
                        style={{ 
                            width: '98%', 
                            border: 'none', 
                            backgroundColor: 'transparent', 
                            //padding: '8px',
                            outline: 'none',
                            textAlign: 'right'
                        }}
                        />
                    </TableCell>
                    </TableRow>
                ))}
                {/* Sum row */}
                    <TableRow>
                        <TableCell sx={{ backgroundColor: '#bcbcbc' }}>Summe</TableCell>
                        <TableCell sx={{ backgroundColor: '#bcbcbc', textAlign: 'right' }}>
                        {formatNumber(calculateRevenueSum())}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#bcbcbc', textAlign: 'right' }}>
                        {calculateAverageDBPercent()}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#bcbcbc', textAlign: 'right' }}>
                        {formatNumber(calculateDBSum())}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#bcbcbc', textAlign: 'right' }}>
                        {formatNumber(calculateTeamAdjustmentSum())}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination  
        <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button style={{ marginRight: "10px" }}>Zurück</button>
        <button>Nächste</button>
        </div>*/}
        <div style={{ marginTop: "20px", textAlign: "center" }}></div>
        <div style={{ marginTop: "20px", textAlign: "center" }}></div>
        <TableContainer component={Paper}>
            <Table sx={{
                /*'& th,'*/ '& td': {
                    border: '1px solid #e0e0e0'
                }
            }}>
                <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell width="20%">Name</TableCell>
                    <TableCell width="20%">Festbetrag</TableCell>
                    <TableCell width="20%">Fixum</TableCell>
                    <TableCell width="20%">Fehltage</TableCell>
                    <TableCell width="20%">Teiler</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {employeeData.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell width="20%">{row.name}</TableCell>
                        <TableCell width="20%">
                            <input 
                            type="text" 
                            value={row.festbetrag} 
                            onChange={(e) => handleInputChange(index, 'festbetrag', e.target.value)}
                            onBlur={() => handleInputBlur(index, 'festbetrag')}
                            onFocus={() => handleInputFocus(index, 'festbetrag')}
                            style={{ 
                                width: '98%', 
                                border: 'none', 
                                backgroundColor: 'transparent', 
                                //padding: '8px',
                                outline: 'none',
                                textAlign: 'right'
                            }}
                            />
                        </TableCell>
                        <TableCell width="20%">
                            <input 
                            type="text" 
                            value={row.fixum} 
                            onChange={(e) => handleInputChange(index, 'fixum', e.target.value)}
                            onBlur={() => handleInputBlur(index, 'fixum')}
                            onFocus={() => handleInputFocus(index, 'fixum')}
                            style={{ 
                                width: '98%', 
                                border: 'none', 
                                backgroundColor: 'transparent', 
                                //padding: '8px',
                                outline: 'none',
                                textAlign: 'right'
                            }}
                            />
                        </TableCell>
                        <TableCell width="20%">
                            <input 
                            type="text" 
                            value={row.fehltage} 
                            onChange={(e) => handleInputChange(index, 'fehltage', e.target.value)}
                            onBlur={() => handleInputBlur(index, 'fehltage')}
                            onFocus={() => handleInputFocus(index, 'fehltage')}
                            style={{ 
                                width: '98%', 
                                border: 'none', 
                                backgroundColor: 'transparent', 
                                //padding: '8px',
                                outline: 'none',
                                textAlign: 'right'
                            }}
                            />
                        </TableCell>
                        <TableCell width="20%">
                            <input 
                            type="text" 
                            value={row.teiler.toString()} 
                            onChange={(e) => handleInputChange(index, 'teiler', e.target.value)}
                            onBlur={() => handleInputBlur(index, 'teiler')}
                            onFocus={() => handleInputFocus(index, 'teiler')}
                            style={{ 
                                width: '98%', 
                                border: 'none', 
                                backgroundColor: 'transparent', 
                                //padding: '8px',
                                outline: 'none',
                                textAlign: 'right'
                            }}
                            />
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#bcbcbc' }}>
                    <TableCell width="20%">Summe</TableCell>
                    <TableCell width="20%">{calculateBetragSum()}</TableCell>
                    <TableCell width="20%">{calculateFixumSum()}</TableCell>
                    <TableCell width="20%">{calculateFehltageSum()}</TableCell>
                    <TableCell width="20%">{calculateTeilerAverage()}</TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    );
};

export default Monatspflege;
    