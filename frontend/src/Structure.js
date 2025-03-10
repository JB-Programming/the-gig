import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CompanyStructure.module.css';

const Structure = ({ setIsLoggedIn }) => {

  /*
  const [entities] = useState([
    { id: 29672, type: 'Person', name: 'N.N.', vorname: '', standort: '', bemerkung: '' },
    { id: 30073, type: 'Person', name: 'N.N. Verkauf', vorname: '', standort: '', bemerkung: '' },
    { id: 29864, type: 'Person', name: 'Planstelle Lager', vorname: 'N.N.', standort: '', bemerkung: '' },
  ]);
  */
  const [treeData, setTreeData] = useState([]);  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // Loading state

  // Replace the existing entities useState with:
  const [entities, setEntities] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [selectedEntity, setSelectedEntity] = useState(null);
  // Add near other useState declarations
  const [showNewModal, setShowNewModal] = useState(false);

  const extractUniqueObjects = (data) => {
    const uniqueObjects = new Map();
  
    const processNode = (node) => {
      // Add current node if not already present
      if (!uniqueObjects.has(node.struktur_id)) {
        uniqueObjects.set(node.struktur_id, node);
      }
  
      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => processNode(child));
      }
    };
  
    // Process each root node
    data.forEach(node => processNode(node));
  
    // Convert Map to array
    return Array.from(uniqueObjects.values());
  };


  const fetchTreeData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get_structure/');
      var data = response.data;
      data = extractUniqueObjects(data);
      console.log(data);
      const uniqueEntries = new Map();
      
      data.forEach(item => {
        // Create composite key from all relevant IDs
        console.log(typeof item.parent)
        console.log(item.parent)

        const idKey = [
          `p${item.primär_id}`,
          `o${item.ordner_id}`,
          `t${item.team_id}`,
          `m${item.mitarbeiter_id}`
        ].filter(id => id.slice(1) !== 'null').join('_');
        
        if (idKey && !uniqueEntries.has(idKey)) {
          uniqueEntries.set(idKey, {
            id: item.struktur_id,
            type: item.team_id ? 'Team' : 
                  item.mitarbeiter_id ? 'Person' : 
                  item.ordner_id ? 'Ordner' : 
                  item.primär_id ? 'Primär' : 'Andere',
            type_id: item.team_id || item.mitarbeiter_id || item.ordner_id || item.primär_id,
            name: item.name.includes(',') ? item.name.split(', ')[1] : item.name,
            vorname: item.name.includes(',') ? item.name.split(', ')[0] : '',
            standort: '',
            bemerkung: '' //`Parent: ${item.parent || 'None'}`
          });
        }
      });
      console.log([...uniqueEntries.values()])
      setEntities([...uniqueEntries.values()]);
      setTreeData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch structure:', error);
      setLoading(false);
      setSelectedItems([]);
    }
  };

  // Update the useEffect to process the fetched data:
  useEffect(() => {  
    fetchTreeData();
  }, []);

  useEffect(() => {
    if (showNewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNewModal]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
      typ: e.target.elements.typ.value,
      vorname: e.target.elements.vorname.value,
      name: e.target.elements.name.value,
      standort: e.target.elements.standort.value,
      bemerkung: e.target.elements.bemerkung.value
    };
    try {
      const response = await axios.post('http://localhost:8000/api/add_instance/', data, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Success:', response.data);
      e.target.reset();
      setShowNewModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
};

  

  // Add the click handler
const handleNewClick = () => {
  setShowNewModal(true);
  console.log('New button clicked');
};

  const handleRowClick = (entity) => {
    fetchTreeData()
    var relatedItems = [];
    let preCheckedItems;
    let parentIds;

    setSelectedEntity(entity);

    /*/ Get the parent IDs from a set of objects 
    const getParentIds = (items) => {
      items.map(item => console.log(item.parent))
      return items.map(item => item.parent); // [14, 26, 27, 3]
      
    };*/
    const getParentIds = (items) => {
      console.log(items[0].parent)
      return items[0].parent ? items[0].parent : []; // [14, 26, 27, 3]
      
    };
    switch(entity.type) {
      case 'Team':
        // Find all items with matching team_id
        relatedItems = treeData.filter(item => 
          item.ordner_id !== null || item.primär_id !== null
          //item.team_id !== null 
        );
        preCheckedItems = treeData.filter(item => 
          item.team_id === entity.type_id 
          //item.team_id !== null 
        );
        console.log(preCheckedItems);
        parentIds = getParentIds(preCheckedItems);

        break;
        
      case 'Person':
        // Find all items with matching mitarbeiter_id
        relatedItems = treeData.filter(item => 
          item.ordner_id !== null || item.team_id !== null
          //item.mitarbeiter_id !== null
        );
        preCheckedItems = treeData.filter(item => 
          item.mitarbeiter_id === entity.type_id 
          //item.team_id !== null
        );

        parentIds = getParentIds(preCheckedItems);

        break;
        
      case 'Ordner':
        // Find all items with matching ordner_id
        relatedItems = treeData.filter(item => 
          item.ordner_id !== null
        );

        preCheckedItems = treeData.filter(item => 
          item.ordner_id === entity.type_id 
          //item.team_id !== null 
        );

        parentIds = getParentIds(preCheckedItems);
        break;
        
      case 'Primär':
        // Find all items with matching primär_id
        relatedItems = treeData.filter(item => 
          item.ordner_id !== null && entity.ordner_id !== null
          //item.primär_id !== null 
        );

        preCheckedItems = treeData.filter(item => 
          item.primär_id === entity.type_id 
          //item.team_id !== null 
        );

        parentIds = getParentIds(preCheckedItems);
        break;
    }
  
    // Transform the filtered items for display
    const transformedItems = relatedItems.map(item => ({
      name: item.name,
      type: item.team_id ? 'Team' : 
            item.mitarbeiter_id ? 'Person' : 
            item.ordner_id ? 'Ordner' : 'Primär',
      type_id:   item.team_id || item.mitarbeiter_id || item.ordner_id || item.primär_id,
      id: item.struktur_id,
    }));
    
    // Create initial checked state based on preCheckedIds
    const initialCheckedState = transformedItems.reduce((acc, item, index) => {
      acc[index] = parentIds.includes(item.id);
      return acc;
    }, {});

    
    setCheckedItems(initialCheckedState);
    setSelectedItems(transformedItems);
  };

  const handleCheckbox = async (item, index, entity) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { 
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    };
  
    const isChecked = checkedItems[index];
    
    try {
      if (isChecked) {
        console.log(item);
        console.log(selectedItems)
        console.log('delete', entity.id, item.id);

      } else {
        console.log('create', entity, item.id)
      } 
      console.log(isChecked ? 'delete' : 'create', entity, item.id)
      const response = await axios.post('http://localhost:8000/api/relation/', {
        action: isChecked ? 'delete' : 'create',
        entity: entity,
        parent: item.id
      }, config);
  
      if (response.data.success) {
        setCheckedItems(prev => ({
          ...prev,
          [index]: !prev[index]
        }));
        /*
      } else {
        console.error('Operation failed:', response.data.error);
      }*/
      }
    } catch (error) {
      console.error('Error managing structure:', error.response?.data?.error || error.message);
    }
  };
  

  // Display a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unternehmensstruktur</h1>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardSubtitle}>ANLEGEN UND ÄNDERN</div>
          <h2 className={styles.cardTitle}>Alle Entitäten</h2>
          <div className={styles.controls}>
             
            <div>
              {/*
              <select className={styles.select}>
                <option>Show 25 rows</option>
                <option>Show 50 rows</option>
                <option>Show 100 rows</option>
              </select>
              */}
                <button className={styles.button} onClick={handleNewClick}>New</button>
                {/* <button className={styles.button}>Edit</button> */}
                <button className={styles.button} onClick={fetchTreeData}>Baum aktualisieren</button>
              
            </div>
            {/*<input type="text" className={styles.input} placeholder="Suchen" /> */}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                {/*<th>ID</th>*/}
                <th>Typ</th>
                <th>Vorname</th>
                <th>Name</th>
                <th>Standort</th>
                <th>Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              {entities
                .sort((a, b) => {
                  const typeOrder = {
                    'Ordner': 1,
                    'Primär': 2,
                    'Team': 3,
                    'Person': 4
                  };
                  return typeOrder[a.type] - typeOrder[b.type];
                })
              .map((entity) => (
                <tr 
                key={entity.id} 
                onClick={() => handleRowClick(entity)}
                style={{ cursor: 'pointer' }}
                className={styles.tableRow}
              >
                  {/*<td>{entity.id}</td>*/}
                  <td>{entity.type}</td>
                  <td>{entity.vorname}</td>
                  <td>{entity.name}</td>
                  <td>{entity.standort}</td>
                  <td>{entity.bemerkung}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/*
          <div className={styles.pagination}>
            <button className={styles.button}>Zurück</button>
            <button className={styles.button}>1</button>
            <button className={styles.button}>Nächste</button>
          </div>
          */}
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardSubtitle}>ÜBERGEORDNETE OBJEKTE</div>
          <h2 className={styles.cardTitle}>Teams und Gruppen</h2>
          <div className={styles.controls}>
            {/* 
            <select className={styles.select}>
              <option>Show 50 rows</option>
              <option>Show 25 rows</option>
              <option>Show 100 rows</option>
            </select>
            */}
            <div>
              {/* <input type="text" className={styles.input} placeholder="Suchen" /> */}
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Typ</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={checkedItems[index] || false}
                        onChange={() => handleCheckbox(item, index, selectedEntity)}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>
                    Keine Daten in der Tabelle vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 
          <div className={styles.pagination}>
            <button className={styles.button}>Zurück</button>
            <button className={styles.button}>Nächste</button>
          </div>
          */}
        </div>
      </div>

{showNewModal && (
  <>
    <div className={styles.overlay} onClick={() => setShowNewModal(false)} />
    <div className={styles.modal}>
      <h2>Create New Entry</h2>
      <form className={styles.modalForm} onSubmit={handleSave}>
        <select name="typ" className={styles.select}>
          <option value="">Select Type</option>
          <option value="Team">Team</option>
          <option value="Person">Person</option>
          <option value="Ordner">Ordner</option>
          <option value="Primär">Primär</option>
        </select>
        <input type="text" name="vorname" placeholder="Vorname" />
        <input type="text" name="name" placeholder="Name" />
        <input type="text" name="standort" placeholder="Standort" />
        <input type="text" name="bemerkung" placeholder="Bemerkung" />
        <div className={styles.modalButtons}>
          <button 
            className={styles.button} 
            onClick={() => setShowNewModal(false)}
            type="button"
          >
            Cancel
          </button>
          <button 
            className={styles.button} 
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </>
)}
    </div>
  );


  /*
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userData && (
        <div>
          <p>Welcome, {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );*/
};

export default Structure;