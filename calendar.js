document.addEventListener("DOMContentLoaded", function () {
  const nameSelect = document.getElementById("nameSelect");
  const motiveSelect = document.getElementById("MotiveSelect");
  const daySelect = document.getElementById("daySelect");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const hoursSelect = document.getElementById("hoursSelect");
  const daySelect2 = document.getElementById("daySelect2");
  const monthSelect2 = document.getElementById("monthSelect2");
  const yearSelect2 = document.getElementById("yearSelect2");
  const dateToSection = document.getElementById("dateToSection");
  const hoursSection = document.getElementById("hoursSection"); // New: Select the "Hours" section container
  const timeFrameSelect = document.getElementById("timeFrameSelect");
  const submitButton = document.getElementById("submitButton");

  function checkRequiredFields() {
    const selectedName = nameSelect.value;
    const selectedMotive = motiveSelect.value;
    const selectedTimeFrame = timeFrameSelect.value;
    const selectedMonth = monthSelect.value;
    const selectedDay = daySelect.value;
    const selectedYear = yearSelect.value;

    if (
      selectedName !== "" &&
      selectedMotive !== "" &&
      selectedTimeFrame !== "" &&
      selectedMonth !== "" &&
      selectedDay !== "" &&
      selectedYear !== ""
    ) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }
  
  timeFrameSelect.addEventListener("change", function () {
    const selectedValue = timeFrameSelect.value;

    if (selectedValue === "Partial day") {
      // Show the "Date" and "Hours" sections, and hide the "To" section
      document.getElementById("dateSection").style.display = "block";
      document.getElementById("hoursSection").style.display = "block";
      document.getElementById("dateToSection").style.display = "none";
    } else if (selectedValue === "Entire day" || selectedValue === "Multiple days") {
      // Show the "Date" section and "To" section, and hide the "Hours" section
      document.getElementById("dateSection").style.display = "block";
      document.getElementById("hoursSection").style.display = "none";
      document.getElementById("dateToSection").style.display = "block";
    } else {
      // If no option is selected, hide all sections
      document.getElementById("dateSection").style.display = "none";
      document.getElementById("hoursSection").style.display = "none";
      document.getElementById("dateToSection").style.display = "none";
    }
  });

  // Function to clear the form
  function clearForm() {
    nameSelect.selectedIndex = 0;
    motiveSelect.selectedIndex = 0;
    daySelect.selectedIndex = 0;
    monthSelect.selectedIndex = 0;
    yearSelect.selectedIndex = 0;
    hoursSelect.selectedIndex = 0;
    document.getElementById("monthSelect").selectedIndex = 0;
    document.getElementById("yearSelect").selectedIndex = 0;
    document.getElementById("hoursSelect").selectedIndex = 0;
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

  function populateDays() {
    for (let day = 1; day <= 31; day++) {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }
  
    // Call the function to populate the "Day" dropdown with days from 1 to 31
  populateDays();

  function updateTextArea() {
    const name = nameSelect.value;
    const motive = motiveSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    const year = yearSelect.value;
    const hours = hoursSelect.value;
    const message = document.getElementById("message").value;

    const date = `${year}-${month}-${day}`;
    const infoText = `Name: ${name}\nOut of office: ${motive}\nDate: ${date}\nHours: ${hours}\nInformations: ${message}`;

    document.getElementById("message").value = infoText;
  }


  function addToTable() {
    const name = nameSelect.value;
    const motive = motiveSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    const year = yearSelect.value;
    const hours = hoursSelect.value;
    const message = document.getElementById("message").value;

    const date = `${year}-${month}-${day}`;
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${motive}</td>
      <td>${date}</td>
      <td>${hours}</td>
      <td>${message}</td>
    `;
    dataTable.appendChild(newRow);
  }

  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      updateTextArea();
      checkRequiredFields();
    });
  });

  // Add event listener for form submission
  const form = document.getElementById("OutOfOfficeForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
	
	populateDays();

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

  // Add event listener for form submission
  const form = document.getElementById("OutOfOfficeForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Perform any additional validation or data processing here
    // Example: You can call addToTable() function to add the form data to the table
    addToTable();

    // Submit the form to Netlify (you can remove this if you're handling the submission differently)
    form.submit();
  });
});