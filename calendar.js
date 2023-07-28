document.addEventListener("DOMContentLoaded", function () {
  const nameSelect = document.getElementById("name");
  const motiveSelect = document.getElementById("Motive");
  const daySelect = document.getElementById("day");
  const dataTable = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  let selectedRowIndex = null;

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

  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", function () {
    const name = nameSelect.value;
    const motive = motiveSelect.value;
    const month = document.getElementById("month").value;
    const day = daySelect.value;
    const year = document.getElementById("year").value;
    const hours = document.getElementById("hours").value;
    const date = `${year}-${month}-${day}`;

    const newRow = dataTable.insertRow();
    newRow.innerHTML = `<td>${name}</td><td>${motive}</td><td>${date}</td><td>${hours}</td>`;

    // Store the event object in the row's dataset for future reference (optional)
    newRow.dataset.event = JSON.stringify({
      name: name,
      motive: motive,
      date: date,
      hours: hours,
    });
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

  // Function to handle row selection in the table
  dataTable.addEventListener("click", function (event) {
    const targetRow = event.target.closest("tr");
    if (targetRow && targetRow.parentNode === dataTable) {
      selectedRowIndex = targetRow.rowIndex;
    }
  });

  // Call the function to populate the "Day" dropdown with days from 1 to 31
  populateDays();
});