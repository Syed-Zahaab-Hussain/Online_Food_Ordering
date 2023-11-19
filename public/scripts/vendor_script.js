const tableHeader = ["Name", "Description"];

// async function DisplayAdminInformation() {
//   try {
//     const response = await fetch("/admin");
//   } catch (error) {
//     console.error("Error fetching Admin Information", error);
//   }
// }

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
