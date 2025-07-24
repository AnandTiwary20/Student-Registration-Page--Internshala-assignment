// DOM Elements
const form = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentTable tbody');
let students = JSON.parse(localStorage.getItem('students')) || [];
let editMode = false;
let editId = null;


document.addEventListener('DOMContentLoaded', () => {
    renderStudents();
    updateScrollbar();
});

// Form submission handler
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();
    
    // Validate inputs
    if (!validateInputs(name, studentId, email, contact)) {
        return;
    }
    
    const studentData = { name, studentId, email, contact };
    
    if (editMode) {
        // Update existing student
        const index = students.findIndex(s => s.studentId === editId);
        if (index !== -1) {
            students[index] = { ...studentData };
        }
        editMode = false;
        editId = null;
        document.querySelector('button[type="submit"]').textContent = 'Register';
    } else {
        // Add new student
        // Check if student ID already exists
        if (students.some(s => s.studentId === studentId)) {
            alert('Student ID already exists!');
            return;
        }
        students.push(studentData);
    }
    
 
    saveToLocalStorage();
    renderStudents();
    form.reset();
    updateScrollbar();
});

// Rendering  students to the table
function renderStudents() {
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">No students registered yet</td>';
        tableBody.appendChild(row);
        return;
    }
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${student.studentId}">Edit</button>
                <button class="delete-btn" data-id="${student.studentId}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

// Handle edit button click
function handleEdit(e) {
    const studentId = e.target.dataset.id;
    const student = students.find(s => s.studentId === studentId);
    
    if (student) {
        document.getElementById('name').value = student.name;
        document.getElementById('studentId').value = student.studentId;
        document.getElementById('email').value = student.email;
        document.getElementById('contact').value = student.contact;
        
        editMode = true;
        editId = studentId;
        document.querySelector('button[type="submit"]').textContent = 'Update';
        
        // Scroll to form
        document.getElementById('studentForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle delete button click
function handleDelete(e) {
    if (confirm('Are you sure you want to delete this student?')) {
        const studentId = e.target.dataset.id;
        students = students.filter(s => s.studentId !== studentId);
        saveToLocalStorage();
        renderStudents();
        updateScrollbar();
    }
}

// Save students array to localStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Input validation
function validateInputs(name, studentId, email, contact) {
    // Check for empty fields
    if (!name || !studentId || !email || !contact) {
        alert('All fields are required!');
        return false;
    }
    
    // Name validation (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.match(nameRegex)) {
        alert('Name can only contain letters and spaces');
        return false;
    }
    
    // Student ID validation (only numbers)
    if (!/^\d+$/.test(studentId)) {
        alert('Student ID must contain only numbers');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Contact validation (only numbers, 10 digits)
    if (!/^\d{10}$/.test(contact)) {
        alert('Contact number must be 10 digits');
        return false;
    }
    
    return true;
}

// Update scrollbar based on content
function updateScrollbar() {
    const tbody = document.querySelector('#studentTable tbody');
    if (students.length > 5) { // Show scrollbar if more than 5 rows
        tbody.style.maxHeight = '300px';
        tbody.style.overflowY = 'auto';
        tbody.style.display = 'block';
    } else {
        tbody.style.maxHeight = 'none';
        tbody.style.overflowY = 'visible';
    }
}