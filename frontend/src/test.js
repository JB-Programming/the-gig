import React, { useState, useEffect } from 'react';
import axios from 'axios';
const CompanyStructurePage = () => {
  const [treeData, setTreeData] = useState([]);  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // Loading state

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/structure/');
        const data = response.data;
        setTreeData(data);         // Store the fetched data in state
        console.log(data);
        setLoading(false);         // Set loading to false once data is fetched
      } catch (error) {
        console.error('Failed to fetch structure:', error);
        setLoading(false);
      }
    };

    fetchTreeData();
  }, []);  // Empty dependency array ensures this runs only once on mount

  // Display a loading message while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Function to handle toggling the visibility of children
  const handleToggle = (id, tree) => {
    return tree.map(item => {
      if (item.struktur_id === id) {
        // Toggle the "expanded" state for the clicked item
        return { ...item, expanded: !item.expanded };
      }

      // Recursively update children if they exist
      if (item.children && item.children.length > 0) {
        return { ...item, children: handleToggle(id, item.children) };
      }

      return item;
    });
  };

  // Function to render the tree structure recursively
  const renderTree = (data) => {
    return (
      <ul>
        {data.map((item) => (
          <li key={item.struktur_id}>
            <div>
              <p
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => {
                  // Handle toggle on click and update treeData state
                  setTreeData(prevData => handleToggle(item.struktur_id, prevData));
                }}
              >
                {item.name} {/* Show the name */}
              </p>

              {/* If the item has children and it's expanded, show the children */}
              {item.expanded && item.children && item.children.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  {renderTree(item.children)} {/* Recursively render children */}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Structure Data</h1>

      {/* Render the tree with initial state */}
      <h2>Data Structure</h2>
      <div>{renderTree(treeData)}</div>
    </div>
    

  );
};

export default CompanyStructurePage;