document.addEventListener("DOMContentLoaded", function () {
  const nameSelect = document.getElementById("name");
  const motiveSelect = document.getElementById("Motive");
  const daySelect = document.getElementById("day");
  const dataTable = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

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

  // Function to handle the form submission
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const name = nameSelect.value;
    const motive = motiveSelect.value;
    const month = document.getElementById("month").value;
    const day = daySelect.value;
    const year = document.getElementById("year").value;
    const hours = document.getElementById("hours").value;
    const message = document.getElementById("message").value;
    const date = `${year}-${month}-${day}`;

    const selectedInfo = `Name: ${name}\nMotive: ${motive}\nDate: ${date}\nHours: ${hours}\nMessage: ${message}`;

    // Update the message box with the selected information
    document.getElementById("message").value = selectedInfo;

    // Update the table with the form data
    const newRow = dataTable.insertRow();
    const nameCell = newRow.insertCell();
    const motiveCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const hoursCell = newRow.insertCell();
    const messageCell = newRow.insertCell();

    nameCell.textContent = name;
    motiveCell.textContent = motive;
    dateCell.textContent = date;
    hoursCell.textContent = hours;
    messageCell.textContent = message;

    // Store the data to be submitted to the server
    const requestData = {
      name: name,
      motive: motive,
      date: date,
      hours: hours,
      message: message,
    };

    // Send the data to the server using fetch API
    fetch('https://precious-cat-ce131a.netlify.app/.netlify/functions/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
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
        // Optionally, you can reset the form after successful submission
        document.getElementById("contact").reset();
      })
      .catch((error) => {
        console.error('Error saving data to the server:', error);
        alert('Failed to save data. Please try again later.');
      });
  }

  // Attach form submission event listener
  const form = document.getElementById("contact");
  form.addEventListener("submit", handleFormSubmit);

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
});