import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Box,
  Typography,
  Paper
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
            <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Entität</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Umsatz</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>DB IST in %</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>DB</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Teamanpassung</th>
            </tr>
        </thead>
        <tbody>
            {data.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.entity}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.revenue}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.dbPercent}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.db}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.teamAdjustment}</td>
            </tr>
            ))}
        </tbody>
        </table>

        {/* Pagination */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button style={{ marginRight: "10px" }}>Zurück</button>
        <button>Nächste</button>
        </div>
    </div>
    );
};

export default Monatspflege;
    