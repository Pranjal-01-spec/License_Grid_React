// ==================== 1. GLOBAL STATE & DATABASE ====================
let isSignUp = false;

let toolsDatabase = [
  { 
    id: 1, 
    name: "Figma", 
    category: "Design", 
    monthlyCost: 450, 
    totalSeats: 30, 
    assignedSeats: 2,
    status: "Active",
    assignments: [
      { id: 101, name: "Aarav Sharma", department: "UI/UX Design" },
      { id: 102, name: "Sneha Patel", department: "Product Team" }
    ]
  },
  { 
    id: 2, 
    name: "GitHub Enterprise", 
    category: "Developer Tools", 
    monthlyCost: 840, 
    totalSeats: 40, 
    assignedSeats: 2,
    status: "Active",
    assignments: [
      { id: 103, name: "Rohan Verma", department: "Backend Core" },
      { id: 104, name: "Ananya Iyer", department: "DevOps" }
    ]
  },
  { 
    id: 3, 
    name: "Zoom Pro", 
    category: "Communication", 
    monthlyCost: 200, 
    totalSeats: 15, 
    assignedSeats: 1,
    status: "Active",
    assignments: [
      { id: 105, name: "Kunal Gupta", department: "Human Resources" }
    ]
  }
];

// ==================== 2. DOM REFERENCES ====================
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');

const authForm = document.getElementById('auth-form');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('submit-btn');
const toggleBtn = document.getElementById('toggle-btn');
const toggleText = document.getElementById('toggle-text');
const formSubtitle = document.getElementById('form-subtitle');
const errorMsg = document.getElementById('error-message');
const userDisplayName = document.getElementById('user-display-name');
const logoutBtn = document.getElementById('logout-btn');

const gridContainer = document.getElementById('inventory-grid');
const addToolBtn = document.getElementById('add-tool-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalOverlay = document.getElementById('modal-overlay');
const addSoftwareForm = document.getElementById('add-software-form');

const editModalOverlay = document.getElementById('edit-modal-overlay');
const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
const editSoftwareForm = document.getElementById('edit-software-form');
const deleteToolBtn = document.getElementById('delete-tool-btn');

const assignModalOverlay = document.getElementById('assign-modal-overlay');
const closeAssignModalBtn = document.getElementById('close-assign-modal-btn');
const assignEmployeeForm = document.getElementById('assign-employee-form');
const assignedEmployeesList = document.getElementById('assigned-employees-list');
const assignModalTitle = document.getElementById('assign-modal-title');

const totalMonthlySpendEl = document.getElementById('total-monthly-spend');
const totalAnnualSpendEl = document.getElementById('total-annual-spend');
const totalActiveToolsEl = document.getElementById('total-active-tools');

// ==================== 3. AUTHENTICATION LOGIC ====================
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('licenseGridUser'));

  if (currentUser && currentUser.isLoggedIn) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (userDisplayName) userDisplayName.textContent = `👤 ${currentUser.name}`;
  } else {
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
  }
  renderInventory(toolsDatabase);
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    if (errorMsg) errorMsg.style.display = 'none';

    if (isSignUp) {
      if (nameGroup) nameGroup.style.display = 'flex';
      if (submitBtn) submitBtn.textContent = 'Create Account';
      if (toggleText) toggleText.textContent = 'Already have an account?';
      if (toggleBtn) toggleBtn.textContent = 'Sign In';
      if (formSubtitle) formSubtitle.textContent = 'Sign up to manage company licenses.';
    } else {
      if (nameGroup) nameGroup.style.display = 'none';
      if (submitBtn) submitBtn.textContent = 'Sign In';
      if (toggleText) toggleText.textContent = "Don't have an account?";
      if (toggleBtn) toggleBtn.textContent = 'Sign Up';
      if (formSubtitle) formSubtitle.textContent = 'Software license and seat allocation manager.';
    }
  });
}

if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email')?.value.trim();
    const password = document.getElementById('user-password')?.value.trim();
    const name = document.getElementById('user-name')?.value.trim();

    if (!email || !password || (isSignUp && !name)) {
      if (errorMsg) {
        errorMsg.textContent = 'Please fill in all required fields.';
        errorMsg.style.display = 'block';
      }
      return;
    }

    const userData = {
      email: email,
      name: isSignUp ? name : email.split('@')[0],
      isLoggedIn: true
    };

    localStorage.setItem('licenseGridUser', JSON.stringify(userData));
    checkAuth();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('licenseGridUser');
    checkAuth();
  });
}

