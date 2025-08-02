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

let patients = [];
let filteredPatients = [];
let currentPatientIdx = null;

// Demo data for profile tabs
const demoMeds = [
    "Paracetamol", "Ibuprofen", "Aspirin", "Amoxicillin", "Metformin", "Lisinopril", "Antibiotics", "Antihistamine", "Vitamin D"
];
const demoNotes = [
    "Patient responded well to treatment.",
    "Monitor blood pressure for 2 weeks.",
    "Recommended lifestyle changes discussed.",
    "Follow-up scheduled for next month.",
    "Patient is allergic to penicillin.",
    "Stable with current meds, continue same dose."
];
const demoHistory = [
    { diagnosis: "Flu", date: "2024-01-11" },
    { diagnosis: "Dental Caries", date: "2024-04-03" },
    { diagnosis: "Hypertension", date: "2024-02-27" },
    { diagnosis: "Diabetes", date: "2024-03-14" }
];
const demoXrays = [
    "https://images.unsplash.com/photo-1512069772995-ec65ed27b1d4?w=400&q=80",
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80"
];

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

    // Modal close (X button or click outside modal-content)
    document.getElementById('details-modal').addEventListener('click', function(event) {
        if (event.target.id === 'details-modal' || event.target.id === 'close-modal') {
            closeModal();
        }
    });

    // Tabs click
    document.getElementById('profile-tabs').addEventListener('click', function(event) {
        if (!event.target.classList.contains('tab')) return;
        if (currentPatientIdx === null) return;
        // Set active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        showTab(event.target.dataset.tab);
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
                <td><button class="details-btn" data-idx="${idx}" style="background:#29a3f3;color:#fff;padding:4px 10px;border:none;border-radius:3px;cursor:pointer;">Profile</button></td>
            </tr>`;
        });
    }
    html += '</tbody></table>';
    document.getElementById('patient-list').innerHTML = html;

    // Attach event listeners to each "Profile" button
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = Number(this.getAttribute('data-idx'));
            openProfileModal(idx);
        });
    });
}

function filterTable() {
    const q = document.getElementById('search').value.toLowerCase();
    filteredPatients = patients.filter(p =>
        p.full_name.toLowerCase().includes(q) ||
        p.patient_id.toString().includes(q)
    );
    renderTable(filteredPatients);
}

function openProfileModal(idx) {
    currentPatientIdx = idx;
    // Always activate Profile tab by default
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector('.tab[data-tab="profile"]').classList.add('active');
    showTab('profile');
    document.getElementById('details-modal').classList.remove('hidden');
}

function showTab(tab) {
    if (currentPatientIdx === null) return;
    const p = filteredPatients[currentPatientIdx];
    let html = '';
    if (tab === 'profile') {
        html = `<h2>${p.full_name} <span style="font-size:14px;color:#778;">(ID: ${p.patient_id})</span></h2>
        <div><b>Age:</b> ${p.age} &nbsp; <b>Gender:</b> ${p.gender}</div>
        <div><b>Allergies:</b> ${Math.random() > 0.7 ? "Penicillin" : "None reported"}</div>
        <div style="margin:10px 0;"><b>Last Visit:</b> ${p.visit_date}</div>
        <div><b>Diagnosis:</b> ${p.diagnosis}</div>
        <div><b>Prescription:</b> ${p.prescription}</div>
        <div><b>Notes:</b> ${p.notes}</div>
        <div style="margin-top:8px;font-size:13px;color:#789;"><b>Last Updated:</b> ${p.last_updated}</div>`;
    }
    if (tab === 'medications') {
        let meds = [];
        for (let i=0; i<3; i++) meds.push(demoMeds[Math.floor(Math.random()*demoMeds.length)]);
        html = `<h3>Medications</h3><ul>${meds.map(m=>`<li>${m}</li>`).join('')}</ul>`;
    }
    if (tab === 'history') {
        html = `<h3>Visit History</h3><ul>${
            demoHistory
                .sort(()=>Math.random()-0.5)
                .slice(0,2+Math.floor(Math.random()*2))
                .map(h=>`<li>${h.date} – <b>${h.diagnosis}</b></li>`).join('')
        }</ul>`;
    }
    if (tab === 'notes') {
        let n = [];
        for (let i=0; i<2+Math.floor(Math.random()*2); i++) n.push(demoNotes[Math.floor(Math.random()*demoNotes.length)]);
        html = `<h3>Doctor Notes</h3><ul>${n.map(note=>`<li>${note}</li>`).join('')}</ul>`;
    }
    if (tab === 'xrays') {
        let xrays = [];
        for (let i=0; i<2+Math.floor(Math.random()*2); i++) xrays.push(demoXrays[Math.floor(Math.random()*demoXrays.length)]);
        html = `<h3>X-ray Images</h3>
            <div class="xray-gallery">
            ${xrays.map(url=>`<img class="xray-img" src="${url}" alt="X-ray">`).join('')}
            </div>`;
    }
    document.getElementById('profile-content').innerHTML = html;
}

function closeModal() {
    document.getElementById('details-modal').classList.add('hidden');
    currentPatientIdx = null;
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
