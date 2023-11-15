const tableHeader = ["Name", "Description"];

async function fetchAndDisplayVendors() {
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  try {
    const response = await fetch("/admin/vendor/retrieve");
    const vendors = await response.json();

    tableHeader.forEach((name) => {
      const th = document.createElement("th");
      th.textContent = `${name}`;
      thead.appendChild(th);
    });

    vendors.forEach((vendor) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td> <a href='admin/menu?vendorId=${vendor._id}'>${vendor.vendorName}</a> </td>
        <td>${vendor.description}</td>

      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
}

window.onload = fetchAndDisplayVendors;
