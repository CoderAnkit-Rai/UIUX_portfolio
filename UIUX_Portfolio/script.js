// Data storage
let patients = [];
let appointments = [];
let devices = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAlerts();
    smoothScroll();
    mobileMenu();
});

// Smooth scroll for navigation links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });
    });
}

// Mobile menu toggle
function mobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Add Patient
function addPatient() {
    const name = document.getElementById('patient-name').value.trim();
    const id = document.getElementById('patient-id').value.trim();
    
    if (!name || !id) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if patient ID already exists
    if (patients.some(p => p.id === id)) {
        alert('Patient ID already exists');
        return;
    }
    
    const patient = {
        id: id,
        name: name,
        dateAdded: new Date().toLocaleDateString()
    };
    
    patients.push(patient);
    updatePatientsList();
    clearPatientInputs();
}

// Remove Patient
function removePatient(id) {
    if (confirm('Are you sure you want to remove this patient?')) {
        patients = patients.filter(p => p.id !== id);
        // Also remove related appointments
        appointments = appointments.filter(a => a.patientId !== id);
        updatePatientsList();
        updateAppointmentsList();
        updateAlerts();
    }
}

// Update Patients List
function updatePatientsList() {
    const list = document.getElementById('patients-list');
    if (patients.length === 0) {
        list.innerHTML = '<p class="no-alerts">No patients added yet</p>';
        return;
    }
    
    list.innerHTML = patients.map(patient => `
        <div class="data-item">
            <div class="data-item-info">
                <strong>${patient.name}</strong><br>
                <small>ID: ${patient.id} | Added: ${patient.dateAdded}</small>
            </div>
            <button class="btn btn-danger" onclick="removePatient('${patient.id}')">Remove</button>
        </div>
    `).join('');
}

// Add Appointment
function addAppointment() {
    const patientId = document.getElementById('appointment-patient').value.trim();
    const date = document.getElementById('appointment-date').value;
    const doctor = document.getElementById('appointment-doctor').value.trim();
    
    if (!patientId || !date || !doctor) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if patient exists
    if (!patients.some(p => p.id === patientId)) {
        alert('Patient ID not found. Please add the patient first.');
        return;
    }
    
    const appointment = {
        id: Date.now().toString(),
        patientId: patientId,
        patientName: patients.find(p => p.id === patientId).name,
        date: new Date(date).toLocaleString(),
        doctor: doctor,
        dateAdded: new Date().toLocaleDateString()
    };
    
    appointments.push(appointment);
    updateAppointmentsList();
    clearAppointmentInputs();
}

// Remove Appointment
function removeAppointment(id) {
    if (confirm('Are you sure you want to remove this appointment?')) {
        appointments = appointments.filter(a => a.id !== id);
        updateAppointmentsList();
        updateAlerts();
    }
}

// Update Appointments List
function updateAppointmentsList() {
    const list = document.getElementById('appointments-list');
    if (appointments.length === 0) {
        list.innerHTML = '<p class="no-alerts">No appointments scheduled</p>';
        return;
    }
    
    list.innerHTML = appointments.map(appointment => `
        <div class="data-item">
            <div class="data-item-info">
                <strong>${appointment.patientName}</strong><br>
                <small>Patient ID: ${appointment.patientId} | Doctor: ${appointment.doctor}<br>
                Date: ${appointment.date}</small>
            </div>
            <button class="btn btn-danger" onclick="removeAppointment('${appointment.id}')">Remove</button>
        </div>
    `).join('');
}

// Add Device
function addDevice() {
    const name = document.getElementById('device-name').value.trim();
    const id = document.getElementById('device-id').value.trim();
    const status = document.getElementById('device-status').value;
    
    if (!name || !id) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if device ID already exists
    if (devices.some(d => d.id === id)) {
        alert('Device ID already exists');
        return;
    }
    
    const device = {
        id: id,
        name: name,
        status: status,
        dateAdded: new Date().toLocaleDateString()
    };
    
    devices.push(device);
    updateDevicesList();
    updateAlerts();
    clearDeviceInputs();
}

// Remove Device
function removeDevice(id) {
    if (confirm('Are you sure you want to remove this device?')) {
        devices = devices.filter(d => d.id !== id);
        updateDevicesList();
        updateAlerts();
    }
}

// Update Devices List
function updateDevicesList() {
    const list = document.getElementById('devices-list');
    if (devices.length === 0) {
        list.innerHTML = '<p class="no-alerts">No devices added yet</p>';
        return;
    }
    
    list.innerHTML = devices.map(device => `
        <div class="data-item" style="border-left-color: ${device.status === 'functional' ? '#10b981' : '#ef4444'}">
            <div class="data-item-info">
                <strong>${device.name}</strong><br>
                <small>ID: ${device.id} | Status: <span style="color: ${device.status === 'functional' ? '#10b981' : '#ef4444'}; font-weight: 600;">${device.status === 'functional' ? 'Functional' : 'Non-Functional'}</span><br>
                Added: ${device.dateAdded}</small>
            </div>
            <button class="btn btn-danger" onclick="removeDevice('${device.id}')">Remove</button>
        </div>
    `).join('');
}

// Update Alerts
function updateAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    const nonFunctionalDevices = devices.filter(d => d.status === 'non-functional');
    
    if (nonFunctionalDevices.length === 0) {
        alertsContainer.innerHTML = '<p class="no-alerts">No alerts at the moment. All systems operational.</p>';
        return;
    }
    
    alertsContainer.innerHTML = nonFunctionalDevices.map(device => `
        <div class="alert-item">
            <div>
                <strong>⚠️ Device Alert: ${device.name}</strong><br>
                <small>Device ID: ${device.id} | Status: Non-Functional</small>
            </div>
            <button class="btn btn-danger" onclick="removeDevice('${device.id}')">Remove</button>
        </div>
    `).join('');
}

// Clear Input Functions
function clearPatientInputs() {
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-id').value = '';
}

function clearAppointmentInputs() {
    document.getElementById('appointment-patient').value = '';
    document.getElementById('appointment-date').value = '';
    document.getElementById('appointment-doctor').value = '';
}

function clearDeviceInputs() {
    document.getElementById('device-name').value = '';
    document.getElementById('device-id').value = '';
    document.getElementById('device-status').value = 'functional';
}

// Tab Switching for Wireframes
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

