import React, { useState } from 'react';
import styles from './CompanyStructure.module.css';

function CompanyStructure() {
  const [entities] = useState([
    { id: 29672, type: 'Person', name: 'N.N.', vorname: '', standort: '', bemerkung: '' },
    { id: 30073, type: 'Person', name: 'N.N. Verkauf', vorname: '', standort: '', bemerkung: '' },
    { id: 29864, type: 'Person', name: 'Planstelle Lager', vorname: 'N.N.', standort: '', bemerkung: '' },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unternehmensstruktur</h1>
        <button className={styles.button}>Baum aktualisieren</button>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardSubtitle}>ANLEGEN UND ÄNDERN</div>
          <h2 className={styles.cardTitle}>Alle Entitäten</h2>
          <div className={styles.controls}>
            <div>
              <select className={styles.select}>
                <option>Show 25 rows</option>
                <option>Show 50 rows</option>
                <option>Show 100 rows</option>
              </select>
              <button className={styles.button}>New</button>
              <button className={styles.button}>Edit</button>
            </div>
            <input type="text" className={styles.input} placeholder="Suchen" />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Typ</th>
                <th>Name</th>
                <th>Vorname</th>
                <th>Standort</th>
                <th>Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id}>
                  <td>{entity.id}</td>
                  <td>{entity.type}</td>
                  <td>{entity.name}</td>
                  <td>{entity.vorname}</td>
                  <td>{entity.standort}</td>
                  <td>{entity.bemerkung}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button className={styles.button}>Zurück</button>
            <button className={styles.button}>1</button>
            <button className={styles.button}>Nächste</button>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardSubtitle}>ÜBERGEORDNETE OBJEKTE</div>
          <h2 className={styles.cardTitle}>Teams und Gruppen</h2>
          <div className={styles.controls}>
            <select className={styles.select}>
              <option>50</option>
              <option>25</option>
              <option>100</option>
            </select>
            <div>
              <button className={styles.button}>Einträge anzeigen</button>
              <input type="text" className={styles.input} placeholder="Suchen" />
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>P</th>
                <th>Name</th>
                <th>Typ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className={styles.emptyState}>
                  Keine Daten in der Tabelle vorhanden
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button className={styles.button}>Zurück</button>
            <button className={styles.button}>Nächste</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyStructure;

/*
import React, { useState } from 'react';
import './CompanyStructure.module.css';

function CompanyStructure() {
  const [entities] = useState([
    { id: 29672, type: 'Person', name: 'N.N.', vorname: '', standort: '', bemerkung: '' },
    { id: 30073, type: 'Person', name: 'N.N. Verkauf', vorname: '', standort: '', bemerkung: '' },
    { id: 29864, type: 'Person', name: 'Planstelle Lager', vorname: 'N.N.', standort: '', bemerkung: '' },
  ]);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Unternehmensstruktur</h1>
        <button className="button">Baum aktualisieren</button>
      </div>
      <div className="grid">
        <div className="card">
          <div className="cardSubtitle">ANLEGEN UND ÄNDERN</div>
          <h2 className="cardTitle">Alle Entitäten</h2>
          <div className="controls">
            <div>
              <select className="select">
                <option>Show 25 rows</option>
                <option>Show 50 rows</option>
                <option>Show 100 rows</option>
              </select>
              <button className="button">New</button>
              <button className="button">Edit</button>
            </div>
            <input type="text" className="input" placeholder="Suchen" />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Typ</th>
                <th>Name</th>
                <th>Vorname</th>
                <th>Standort</th>
                <th>Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id}>
                  <td>{entity.id}</td>
                  <td>{entity.type}</td>
                  <td>{entity.name}</td>
                  <td>{entity.vorname}</td>
                  <td>{entity.standort}</td>
                  <td>{entity.bemerkung}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="button">Zurück</button>
            <button className="button">1</button>
            <button className="button">Nächste</button>
          </div>
        </div>
        <div className="card">
          <div className="cardSubtitle">ÜBERGEORDNETE OBJEKTE</div>
          <h2 className="cardTitle">Teams und Gruppen</h2>
          <div className="controls">
            <select className="select">
              <option>50</option>
              <option>25</option>
              <option>100</option>
            </select>
            <div>
              <button className="button">Einträge anzeigen</button>
              <input type="text" className="input" placeholder="Suchen" />
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>P</th>
                <th>Name</th>
                <th>Typ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="emptyState">
                  Keine Daten in der Tabelle vorhanden
                </td>
              </tr>
            </tbody>
          </table>
          <div className="pagination">
            <button className="button">Zurück</button>
            <button className="button">Nächste</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyStructure;
*/
