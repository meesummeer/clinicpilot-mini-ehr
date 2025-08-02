// Demo data
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

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch patients.csv and load profile
window.onload = function() {
    const pid = getQueryParam('pid');
    if (!pid) {
        document.getElementById('profile-container').innerHTML = "<div style='color:#c44;font-size:20px;'>No patient selected.</div>";
        return;
    }
    fetch('patients.csv')
        .then(resp => resp.text())
        .then(data => {
            const lines = data.trim().split('\n');
            const headers = lines[0].split(',');
            const patient = lines.slice(1)
                .map(row => {
                    const values = row.split(',');
                    let obj = {};
                    headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : "");
                    return obj;
                })
                .find(p => p.patient_id === pid);
            if (!patient) {
                document.getElementById('profile-container').innerHTML = "<div style='color:#c44;font-size:20px;'>Patient not found.</div>";
                return;
            }
            renderProfile(patient);
        });
};

function renderProfile(p) {
    // Tabs
    const tabs = ['Profile', 'Medications', 'History', 'Doctor Notes', 'X-rays'];
    let html = `<div id="profile-tabs" style="margin-bottom:20px;">`;
    tabs.forEach((tab, i) => {
        html += `<button class="tab${i===0 ? ' active' : ''}" data-tab="${tab.toLowerCase().replace(' ', '')}">${tab}</button>`;
    });
    html += `</div><div id="profile-content"></div>`;

    document.getElementById('profile-container').innerHTML = html;
    showTab('profile', p);

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            showTab(this.dataset.tab, p);
        });
    });
}

function showTab(tab, p) {
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
    if (tab === 'doctornotes') {
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
