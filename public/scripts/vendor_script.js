const tableHeader = ["Name", "Description", "Delete"];

async function fetchVendors() {
  try {
    const response = await fetch("http://localhost:3000/admin/vendor/get");

    const vendors = await response.json();

    return [vendors, tableHeader];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
}

module.exports = fetchVendors;
