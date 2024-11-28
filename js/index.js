// Sample JSON structure for folders
const folderStructure = [
    {
        name: "Folder 1",
        subfolders: [
            { name: "Subfolder 1.1" },
            { name: "Subfolder 1.2" }
        ]
    },
    {
        name: "Folder 2",
        subfolders: [
            { name: "Subfolder 2.1" },
            { name: "Subfolder 2.2" }
        ]
    }
];

function createFolderList(folders, parentElement) {
    const ul = document.createElement('ul');
    folders.forEach(folder => {
        const li = document.createElement('li');
        li.textContent = folder.name;
        if (folder.subfolders && folder.subfolders.length > 0) {
            createFolderList(folder.subfolders, li);
        }
        ul.appendChild(li);
    });
    parentElement.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', () => {
    const folderList = document.getElementById('folder-list');
    createFolderList(folderStructure, folderList);

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        alert('Logout clicked!');
        // Implement actual logout functionality here
    });
});
