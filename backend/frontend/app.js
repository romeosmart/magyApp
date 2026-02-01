const searchInput = document.getElementById("search");
const table = document.getElementById("dataTable");
const radioGroup = document.querySelector(".radio-group");
const themeToggle = document.getElementById("themeToggle");
let currentType = "all";

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

// Charger thème depuis localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

// Toggle thème
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
});

// Détection automatique de l'URL backend
const API_BASE_URL = window.location.origin;

// Générer dynamiquement les boutons radio selon les types présents dans data.json
async function setupTypeRadios() {
  // Récupérer toutes les données pour extraire les types
  const res = await fetch(`${API_BASE_URL}/search`);
  const data = await res.json();
  const types = Array.from(new Set(data.map((item) => item.type)));
  // Ajouter le bouton "Tous"
  let radiosHtml = `<input type="radio" name="type" value="all" id="all" checked /> <label for="all">Tous</label>`;
  types.forEach(
    (type) =>
      (radiosHtml += `<input type="radio" name="type" value="${type}" id="${type}" /> <label for="${type}">${type}</label>`),
  );
  radioGroup.innerHTML = radiosHtml;
  // Ajouter les listeners
  document.querySelectorAll('input[name="type"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      currentType = radio.value;
      fetchData();
    });
  });
}

// Recherche
searchInput.addEventListener("input", fetchData);

// Afficher animation chargement
function showLoading() {
  table.innerHTML = `<tr class="loading-row"><td colspan="5">Chargement...</td></tr>`;
}

// Charger données depuis Flask
async function fetchData() {
  showLoading();
  const q = searchInput.value;
  const res = await fetch(`${API_BASE_URL}/search?q=${q}&type=${currentType}`);
  const data = await res.json();
  loadData(data);
}

// Affichage tableau
function loadData(data) {
  table.innerHTML = "";
  data.forEach((item) => {
    const statusClass =
      item.statut === "Terminé" ? "terminated" : "in-progress";
    const statusIcon =
      item.statut === "Terminé"
        ? "fas fa-check-circle"
        : "fas fa-spinner fa-spin";
    table.innerHTML += `
      <tr>
        <td>${item.date}</td>
        <td>${item.nom}</td>
        <td>${item.libelle}</td>
        <td>${item.type}</td>
        <td class="status ${statusClass}"><i class="${statusIcon}"></i>${item.statut}</td>
      </tr>
    `;
  });
}

// Initialisation
setupTypeRadios();
fetchData();
