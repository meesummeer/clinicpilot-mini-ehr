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

let patients = [];
let filteredPatients = [];

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
};

function renderTable(data) {
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Last Visit</th><th>Diagnosis</th><th></th></tr></thead><tbody>';
    if (data.length === 0) {
        html += '<tr><td colspan="7" style="text-align:center;color:#888;">No patients found.</td></tr>';
    } else {
        data.forEach((p, idx) => {
            html += `<tr>
                <td>${p.patient_id}</td>
                <td>${p.full_name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.visit_date}</td>
                <td>${p.diagnosis}</td>
                <td>
                  <button onclick="window.location.href='profile.html?pid=${p.patient_id}'"
                    style="background:#29a3f3;color:#fff;padding:4px 10px;border:none;border-radius:3px;cursor:pointer;">
                    Profile
                  </button>
                </td>
            </tr>`;
        });
    }
    html += '</tbody></table>';
    document.getElementById('patient-list').innerHTML = html;
}

function filterTable() {
    const q = document.getElementById('search').value.toLowerCase();
    filteredPatients = patients.filter(p =>
        p.full_name.toLowerCase().includes(q) ||
        p.patient_id.toString().includes(q)
    );
    renderTable(filteredPatients);
}

function downloadCSV() {
    let data = filteredPatients.length > 0 ? filteredPatients : patients;
    const header = Object.keys(data[0]);
    let csv = header.join(",") + "\n";
    data.forEach(row => {
        csv += header.map(h => `"${row[h] || ""}"`).join(",") + "\n";
    });
    const blob = new Blob([csv], {type: "text/csv"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.href = url;
    a.download = "clinicpilot_patients.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
