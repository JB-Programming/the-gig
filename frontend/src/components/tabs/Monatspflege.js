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
    const [data, setData] = useState([
    { entity: "Hillmann & Geitz gesamt DB", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB alle AD Kunden", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Kunden 03", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB AD Gebiet Meyer", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Neukunden Meyer", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Gebiet Küpker", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Neukunden Küpker", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Gebiet Harms", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "DB Neukunden Harms", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    { entity: "Summe", revenue: "", dbPercent: "", db: "", teamAdjustment: 0 },
    ]);

    const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        console.log("Hochladen: ", selectedFile);
    };

    const handleSave = () => {
        console.log("Daten gespeichert");
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
    
    const handleInputChange = (index, field, value) => {
    if (field === 'dbPercent') {
        // Allow numbers and one comma
        const commaCount = (value.match(/,/g) || []).length;
        if (commaCount > 1) return;
        
        const numericValue = value.replace(/[^\d,]/g, '');
        const newData = [...data];
        newData[index][field] = numericValue;
        setData(newData);
    } else {
        // Original number handling for other fields
        const numericValue = value.replace(/[^\d]/g, '');
        const newData = [...data];
        newData[index][field] = numericValue;
        setData(newData);
    }
    };
    
    const handleInputBlur = (index, field) => {
    const newData = [...data];
    if (field === 'dbPercent') {
        newData[index][field] = formatPercentage(newData[index][field] || '0');
    } else {
        newData[index][field] = formatNumber(newData[index][field] || '0');
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
      

    return (
    <div style={{ padding: "20px" }}>
        <h2>Monatspflege</h2>
        <h3>Summen im November 2024</h3>

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
    