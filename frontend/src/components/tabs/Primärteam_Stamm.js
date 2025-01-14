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
  CircularProgress,
  TextField,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';

const Primärteam_Stamm = (selectedNode) => {
    const [formData, setFormData] = useState({
      bezeichnung: '',
      sortierfeld: '',
      notiz: '',
      planDB: '',
      teamanpassung: '',
      dbBeteiligung: '',
      umsatzBeteiligung: '',
      schwellwertDB: '',
      primär_id: '',
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyData, setMonthlyData] = useState([
      { month: 'Jan. 2024', anteile: '0', gewichtung: '0,0000', schwellwert: '0' },
      { month: 'Feb. 2024', anteile: '1.900.000', gewichtung: '10,4166', schwellwert: '190.000' },
      { month: 'Mär. 2024', anteile: '1.900.000', gewichtung: '10,4166', schwellwert: '190.000' },
      { month: 'Apr. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      { month: 'Mai. 2024', anteile: '1.461.538', gewichtung: '8,0128', schwellwert: '146.154' },
      { month: 'Jun. 2024', anteile: '1.900.000', gewichtung: '10,4166', schwellwert: '190.000' },
      { month: 'Jul. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      { month: 'Aug. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      { month: 'Sep. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      { month: 'Okt. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      { month: 'Nov. 2024', anteile: '1.607.692', gewichtung: '8,8141', schwellwert: '160.769' },
      //{ month: 'Dez. 2024', anteile: '1.461.538', gewichtung: '8,0128', schwellwert: '146.154' }
      ]);


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
  

    const get_team_data = async (team) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:8000/api/primary_team_data/', {
          team: team,
          year: selectedYear
        }, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
          }
        });

        const response2 = await axios.post('http://localhost:8000/api/primary_team_data_top/', {
          team: team
      }, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
          }
      });

        console.log(response2.data);

        console.log(response.data)
        if (response.data) {
          // Update formData
          if (response2.data) {
            setFormData({
                ...formData,
                bezeichnung: response2.data.bezeichnung,
                notiz: response2.data.notiz,
                planDB: formatPercentage(response.data.plan_db?.toString()) || '',
                teamanpassung: response.data.teamanpassung?.toString() || '',
                dbBeteiligung: formatPercentage(response.data.db_beteiligung?.toString()) || '',
                umsatzBeteiligung: response.data.umsatz_beteiligung?.toString() || '',
                schwellwertDB: formatNumber(response.data.schwellwert_db?.toString()) || '',
                primär_id: response.data.primär_id || '',
            });
          } else {
            setFormData({
              ...formData,
              planDB: formatPercentage(response.data.plan_db?.toString()) || '',
              teamanpassung: response.data.teamanpassung?.toString() || '',
              dbBeteiligung: formatPercentage(response.data.db_beteiligung?.toString()) || '',
              umsatzBeteiligung: response.data.umsatz_beteiligung?.toString() || '',
              schwellwertDB: formatNumber(response.data.schwellwert_db?.toString()) || '',
              primär_id: response.data.primär_id || '',
          });
          }
          handleMonthlyDataChange(null, null, null);

          // Update monthlyData
          const months = [
              { key: 'januar', label: 'Jan.' },
              { key: 'februar', label: 'Feb.' },
              { key: 'maerz', label: 'Mär.' },
              { key: 'april', label: 'Apr.' },
              { key: 'mai', label: 'Mai.' },
              { key: 'juni', label: 'Jun.' },
              { key: 'juli', label: 'Jul.' },
              { key: 'august', label: 'Aug.' },
              { key: 'september', label: 'Sep.' },
              { key: 'oktober', label: 'Okt.' },
              { key: 'november', label: 'Nov.' },
              { key: 'dezember', label: 'Dez.' }
          ];

          const newMonthlyData = months.map(month => {
              const value = response.data[month.key] || 0;
              return {
                  month: `${month.label} ${selectedYear}`,
                  anteile: formatNumber(value.toString()),
                  gewichtung: '0,0000', // Will be calculated by handleMonthlyDataChange
                  schwellwert: '0' // Will be calculated by handleMonthlyDataChange
              };
          });
          console.log("This good: ")
          console.log(newMonthlyData)

          const newData = [...newMonthlyData];
        
          // Calculate total anteile
          const totalAnteile = newData.reduce((sum, row) => {
            const anteil = parseFloat(row.anteile.replace(/\./g, '').replace(',', '.')) || 0;
            return sum + anteil;
          }, 0);
        
          // Get the yearly threshold value with null check
          const yearlyThreshold = formData.schwellwertDB ? parseFloat(formData.schwellwertDB.replace(/\./g, '').replace(',', '.')) : 0;
        
          // Update gewichtung and schwellwert for each row
          newData.forEach((row, i) => {
            const anteil = parseFloat(row.anteile.replace(/\./g, '').replace(',', '.')) || 0;
            const gewichtung = ((anteil / totalAnteile) * 100).toFixed(4);
            row.gewichtung = gewichtung.replace('.', ',');
            
            // Calculate monthly threshold based on gewichtung
            const monthlyThreshold = (parseFloat(gewichtung) / 100) * yearlyThreshold;
            row.schwellwert = formatNumber(monthlyThreshold.toFixed(0));
          });


          setMonthlyData(newData);
        }
      } catch (error) {
          console.log('Error fetching entities:', error);
      }
    };

    useEffect(() => {
      console.log(selectedYear)
      console.log(selectedNode.selectedNode.name)
      get_team_data(selectedNode.selectedNode.name)
    },[]);

    useEffect(() => {
      console.log(selectedYear)
      console.log(selectedNode.selectedNode.name)
      get_team_data(selectedNode.selectedNode.name)
    },[selectedNode]);

    useEffect(() => {
      get_team_data(selectedNode.selectedNode.name)
    }, [selectedYear]);

    useEffect(() => {
      handleMonthlyDataChange(null, null, null);
    },[formData]);

    useEffect(() => {
      //console.log(monthlyData)
    },[monthlyData])


  
    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
      
      const handleMonthlyDataChange = (index, field, value) => {
        const newData = [...monthlyData];
        if (index !== null && field !== null && value !== null) {
          newData[index][field] = value;
        }
      
        // Calculate total anteile
        const totalAnteile = newData.reduce((sum, row) => {
          const anteil = parseFloat(row.anteile.replace(/\./g, '').replace(',', '.')) || 0;
          return sum + anteil;
        }, 0);
      
        // Get the yearly threshold value with null check
        const yearlyThreshold = formData.schwellwertDB ? parseFloat(formData.schwellwertDB.replace(/\./g, '').replace(',', '.')) : 0;
      
        // Update gewichtung and schwellwert for each row
        newData.forEach((row, i) => {
          const anteil = parseFloat(row.anteile.replace(/\./g, '').replace(',', '.')) || 0;
          const gewichtung = ((anteil / totalAnteile) * 100).toFixed(4);
          row.gewichtung = gewichtung.replace('.', ',');
          
          // Calculate monthly threshold based on gewichtung
          const monthlyThreshold = (parseFloat(gewichtung) / 100) * yearlyThreshold;
          row.schwellwert = formatNumber(monthlyThreshold.toFixed(0));
        });
      
        setMonthlyData(newData);
      };
  
    const saveBasisdaten = async () => {
      const basisData = {
        bezeichnung: formData.bezeichnung,
        sortierfeld: formData.sortierfeld,
        notiz: formData.notiz
      };
      
      try {
        const response = await axios.post('http://localhost:8000/api/save_basis/', basisData);
        console.log('Basis data saved:', response.data);
      } catch (error) {
        console.error('Error saving basis data:', error);
      }
    };
  
    const saveJahresAndSchwellwerte = async () => {
      const data = monthlyData.map(row => ({
        month: row.month,
        anteile: stripFormatting(row.anteile),
        gewichtung: row.gewichtung,
        schwellwert: row.schwellwert
      }));
      
      const combinedData = {
        planDB: stripComma(formData.planDB),
        teamanpassung: formData.teamanpassung || 0,
        dbBeteiligung: stripComma(formData.dbBeteiligung),
        schwellwertDB: stripFormatting(formData.schwellwertDB),
        primär_id: formData.primär_id,
        monthlyData: data,
        year: selectedYear
      };
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/api/save_schwellenwerte/',{
        combinedData
        }, {
          headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
          }
      });
        console.log('Data saved successfully:', combinedData);
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const handleInputBlur = (index, field) => {
        const newData = [...monthlyData];
        let value = newData[index][field];
        value = value.replace(/^0+(?=\d)/, '');
        if (!value) value = '0';
        newData[index][field] = formatNumber(value);
        setMonthlyData(newData);
    };
      
    const handleInputFocus = (index, field) => {
        const newData = [...monthlyData];
        newData[index][field] = stripFormatting(newData[index][field]);
        setMonthlyData(newData);
    };
    
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
      
    const stripFormatting = (str) => {
        return str.replace(/\./g, '');
    };

    const stripComma = (str) => {
      return str.replace(',','.');
    };

    const validateNumericInput = (value) => {
      // Remove any characters that aren't numbers or commas
      const cleanValue = value.replace(/[^0-9,]/g, '');
      
      // Ensure only one comma exists
      const parts = cleanValue.split(',');
      return parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    };

    const validateNumericOnly = (value) => {
      // Remove any non-numeric characters
      return value.replace(/[^0-9]/g, '');
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




      

    return (
      <Box sx={{ padding: "20px" }}>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>BASISSTAMMDATEN</Typography>
          <Box sx={{display: 'grid', gap: 2 }}>
          <TextField
            label="Bezeichnung"
            value={formData.bezeichnung}
            onChange={(e) => handleInputChange('bezeichnung', e.target.value)}
            sx={{ width: '50%', mb: 2 }}
          />
          <TextField
            label="Sortierfeld"
            value={formData.sortierfeld}
            onChange={(e) => handleInputChange('sortierfeld', e.target.value)}
            sx={{ width: '50%', mr: 2 }}
          />
          <TextField
            label="Notiz"
            multiline
            rows={3}
            value={formData.notiz}
            onChange={(e) => handleInputChange('notiz', e.target.value)}
            sx={{ width: '100%', mt: 2 }}
          />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {/*<Button variant="contained" onClick={saveBasisdaten}>
              Speichern
            </Button>*/}
          </Box>
          
        </Paper>
        <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">JÄHRLICHE EINSTELLUNGEN</Typography>
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
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Plan Deckungsbetrag %"
              value={formData.planDB}
              onChange={(e) => {
                const validValue = validateNumericInput(e.target.value);
                handleInputChange('planDB', validValue);
              }}
              onBlur={(e) => {
                const formattedValue = formatPercentage(e.target.value);
                handleInputChange('planDB', formattedValue);
              }}
              sx={{ width: '50%' }}
            />
            <TextField
              label="Teamanpassung"
              value={formData.teamanpassung}
              onChange={(e) => handleInputChange('teamanpassung', e.target.value)}
              sx={{ width: '50%' }}
            />
            <TextField
              label="Teambeteiligung auf Deckungsbetrag %"
              value={formData.dbBeteiligung}
              onChange={(e) => {
                const validValue = validateNumericInput(e.target.value);
                handleInputChange('dbBeteiligung', validValue);
              }}
              onBlur={(e) => {
                const formattedValue = formatPercentage(e.target.value);
                handleInputChange('dbBeteiligung', formattedValue);
              }}
              sx={{ width: '50%' }}
            />
          </Box>
          <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>SCHWELLWERTE</Typography>
          <TextField
            label="Schwellwert DB/Jahr"
            value={formData.schwellwertDB}
            onChange={(e) => {
                handleInputChange('schwellwertDB', e.target.value);
                handleMonthlyDataChange(null,null,null)
            }}
            onBlur={() => {
                let value = formData.schwellwertDB;
                value = value.replace(/^0+(?=\d)/, '');
                if (!value) value = '0';
                setFormData(prev => ({ ...prev, schwellwertDB: formatNumber(value) }));
                handleMonthlyDataChange(null, null, null);
            }}
            onFocus={() => {
            setFormData(prev => ({ 
                ...prev, 
                schwellwertDB: stripFormatting(formData.schwellwertDB) 
            }));
            handleMonthlyDataChange(null, null, null);
            }}
            
            sx={{ width: '50%', mb: 3 }}
            />
  
          <TableContainer>
            <Table sx={{ '& td, & th': { border: '1px solid #e0e0e0' } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                  <TableCell>Monat</TableCell>
                  <TableCell>Anteile</TableCell>
                  <TableCell>Gewichtung</TableCell>
                  <TableCell>Schwellwert</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {monthlyData.map((row, index) => (
                <TableRow key={index}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell sx={{ backgroundColor: '#fff3e0', padding: '4px' }}>
                    <input 
                        type="text" 
                        value={row.anteile}
                        onChange={(e) => {
                          const validValue = validateNumericOnly(e.target.value);
                          handleMonthlyDataChange(index, 'anteile', validValue);
                        }}
                        onBlur={() => handleInputBlur(index, 'anteile')}
                        onFocus={() => handleInputFocus(index, 'anteile')}
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
                    <TableCell>{row.gewichtung}</TableCell>
                    <TableCell>{row.schwellwert}</TableCell>
                </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                    <TableCell>Summe</TableCell>
                    <TableCell sx={{ textAlign: 'right'}}>
                    {formatNumber(monthlyData.reduce((sum, row) => {
                        return sum + parseFloat(row.anteile.replace(/\./g, '').replace(',', '.'));
                    }, 0).toString())}
                    </TableCell>
                    <TableCell>100,0000 %</TableCell>
                    <TableCell>
                    {formatNumber(monthlyData.reduce((sum, row) => {
                        return sum + parseFloat(row.schwellwert.replace(/\./g, '').replace(',', '.'));
                    }, 0).toString())}
                    </TableCell>
                </TableRow>                
              </TableBody>
            </Table>
          </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={saveJahresAndSchwellwerte}>
                Speichern
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };
  
  export default Primärteam_Stamm;