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
let currentPatient = null;

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
