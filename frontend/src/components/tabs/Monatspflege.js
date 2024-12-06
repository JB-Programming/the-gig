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
      

    useEffect(() => {
        console.log(data)
        const fetchEntities = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/primary/');
            const initialData = response.data.teams.map(team => ({
              entity: team,
              revenue: '',
              dbPercent: '',
              db: '',
              teamAdjustment: '0'
            }));
            
            setData(initialData);
            console.log("3 2 1 "+initialData)
            console.log('Loaded data:', initialData);
          } catch (error) {
            console.log('Error fetching entities:', error);
          }
        };
      
        fetchEntities();
      }, []);

    useEffect(() => {
        console.log('selectedMonth changed to:', selectedMonth);
        const fetchMonthlyData = async (selectedMonth) => {
            const token = localStorage.getItem('token');
            try{
                console.log(selectedMonth.split('-'));
                const [year, month] = selectedMonth.split('-');
                console.log(year)
                console.log(month)
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
                if(response.data != null){
                    console.log('Response data:', response.data);
                    console.log("HIT"+ data[0])
                    const mappedData = response.data.map((item, index) => ({
                        entity: data[index-1]?.entity || '',  // Keep existing entity name
                        revenue: item.umsatz,
                        dbPercent: item.db_ist,
                        db: ((parseFloat(item.umsatz) * parseFloat(item.db_ist)) / 100).toString(),
                        teamAdjustment: item.teamanpassung.toString()
                    }));
                                    
                setData(mappedData);
                }
                console.log('Response data:', response.data);
                console.log("HIT"+ data[0])
                const mappedData = response.data.map((item, index) => ({
                    entity: data[index-1].entity,  // Keep existing entity name
                    revenue: item.umsatz,
                    dbPercent: item.db_ist,
                    db: ((parseFloat(item.umsatz) * parseFloat(item.db_ist)) / 100).toString(),
                    teamAdjustment: item.teamanpassung.toString()
                  }));
                                    
                setData(mappedData);
            } catch (error) {
                console.log('Error fetching entities:', error);
            }
        };
        fetchMonthlyData(selectedMonth);
    }, [selectedMonth]);

    const handleSave = () => {
        const formattedData = data.map(row => ({
          entity: row.entity,
          revenue: stripFormatting(row.revenue),
          dbPercent: stripPercentage(row.dbPercent),
          db: stripFormatting(row.db),
          teamAdjustment: row.teamAdjustment
        }));
      
        console.log('Saved Data:', formattedData);
        // Here you can send the data to your backend
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
        if (!num) return '0,0000%';
        
        let parts = num.split(',');
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
        
        // Calculate DB after input change
        newData[index].db = calculateDB(newData[index].revenue, newData[index].dbPercent);
        
        setData(newData);
    };
    
    const handleInputBlur = (index, field) => {
        const newData = [...data];
        if (field === 'dbPercent') {
          let value = newData[index][field];
          // Remove leading zeros before comma
          value = value.replace(/^0+(?=\d)/, '');
          if (!value) value = '0';
          newData[index][field] = formatPercentage(value);
        } else {
          let value = newData[index][field];
          // Remove leading zeros
          value = value.replace(/^0+(?=\d)/, '');
          if (!value) value = '0';
          newData[index][field] = formatNumber(value);
        }
        setData(newData);
    };
    
    const handleInputFocus = (index, field) => {
    const newData = [...data];
    if (field === 'dbPercent') {
        newData[index][field] = stripPercentage(newData[index][field]);
    } else {
        newData[index][field] = stripFormatting(newData[index][field]);
    }
    setData(newData);
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
  <Table>
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
                width: '100%-16px', 
                border: 'none', 
                backgroundColor: 'transparent', 
                padding: '8px',
                outline: 'none',
                textAlign: 'right'
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
                width: '100%-16px', 
                border: 'none', 
                backgroundColor: 'transparent', 
                padding: '8px',
                outline: 'none',
                textAlign: 'right'
              }}
            />
          </TableCell>
          <TableCell width="20%" sx={{ backgroundColor: '#e3f2fd', padding: '12px' }}>{row.db}</TableCell>
          <TableCell width="20%" sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
            <input 
              type="text" 
              value={row.teamAdjustment} 
              onChange={(e) => handleInputChange(index, 'teamAdjustment', e.target.value)}
              style={{ 
                width: '100%-16px', 
                border: 'none', 
                backgroundColor: 'transparent', 
                padding: '8px',
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






        {/* Pagination */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button style={{ marginRight: "10px" }}>Zurück</button>
        <button>Nächste</button>
        </div>
    </div>
    );
};

export default Monatspflege;
    