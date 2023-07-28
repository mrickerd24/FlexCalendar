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

  // Function to handle the "Add" button click event
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
  

  // Fetch names and motives from the API endpoints
  fetch('http://localhost:8000/api/names')
    .then((response) => response.json())
    .then((data) => {
      const names = data.names;
      populateNames(names);
    })
    .catch((error) => console.error('Error fetching names:', error));

  fetch('http://localhost:8000/api/getAllMotives')
    .then((response) => response.json())
    .then((data) => {
      const motives = data.motives;
      populateMotives(motives);
    })
    .catch((error) => console.error('Error fetching motives:', error));

  // Function to handle row selection in the table
  dataTable.addEventListener("click", function (event) {
    const targetRow = event.target.closest("tr");
    if (targetRow && targetRow.parentNode === dataTable) {
      selectedRowIndex = targetRow.rowIndex;
    }
  });
  

  // Function to handle the "Confirm" button click event
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) { // Check if the "Confirm" button exists in the DOM
    confirmBtn.addEventListener("click", function () {
      if (selectedRowIndex !== null) {
        // Implement logic to update data on the backend (optional)
        alert("Data updated!");
        selectedRowIndex = -1; // Reset the selected row index
      } else {
        // Implement logic to save data to the backend (optional)
        const rows = dataTable.getElementsByTagName("tr");
        const data = [];
        for (let i = 0; i < rows.length; i++) {
          // Retrieve the event object from the row's dataset (stored during the "Add" button click)
          const event = JSON.parse(rows[i].dataset.event);
          data.push(event);
        }

        // Create an object to wrap the array of data
        const requestData = {
          events: data,
        };

        // Send the wrapped object to the server using fetch API
        fetch('http://localhost:8000/api/saveData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData), // Send the wrapped object
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message);
            alert('Data added!');
          })
          .catch((error) => {
            console.error('Error saving data to the server:', error);
            alert('Failed to save data. Please try again later.');
          });
      }
    });
  }

  // Function to handle the "Query Data" button click event
  // ... (rest of the code for handling the "Query Data" button click remains the same)

  // Call the function to populate the "Day" dropdown with days from 1 to 31
  populateDays();
});