// Sample finance data
const financeData = {
    "Stocks": {
        "Tech": [
            { company: "TechCorp", price: 150.25, change: "+2.5%" },
            { company: "InnoSoft", price: 75.80, change: "-1.2%" }
        ],
        "Healthcare": [
            { company: "MediCare", price: 200.10, change: "+0.8%" },
            { company: "PharmaCo", price: 90.45, change: "+3.2%" }
        ]
    },
    "Bonds": {
        "Government": [
            { name: "US 10Y", yield: "1.5%", price: 98.5 },
            { name: "UK 5Y", yield: "0.75%", price: 99.2 }
        ],
        "Corporate": [
            { name: "TechCorp 2025", yield: "3.2%", price: 101.5 },
            { name: "PharmaCo 2030", yield: "2.8%", price: 100.8 }
        ]
    }
};

// Function to create the folder structure
function createFolderStructure() {
    const folderStructure = [
        {
            name: "Stocks",
            type: "folder",
            children: [
                { name: "Tech", type: "folder" },
                { name: "Healthcare", type: "folder" }
            ]
        },
        {
            name: "Bonds",
            type: "folder",
            children: [
                { name: "Government", type: "folder" },
                { name: "Corporate", type: "folder" }
            ]
        }
    ];

    const folderList = document.getElementById('folder-list');
    createFolderList(folderStructure, folderList);
}

function createFolderList(items, parentElement) {
    const ul = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        li.classList.add(item.type);
        
        if (item.type === 'folder') {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                li.classList.toggle('open');
                displayFinanceData(item.name);
            });

            if (item.children && item.children.length > 0) {
                createFolderList(item.children, li);
            }
        }
        
        ul.appendChild(li);
    });
    parentElement.appendChild(ul);
}

function displayFinanceData(folderName) {
    const contentTitle = document.getElementById('content-title');
    const financeDataElement = document.getElementById('finance-data');
    contentTitle.textContent = folderName;

    let data = financeData[folderName];
    if (!data) {
        // Check if it's a subfolder
        for (let category in financeData) {
            if (financeData[category][folderName]) {
                data = financeData[category][folderName];
                break;
            }
        }
    }

    if (data) {
        let tableHTML = '<table><tr><th>Name</th><th>Price/Yield</th><th>Change/Price</th></tr>';
        data.forEach(item => {
            tableHTML += `<tr>
                <td>${item.company || item.name}</td>
                <td>${item.price || item.yield}</td>
                <td>${item.change || item.price}</td>
            </tr>`;
        });
        tableHTML += '</table>';
        financeDataElement.innerHTML = tableHTML;
    } else {
        financeDataElement.innerHTML = '<p>No data available for this folder.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createFolderStructure();

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        alert('Logout clicked!');
        // Implement actual logout functionality here
    });
});
