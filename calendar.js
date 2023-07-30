	document.addEventListener("DOMContentLoaded", function () {
	  const nameSelect = document.getElementById("nameSelect");
	  const motiveSelect = document.getElementById("MotiveSelect");
	  const daySelect = document.getElementById("daySelect");
	  const monthSelect = document.getElementById("monthSelect");
	  const yearSelect = document.getElementById("yearSelect");
	  const hoursSelect = document.getElementById("hoursSelect");
	  const dataTable = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

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

      // Function to populate the "Day" dropdown with days from 1 to 31
      function populateDays() {
        for (let day = 1; day <= 31; day++) {
          const option = document.createElement("option");
          option.value = day;
          option.textContent = day;
          daySelect.appendChild(option);
        }
      }

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