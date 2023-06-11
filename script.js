document.addEventListener("DOMContentLoaded", () => {
    const continentList = document.getElementById("continentList");
    const searchInput = document.getElementById("searchInput");

   //fetch data from the covid 19 api
    const fetchData = async () => {
      try {
        const response = await fetch("https://covid-193.p.rapidapi.com/statistics", {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "213e06f565msh4050c696d8c1419p1fe901jsn03a44fcf1d5f",
            "X-RapidAPI-Host": "covid-193.p.rapidapi.com"
          }
        });
  
        const data = await response.json();
        const countries = data.response;
  
        const continents = {};
  
        countries.forEach(country => {
          const continent = country.continent;
          if (continent !== "null" && continent !== "All") {
            if (!continents.hasOwnProperty(continent)) {
              continents[continent] = [];
            }
            continents[continent].push(country);
          }
        });
  
        displayContinents(continents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const displayContinents = continents => {
      const sortedContinents = Object.keys(continents).sort();
  sortedContinents.forEach(continentName => {
    const continent = continents[continentName];

    if (continentName !== "null") {
      const continentDiv = document.createElement("div");
      continentDiv.classList.add("continent");

      const heading = document.createElement("h2");
      heading.textContent = continentName;

      const expandButton = document.createElement("button");
      expandButton.textContent = "+";
      expandButton.classList.add("expand-button");

      const countryTable = document.createElement("table");
      countryTable.classList.add("country-table");

      const tableHeader = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const countryHeader = document.createElement("th");
      countryHeader.textContent = "Country";
      const populationHeader = document.createElement("th");
      populationHeader.textContent = "Population";
      const casesHeader = document.createElement("th");
      casesHeader.textContent = "Total Covid Cases";

      headerRow.appendChild(countryHeader);
      headerRow.appendChild(populationHeader);
      headerRow.appendChild(casesHeader);
      tableHeader.appendChild(headerRow);
      countryTable.appendChild(tableHeader);

      const tableBody = document.createElement("tbody");

      continent.forEach(country => {
        const row = document.createElement("tr");
        const countryCell = document.createElement("td");
        countryCell.textContent = country.country;

        const populationCell = document.createElement("td");
        populationCell.textContent = country.population;

        const casesCell = document.createElement("td");
        casesCell.textContent = country.cases.total;

        row.appendChild(countryCell);
        row.appendChild(populationCell);
        row.appendChild(casesCell);

        tableBody.appendChild(row);
      });

      countryTable.appendChild(tableBody);

      continentDiv.appendChild(heading);
      continentDiv.appendChild(expandButton);
      continentDiv.appendChild(countryTable);
      continentList.appendChild(continentDiv);

      // Expand/Collapse functionality
      expandButton.addEventListener("click", () => {
        if (countryTable.style.display === "none") {
          countryTable.style.display = "block";
          expandButton.textContent = "-";
        } else {
          countryTable.style.display = "none";
          expandButton.textContent = "+";
        }
      });
    }
  });
};
//search functionality
const searchCountry = () => {
  const filter = searchInput.value.toUpperCase();
  const continents = document.querySelectorAll(".continent");

  continents.forEach(continent => {
    const continentName = continent.querySelector("h2");
    const countryTable = continent.querySelector(".country-table");
    let hasSearchResult = false;

    if (continentName) {
      continent.style.display = "none"; // Hide the continent by default
    }

    const rows = countryTable.querySelectorAll("tbody tr");

    for (let i = 0; i < rows.length; i++) {
      const countryName = rows[i].querySelector("td:first-child");
      if (countryName) {
        const countryText = countryName.textContent || countryName.innerText;
        if (countryText.toUpperCase().indexOf(filter) > -1) {
          rows[i].style.display = ""; // Show the row if the search matches
          countryTable.style.display = "block"; // Show the table if any row matches
          continent.style.display = "block"; // Show the continent if any row matches
          hasSearchResult = true;
        } else {
          rows[i].style.display = "none"; // Hide the row if the search doesn't match
        }
      }
    }

    if (!hasSearchResult) {
      continent.style.display = "none"; // Hide the continent if no row matches
    }
  });
};

searchInput.addEventListener("input", searchCountry);

fetchData();

  });
