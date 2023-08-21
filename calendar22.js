document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("OutOfOfficeForm");
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
  const hoursSection = document.getElementById("hoursSection");
  const timeFrameSelect = document.getElementById("timeFrameSelect");
  const submitButton = document.getElementById("submitButton");


  timeFrameSelect.addEventListener("change", function () {
    const selectedValue = timeFrameSelect.value;

    if (selectedValue === "Partial day") {
      document.getElementById("dateSection").style.setProperty = "block";
      document.getElementById("hoursSection").style.setProperty = "block";
      document.getElementById("dateToSection").style.setProperty = "none";
    } else if (selectedValue === "Entire day" ") {
      document.getElementById("dateSection").style.setProperty = "block";
      document.getElementById("hoursSection").style.setProperty = "none";
      document.getElementById("dateToSection").style.setProperty = "none";
    } else {
      document.getElementById("dateSection").style.setProperty = "none";
      document.getElementById("hoursSection").style.setProperty = "none";
      document.getElementById("dateToSection").style.setProperty = "none";
    }
  });

  // Clear the form
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
	
    // Enable the submit button after clearing the form
    submitButton.disabled = false;
  }

  // Populate the "Name" dropdown 
  function populateNames(names) {
    names.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      nameSelect.appendChild(option);
    });
  }

  // Populate the "Motive" dropdown
  function populateMotives(motives) {
    motives.forEach((motive) => {
      const option = document.createElement("option");
      option.value = motive;
      option.textContent = motive;
      motiveSelect.appendChild(option);
    });
  }

  // Populate days dropdown
  function populateDays() {
    for (let day = 1; day <= 31; day++) {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }
  
  // Call function populate the "Day" 
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
  

  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      updateTextArea();
      checkRequiredFields();
    });
  });

  submitButton.addEventListener("click", function (event) {
  // Check the visibility of the fields that should prevent default form submission
    const isDateSectionVisible = document.getElementById("dateSection").style.display === "block";
    const isHoursSectionVisible = document.getElementById("hoursSection").style.display === "block";
    const isDateToSectionVisible = document.getElementById("dateToSection").style.display === "block";

    if (isDateSectionVisible && isHoursSectionVisible) {
      // If the "Date" and "Hours" sections are visible, prevent default submission
      event.preventDefault();
      return;
    }

    if (isDateSectionVisible && isDateToSectionVisible) {
      // If the "Date" and "To" sections are visible, prevent default submission
      event.preventDefault();
      return;
    }
      // Clear the form after adding a new entry
      clearForm();
    }
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
});