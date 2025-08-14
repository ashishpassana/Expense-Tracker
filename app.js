let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

// Dark Mode Functionality
document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    document.getElementById("darkModeBtn").textContent = "☀️ Light Mode";
    document.getElementById("darkModeBtn").className = "btn btn-light";
  } else {
    localStorage.setItem("darkMode", "disabled");
    document.getElementById("darkModeBtn").textContent = "🌙 Dark Mode";
    document.getElementById("darkModeBtn").className = "btn btn-secondary";
  }
}

// Check for saved dark mode preference on load
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  document.getElementById("darkModeBtn").textContent = "☀️ Light Mode";
  document.getElementById("darkModeBtn").className = "btn btn-light";
}

// Expense Functions
function addExpense() {
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value;

  if (!date || !category || isNaN(amount) || !description) {
    alert("Please fill all fields with valid values");
    return;
  }

  expenses.push({ date, category, amount, description });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  clearForm();
  applyFilters();
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    applyFilters();
  }
}

function clearForm() {
  document.getElementById("date").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
}

// Filter Functions
function applyFilters() {
  const month = document.getElementById("monthFilter").value;
  const year = document.getElementById("yearFilter").value;
  let filtered = expenses;

  if (month) {
    filtered = filtered.filter(e => e.date.split("-")[1] === month);
  }
  if (year) {
    filtered = filtered.filter(e => e.date.split("-")[0] === year);
  }

  renderTable(filtered);
  renderChart(filtered);
}

// Rendering Functions
function renderTable(data) {
  const table = document.getElementById("expenseTable");
  table.innerHTML = "";
  let total = 0;
  
  data.forEach((exp, index) => {
    total += exp.amount;
    table.innerHTML += `
      <tr>
        <td>${exp.date}</td>
        <td>${exp.category}</td>
        <td>₹${exp.amount.toFixed(2)}</td>
        <td>${exp.description}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button></td>
      </tr>
    `;
  });
  
  document.getElementById("totalAmount").innerText = total.toFixed(2);
}

function renderChart(data) {
  const categories = {};
  data.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();
  
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: document.body.classList.contains("dark-mode") ? 'white' : '#666'
          }
        }
      }
    }
  });
}

// Export Function
function downloadCSV() {
  if (expenses.length === 0) {
    alert("No expenses to export");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Date,Category,Amount,Description\n";
  expenses.forEach(e => {
    csvContent += `${e.date},${e.category},${e.amount},${e.description}\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `expenses_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize the app
applyFilters();



