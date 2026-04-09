// Store data
let currentUser = null;

// Example data array (initial dummy data)
const submissions = [
  { title: 'Task 1', description: 'Description 1', date: '2024-04-27', status: 'pending' },
  { title: 'Task 2', description: 'Description 2', date: '2024-04-26', status: 'submitted' },
];

// Helper function to show pages
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
  if (pageId === 'dashboard') {
    loadSubmissions();
  }
}

// Registration
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[email]) {
    alert('User already exists!');
    return;
  }

  users[email] = { name, email, password };
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  showPage('login');
  document.getElementById('registerForm').reset();
});

// Toggle show password for registration
document.getElementById('showRegPassword').addEventListener('change', function() {
  const passwordInput = document.getElementById('regPassword');
  passwordInput.type = this.checked ? 'text' : 'password';
});


// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[email] && users[email].password === password) {
    currentUser = users[email];
    alert(`Welcome, ${currentUser.name}`);
    showPage('dashboard');
    loadSubmissions();
  } else {
    alert('Invalid credentials!');
  }
});

// Toggle show password for login
document.getElementById('showLoginPassword').addEventListener('change', function() {
  const passwordInput = document.getElementById('loginPassword');
  passwordInput.type = this.checked ? 'text' : 'password';
});

// Logout
function logout() {
  currentUser = null;
  showPage('login');
}

// Load submissions with statuses and delete buttons
function loadSubmissions() {
  const storedData = JSON.parse(localStorage.getItem('submissions')) || {};
  const userSubmissions = storedData[currentUser.email] || [];

  const tbody = document.querySelector('#submissionsTable tbody');
  tbody.innerHTML = '';

  userSubmissions.forEach((sub, index) => {
    const row = document.createElement('tr');

    // Title
    row.innerHTML += `<td>${sub.title}</td>`;
    // Description
    row.innerHTML += `<td>${sub.description}</td>`;
    // Date
    row.innerHTML += `<td>${sub.date}</td>`;
   // Status badge
const statusClass = 'status-submitted'; // Always use 'submitted' style
const statusText = 'Submitted'; // Always display 'Submitted'
const statusHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
row.innerHTML += `<td>${statusHTML}</td>`;
    // Actions: delete button
    row.innerHTML += `
      <td class="action-cell">
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Attach delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-index'));
      deleteSubmission(idx);
    });
  });
}

// Delete a submission
function deleteSubmission(index) {
  const storedData = JSON.parse(localStorage.getItem('submissions')) || {};
  const userSubmissions = storedData[currentUser.email] || [];
  userSubmissions.splice(index, 1);
  if (userSubmissions.length > 0) {
    storedData[currentUser.email] = userSubmissions;
  } else {
    delete storedData[currentUser.email];
  }
  localStorage.setItem('submissions', JSON.stringify(storedData));
  loadSubmissions();
}

// Submit a new task/project
document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const date = new Date().toLocaleString();

  const storedData = JSON.parse(localStorage.getItem('submissions')) || {};
  if (!storedData[currentUser.email]) {
    storedData[currentUser.email] = [];
  }
  // Add new task with default 'pending' status
  storedData[currentUser.email].push({ title, description, date, status: 'pending' });
  localStorage.setItem('submissions', JSON.stringify(storedData));
  alert('Task submitted successfully!');
  document.getElementById('taskForm').reset();
  showPage('dashboard');
  loadSubmissions();
});

// Change status dynamically
function changeStatus(index, newStatus) {
  const storedData = JSON.parse(localStorage.getItem('submissions')) || {};
  const userData = storedData[currentUser.email] || [];
  if (userData[index]) {
    userData[index].status = newStatus;
    storedData[currentUser.email] = userData;
    localStorage.setItem('submissions', JSON.stringify(storedData));
    loadSubmissions();
  }
}

// Show login page by default
showPage('login');