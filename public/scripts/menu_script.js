const parameterValue = new URLSearchParams(window.location.search).get(
  "vendorId"
);

document.getElementById("vendorId").value = parameterValue;

const tableHeader = ["Name", "Description", "Price"];

async function fetchAndDisplayMenu() {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  try {
    const response = await fetch(`/admin/vendor/${parameterValue}/menuitems/`);
    const menus = await response.json();

    tbody.innerHTML = "";

    tableHeader.forEach((name) => {
      const th = document.createElement("th");
      th.textContent = `${name}`;
      thead.appendChild(th);
    });

    menus.forEach((menu) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${menu.itemName}</td>
        <td>${menu.itemDescription}</td>
        <td>${menu.itemPrice}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
}

window.onload = fetchAndDisplayMenu;
