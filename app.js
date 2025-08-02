// Utility: CSV to array of objects
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(row => {
        const values = row.split(',');
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : "");
        return obj;
    });
}

// Globals
let patients = [];
let filteredPatients = [];

// Fetch and display table on load
window.onload = function() {
    fetch('patients.csv')
        .then(resp => resp.text())
        .then(data => {
            patients = parseCSV(data);
            filteredPatients = patients;
            renderTable(filteredPatients);
        });

    document.getElementById('search').addEventListener('input', filterTable);
    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);

    // Modal logic
    document.getElementById('close-modal').onclick = closeModal;
    window.onclick = function(event) {
        let modal = document.getElementById('details-modal');
        if (event.target == modal) closeModal();
    };
};

fu
