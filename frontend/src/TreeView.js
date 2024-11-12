import React, { useState, useEffect } from 'react';
//import { ChevronRight } from 'lucide-react';

const TreeView = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreeData();
  }, []);

  const fetchTreeData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/structure/');
      console.log(response)
      const data = await response.json();
      setTreeData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch structure:', error);
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    // Determine if node looks like a database entry
    const isDatabase = node.name.toLowerCase().includes('db');
    
    // Choose icon based on node characteristics
    let icon = '📁'; // Default folder icon
    if (level === 0) icon = '👥'; // Company/top level icon
    if (isDatabase) icon = '💾'; // Database icon
    if (!hasChildren && level > 1) icon = '👤'; // Person icon

    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            "abc"
            /*<ChevronRight 
              className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />*/
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="ml-1">{icon}</span>
          <span 
            className={`ml-2 ${!hasChildren && level > 1 ? 'text-blue-600 hover:underline' : ''}`}
            onClick={(e) => {
              if (!hasChildren && level > 1) {
                e.stopPropagation();
                // Handle person click
                console.log('Clicked:', node.name);
              }
            }}
          >
            {node.name}
          </span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="p-4 border-b">
        <h2 className="text-gray-600 uppercase text-sm">MANDANT</h2>
        <h1 className="text-xl font-semibold">Hillmann & Geitz</h1>
      </div>
      <div className="p-2">
        {treeData.map(node => renderNode(node))}
      </div>
    </div>
  );
};

export default TreeView;