// ==================== 4. ANALYTICS & RENDERING ====================
function updateFinancialAnalytics(tools) {
  const totalMonthly = tools.reduce((acc, tool) => acc + Number(tool.monthlyCost || 0), 0);
  const totalAnnual = totalMonthly * 12;

  if (totalMonthlySpendEl) totalMonthlySpendEl.textContent = `$${totalMonthly.toLocaleString()}`;
  if (totalAnnualSpendEl) totalAnnualSpendEl.textContent = `$${totalAnnual.toLocaleString()}`;
  if (totalActiveToolsEl) totalActiveToolsEl.textContent = tools.length;
}

function renderInventory(tools) {
  if (!gridContainer) return;
  gridContainer.innerHTML = ''; 

  tools.forEach(tool => {
    const assignedCount = tool.assignedSeats !== undefined 
      ? tool.assignedSeats 
      : (tool.assignments ? tool.assignments.length : 0);

    const cardHTML = `
      <div class="tool-card" data-id="${tool.id}">
        <div class="card-header">
          <h2 class="tool-name">${tool.name}</h2>
          <span class="category-badge">${tool.category}</span>
        </div>
        
        <div class="card-body">
          <div class="data-row">
            <span class="data-label">Monthly Cost:</span>
            <span class="data-value">$${tool.monthlyCost}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Annual Cost:</span>
            <span class="data-value">$${tool.monthlyCost * 12}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Seat Usage:</span>
            <span class="data-value">${assignedCount} / ${tool.totalSeats}</span>
          </div>
        </div>

        <div class="card-footer">
          <span class="status-active">${tool.status || 'Active'}</span>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-seats" onclick="openAssignModal(${tool.id})">👥 Seats</button>
            <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openManageModal(${tool.id})">Manage</button>
          </div>
        </div>
      </div>
    `;
    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
  });

  updateFinancialAnalytics(tools);
}

// ==================== 5. ADD & MANAGE MODALS ====================
if (addToolBtn && modalOverlay) {
  addToolBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
}
if (closeModalBtn && modalOverlay) {
  closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
}
if (closeEditModalBtn && editModalOverlay) {
  closeEditModalBtn.addEventListener('click', () => editModalOverlay.classList.remove('active'));
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });
}
if (editModalOverlay) {
  editModalOverlay.addEventListener('click', (e) => {
    if (e.target === editModalOverlay) editModalOverlay.classList.remove('active');
  });
}

// Add Software Form Submission
if (addSoftwareForm) {
  addSoftwareForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('tool-name')?.value;
    const catVal = document.getElementById('tool-category')?.value;
    const costVal = document.getElementById('tool-cost')?.value;
    const assignedSeatsVal = document.getElementById('tool-assigned')?.value || 0;
    const totalSeatsVal = document.getElementById('tool-total')?.value || 1;

    const newTool = {
      id: Date.now(),
      name: nameVal,
      category: catVal,
      monthlyCost: Number(costVal),
      assignedSeats: Number(assignedSeatsVal),
      totalSeats: Number(totalSeatsVal),
      assignments: [],
      status: "Active"
    };

    toolsDatabase.push(newTool);
    renderInventory(toolsDatabase);
    addSoftwareForm.reset();
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
}

// Manage / Edit Software
window.openManageModal = function(toolId) {
  const tool = toolsDatabase.find(t => t.id === toolId);
  if (!tool || !editModalOverlay) return;

  const idEl = document.getElementById('edit-tool-id');
  const nameEl = document.getElementById('edit-tool-name');
  const catEl = document.getElementById('edit-tool-category');
  const costEl = document.getElementById('edit-tool-cost');
  const assignedEl = document.getElementById('edit-tool-assigned');
  const totalEl = document.getElementById('edit-tool-total');

  if (idEl) idEl.value = tool.id;
  if (nameEl) nameEl.value = tool.name;
  if (catEl) catEl.value = tool.category;
  if (costEl) costEl.value = tool.monthlyCost;
  if (assignedEl) {
    assignedEl.value = tool.assignedSeats !== undefined 
      ? tool.assignedSeats 
      : (tool.assignments ? tool.assignments.length : 0);
  }
  if (totalEl) totalEl.value = tool.totalSeats;

  editModalOverlay.classList.add('active');
};

