    document.addEventListener("DOMContentLoaded", function () {
      const nameSelect = document.getElementById("name");
      const motiveSelect = document.getElementById("Motive");
      const daySelect = document.getElementById("day");
      const monthSelect = document.getElementById("monthSelect"); // Updated reference
      const yearSelect = document.getElementById("yearSelect"); // Updated reference
      const hoursSelect = document.getElementById("hoursSelect");	  
      const dataTable = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

      // Function to clear the form
      function clearForm() {
        nameSelect.selectedIndex = 0;
        motiveSelect.selectedIndex = 0;
        daySelect.selectedIndex = 0;
        document.getElementById("month").selectedIndex = 0;
        document.getElementById("year").selectedIndex = 0;
        document.getElementById("hours").selectedIndex = 0;
        document.getElementById("message").value = "";
      }

      // Function to populate the "Name" dropdown with names
      function populateNames(names) {
        names.forEach((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          nameSelect.appendChild(option);
        });
      }

      // Function to populate the "Motive" dropdown with motives
      function populateMotives(motives) {
        motives.forEach((motive) => {
          const option = document.createElement("option");
          option.value = motive;
          option.textContent = motive;
          motiveSelect.appendChild(option);
        });
      }

      // Function to populate the "Day" dropdown with days from 1 to 31
      function populateDays() {
        for (let day = 1; day <= 31; day++) {
          const option = document.createElement("option");
          option.value = day;
          option.textContent = day;
          daySelect.appendChild(option);
        }
      }

      // Update the table with the form data
      function updateTable() {
		const name = nameSelect.value;
		const motive = motiveSelect.value;
		const month = monthSelect.value;
		const day = daySelect.value;
		const year = yearSelect.value;
		const hours = hoursSelect.value;
		const message = document.getElementById("message").value;
		const date = `${year}-${month}-${day}`;

  // Check if a row with the same data already exists in the table
  const existingRow = findExistingRow(name, motive, date, hours);

  if (existingRow) {
    // If a row exists, update its content
    existingRow.cells[0].textContent = name;
    existingRow.cells[1].textContent = motive;
    existingRow.cells[2].textContent = date;
    existingRow.cells[3].textContent = hours;
  } else {
    // If no row exists, insert a new row
    const newRow = dataTable.insertRow();
    const nameCell = newRow.insertCell();
    const motiveCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const hoursCell = newRow.insertCell();

    nameCell.textContent = name;
    motiveCell.textContent = motive;
    dateCell.textContent = date;
    hoursCell.textContent = hours;

    // Message cell is not populated since it's not part of the table header
  }

  // Message cell is not populated since it's not part of the table header
}

// Function to find an existing row with the same data in the table
function findExistingRow(name, motive, date, hours) {
  const rows = dataTable.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowData = [row.cells[0].textContent, row.cells[1].textContent, row.cells[2].textContent, row.cells[3].textContent];

    if (rowData[0] === name && rowData[1] === motive && rowData[2] === date && rowData[3] === hours) {
      return row;
    }
  }

  return null;
}

      // Attach change event listeners to the dropdowns
      nameSelect.addEventListener("change", updateTable);
      motiveSelect.addEventListener("change", updateTable);
      daySelect.addEventListener("change", updateTable);
      document.getElementById("month").addEventListener("change", updateTable);
      document.getElementById("year").addEventListener("change", updateTable);
      document.getElementById("hours").addEventListener("change", updateTable);
      document.getElementById("message").addEventListener("change", updateTable);

      // Attach click event listener to "Add" button
      document.getElementById("addButton").addEventListener("click", function () {
        updateTable();
        clearForm();
      });

      // Attach click event listener to "Clear" button (previously named "Edit" button)
      document.getElementById("editButton").addEventListener("click", function () {
        clearForm();
      });

      // Fetch names and motives from the API endpoints and then populate the dropdowns
      Promise.all([
        fetch('https://precious-cat-ce131a.netlify.app/api/names').then((response) => response.json()),
        fetch('https://precious-cat-ce131a.netlify.app/api/getAllMotives').then((response) => response.json())
      ])
        .then(([namesData, motivesData]) => {
          const names = namesData.names;
          const motives = motivesData.motives;
          populateNames(names);
          populateMotives(motives);
        })
        .catch((error) => console.error('Error fetching data:', error));

      // Call the function to populate the "Day" dropdown with days from 1 to 31
      populateDays();