const searchInput = document.getElementById("search");
const table = document.getElementById("dataTable");
const radios = document.querySelectorAll('input[name="type"]');
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

// Filtre radios
radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    currentType = radio.value;
    fetchData();
  });
});

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
  const res = await fetch(
    `http://127.0.0.1:5000/search?q=${q}&type=${currentType}`,
  );
  const data = await res.json();
  loadData(data);
}

// Affichage tableau
function loadData(data) {
  table.innerHTML = "";
  data.forEach((item) => {
    const code = item.type === "Vente" ? "411" : "401";
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
        <td>${code}</td>
        <td class="status ${statusClass}"><i class="${statusIcon}"></i>${item.statut}</td>
      </tr>
    `;
  });
}

// Charger initialement
fetchData();