if (editSoftwareForm) {
  editSoftwareForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const toolId = Number(document.getElementById('edit-tool-id')?.value);
    const toolIndex = toolsDatabase.findIndex(t => t.id === toolId);

    if (toolIndex !== -1) {
      toolsDatabase[toolIndex].name = document.getElementById('edit-tool-name')?.value;
      toolsDatabase[toolIndex].category = document.getElementById('edit-tool-category')?.value;
      toolsDatabase[toolIndex].monthlyCost = Number(document.getElementById('edit-tool-cost')?.value);
      toolsDatabase[toolIndex].assignedSeats = Number(document.getElementById('edit-tool-assigned')?.value);
      toolsDatabase[toolIndex].totalSeats = Number(document.getElementById('edit-tool-total')?.value);

      renderInventory(toolsDatabase);
      if (editModalOverlay) editModalOverlay.classList.remove('active');
    }
  });
}

if (deleteToolBtn) {
  deleteToolBtn.addEventListener('click', () => {
    const toolId = Number(document.getElementById('edit-tool-id')?.value);
    toolsDatabase = toolsDatabase.filter(t => t.id !== toolId);
    renderInventory(toolsDatabase);
    if (editModalOverlay) editModalOverlay.classList.remove('active');
  });
}

// ==================== 6. EMPLOYEE SEAT ASSIGNMENT ====================
window.openAssignModal = function(toolId) {
  const tool = toolsDatabase.find(t => t.id === toolId);
  if (!tool || !assignModalOverlay) return;

  const idEl = document.getElementById('assign-tool-id');
  if (idEl) idEl.value = tool.id;
  if (assignModalTitle) assignModalTitle.textContent = `${tool.name} - Seats`;
  
  renderAssignedEmployees(tool);
  assignModalOverlay.classList.add('active');
};

function renderAssignedEmployees(tool) {
  if (!assignedEmployeesList) return;
  assignedEmployeesList.innerHTML = '';

  if (!tool.assignments || tool.assignments.length === 0) {
    assignedEmployeesList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1rem 0;">No employees assigned to this tool yet.</p>`;
    return;
  }

  tool.assignments.forEach(emp => {
    const row = `
      <div class="employee-row">
        <div class="emp-info">
          <span class="emp-name-text">${emp.name}</span>
          <span class="emp-dept-badge">${emp.department}</span>
        </div>
        <button class="btn-revoke" onclick="revokeSeat(${tool.id}, ${emp.id})">Revoke</button>
      </div>
    `;
    assignedEmployeesList.insertAdjacentHTML('beforeend', row);
  });
}

if (assignEmployeeForm) {
  assignEmployeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const toolId = Number(document.getElementById('assign-tool-id')?.value);
    const tool = toolsDatabase.find(t => t.id === toolId);
    if (!tool) return;

    if (!tool.assignments) tool.assignments = [];

    if (tool.assignments.length >= tool.totalSeats) {
      alert(`Cannot assign seat: All ${tool.totalSeats} seats for ${tool.name} are currently occupied.`);
      return;
    }

    const empName = document.getElementById('emp-name')?.value.trim();
    const empDept = document.getElementById('emp-dept')?.value.trim();

    if (!empName || !empDept) return;

    tool.assignments.push({
      id: Date.now(),
      name: empName,
      department: empDept
    });

    tool.assignedSeats = tool.assignments.length;

    assignEmployeeForm.reset();
    renderAssignedEmployees(tool);
    renderInventory(toolsDatabase);
  });
}

window.revokeSeat = function(toolId, empId) {
  const tool = toolsDatabase.find(t => t.id === toolId);
  if (!tool || !tool.assignments) return;

  tool.assignments = tool.assignments.filter(emp => emp.id !== empId);
  tool.assignedSeats = tool.assignments.length;

  renderAssignedEmployees(tool);
  renderInventory(toolsDatabase);
};

if (closeAssignModalBtn && assignModalOverlay) {
  closeAssignModalBtn.addEventListener('click', () => assignModalOverlay.classList.remove('active'));
}
if (assignModalOverlay) {
  assignModalOverlay.addEventListener('click', (e) => {
    if (e.target === assignModalOverlay) assignModalOverlay.classList.remove('active');
  });
}

// ==================== 7. INITIAL START ====================
checkAuth();