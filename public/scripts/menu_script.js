const tableHeader = ["Name", "Description", "Price", "Active", "Delete"];

async function fetchMenu(parameterValue) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/vendor/${parameterValue}/menuitems/`
    );
    const menus = await response.json();

    return [menus, tableHeader];
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
}

module.exports = fetchMenu;
