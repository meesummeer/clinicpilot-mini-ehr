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
    document.getElementById('details-modal').classList.add('hidden');

    fetch('patients.csv')
        .then(resp => resp.text())
        .then(data => {
            patients = parseCSV(data);
            filteredPatients = patients;
            renderTable(filteredPatients);
        });

    document.getElementById('search').addEventListener('input', filterTable);
    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);

    // Modal close events
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('details-modal');
        const closeBtn = document.getElementById('close-modal');
        // Close if click on × button
        if (event.target === closeBtn) closeModal();
        // Close if click outside modal-content when modal is open
        if (!modal.classList.contains('hidden') && event.target === modal) closeModal();
    });
};

function renderTable(data) {
    document.getElementById('details-modal').classList.add('hidden');
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
                <td><button onclick="showDetails(${idx})" style="background:#194972;color:#fff;padding:4px 10px;border:none;border-radius:3px;cursor:pointer;">Details</button></td>
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

function showDetails(idx) {
    const p = filteredPatients[idx];
    let html = `<h2>${p.full_name} <span style="font-size:14px;color:#888;">(ID: ${p.patient_id})</span></h2>
        <div><b>Age:</b> ${p.age} &nbsp; <b>Gender:</b> ${p.gender}</div>
        <div><b>Last Visit:</b> ${p.visit_date}</div>
        <div><b>Diagnosis:</b> ${p.diagnosis}</div>
        <div><b>Prescription:</b> ${p.prescription}</div>
        <div><b>Notes:</b> ${p.notes}</div>
        <div style="margin-top:8px;font-size:13px;color:#789;"><b>Last Updated:</b> ${p.last_updated}</div>
    `;
    document.getElementById('patient-details').innerHTML = html;
    document.getElementById('summary-box').innerHTML = "";
    document.getElementById('ai-summary-btn').onclick = function() {
        generateAISummary(p);
    };
    document.getElementById('details-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('details-modal').classList.add('hidden');
}

function generateAISummary(p) {
    document.getElementById('summary-box').innerHTML = 
        `<i>Generating summary...</i>`;
    setTimeout(() => {
        const summary = `Patient ${p.full_name} (${p.age}, ${p.gender}) visited on ${p.visit_date} with diagnosis "${p.diagnosis}". Current prescription: ${p.prescription}. Notes: ${p.notes}`;
        document.getElementById('summary-box').innerHTML = summary;
    }, 800);
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
