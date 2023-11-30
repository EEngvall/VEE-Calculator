// Define a global variable for form submission
let allFormsSubmitted = false;
let customerInfoSubmitted = false;
let meterRemovalSubmitted = false;

// Function to check and update the status of allFormsSubmitted
function updateAllFormsSubmittedStatus() {
  if (customerInfoSubmitted && meterRemovalSubmitted) {
    allFormsSubmitted = true;
  } else {
    allFormsSubmitted = false;
  }
}

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

function addBillSegment() {
  // At the beginning of your script
  let totalDifferenceBilled = 0;
  let totalDifferenceUsage = 0;

  const segmentIndex = document.querySelectorAll(".bill-segment").length + 1;
  const billSegmentsContainer = document.getElementById(
    "billSegmentsContainer"
  );
  const billSegmentTablesContainer = document.getElementById(
    "billSegmentTablesContainer"
  );

  let segmentDiv = document.createElement("div");
  segmentDiv.className = "bill-segment mt-3 mb-3 d-flex align-items-center";
  segmentDiv.id = `billSegment${segmentIndex}`;

  let segmentContent = `
  <div class="flex-grow-1 d-flex justify-content-between">
  <!-- Bill segment inputs here -->
  <label>Start Date: <input type="date" name="startDate${segmentIndex}" class="start-date form-control" required ></label>
  <label>End Date: <input type="date" name="endDate${segmentIndex}" class="end-date form-control" required></label>
  <label>2020 Usage: <input type="number" name="usage2020-${segmentIndex}" class="form-control"></label>
  <label>2021 Usage: <input type="number" name="usage2021-${segmentIndex}" class="form-control"></label>
  <label>2022 Usage: <input type="number" name="usage2022-${segmentIndex}" class="form-control"></label>
</div>
  `;
  segmentDiv.innerHTML = segmentContent;

  let rebilledTable = document.createElement("table");
  rebilledTable.className = "table equal-width table-bordered mt-3";
  rebilledTable.id = `rebilledTable${segmentIndex}`;
  rebilledTable.innerHTML = `
    <colgroup>
      <col style="width: 25%">
      <col style="width: 25%">
      <col style="width: 25%">
      <col style="width: 25%">
    </colgroup>
    <thead>
      <tr>
        <th id="segmentDateHeader${segmentIndex}">Item</th>
        <th>Original</th>
        <th>Corrected</th>
        <th>Difference</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Billed Amount</td>
        <td><input type="number" name="originalBilled${segmentIndex}" class="form-control original-billed"></td>
        <td><input type="number" name="correctedBilled${segmentIndex}" class="form-control corrected-billed"></td>
        <td><span id="differenceBilled${segmentIndex}"></span></td>
      </tr>
      <tr>
        <td>Usage</td>
        <td><input type="number" name="originalUsage${segmentIndex}" class="form-control original-usage"></td>
        <td><input type="number" name="correctedUsage${segmentIndex}" class="form-control corrected-usage"></td>
        <td><span id="differenceUsage${segmentIndex}"></span></td>
      </tr>
    </tbody>
  `;

  billSegmentTablesContainer.appendChild(rebilledTable);
  billSegmentsContainer.appendChild(segmentDiv);

  let removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn-danger remove-segment-btn ms-3 mt-4";
  removeButton.textContent = "Remove";
  removeButton.onclick = function () {
    segmentDiv.remove();
    rebilledTable.remove();
  };
  segmentDiv.appendChild(removeButton);

  // Update table header with placeholder dates
  const segmentDateHeader = document.getElementById(
    `segmentDateHeader${segmentIndex}`
  );
  segmentDateHeader.textContent = `Start Date - End Date`;

  // Function to update table header when date inputs change
  function updateTableHeader() {
    const startDateInput = segmentDiv.querySelector(".start-date");
    const endDateInput = segmentDiv.querySelector(".end-date");
    segmentDateHeader.textContent = `${formatDate(
      startDateInput.value
    )} - ${formatDate(endDateInput.value)}`;
  }
  function calculateDifferences() {
    // Function to calculate differences for a specific segment
    function calculateSegmentDifferences(segmentIndex) {
      const originalBilled =
        parseFloat(
          document.querySelector(`input[name="originalBilled${segmentIndex}"]`)
            .value
        ) || 0;
      const correctedBilled =
        parseFloat(
          document.querySelector(`input[name="correctedBilled${segmentIndex}"]`)
            .value
        ) || 0;
      const differenceBilled = correctedBilled - originalBilled;
      document.querySelector(`#differenceBilled${segmentIndex}`).textContent =
        formatCurrency(differenceBilled);

      const originalUsage =
        parseFloat(
          document.querySelector(`input[name="originalUsage${segmentIndex}"]`)
            .value
        ) || 0;
      const correctedUsage =
        parseFloat(
          document.querySelector(`input[name="correctedUsage${segmentIndex}"]`)
            .value
        ) || 0;
      const differenceUsage = correctedUsage - originalUsage;
      document.querySelector(`#differenceUsage${segmentIndex}`).textContent =
        differenceUsage + " kWh";

      return { differenceBilled, differenceUsage };
    }

    // Reset running totals
    totalDifferenceBilled = 0;
    totalDifferenceUsage = 0;

    // Calculate differences for each segment and update running totals
    const segmentCount = document.querySelectorAll(".bill-segment").length;
    for (let i = 1; i <= segmentCount; i++) {
      const { differenceBilled, differenceUsage } =
        calculateSegmentDifferences(i);

      // Update running totals
      totalDifferenceBilled += differenceBilled;
      totalDifferenceUsage += differenceUsage;
    }

    // Update the spans displaying the running totals
    document.getElementById("totalDifferenceBilled").textContent =
      formatCurrency(totalDifferenceBilled);
    document.getElementById("totalDifferenceUsage").textContent =
      totalDifferenceUsage.toFixed(2) + " kWh";
  }

  // Add event listeners to input fields for real-time updates
  document.addEventListener("input", function (event) {
    const inputName = event.target.name;
    if (inputName && inputName.startsWith("originalBilled")) {
      calculateDifferences();
    }
    if (inputName && inputName.startsWith("correctedBilled")) {
      calculateDifferences();
    }
    if (inputName && inputName.startsWith("originalUsage")) {
      calculateDifferences();
    }
    if (inputName && inputName.startsWith("correctedUsage")) {
      calculateDifferences();
    }
  });

  rebilledTable
    .querySelectorAll(
      `input[name="originalBilled${segmentIndex}"], input[name="correctedBilled${segmentIndex}"]`
    )
    .forEach((input) => {
      input.addEventListener("input", calculateDifferences);
    });

  rebilledTable
    .querySelectorAll(
      `input[name="originalUsage${segmentIndex}"], input[name="correctedUsage${segmentIndex}"]`
    )
    .forEach((input) => {
      input.addEventListener("input", calculateDifferences);
    });
  // Event listeners for start and end date inputs
  segmentDiv
    .querySelector(".start-date")
    .addEventListener("change", updateTableHeader);
  segmentDiv
    .querySelector(".end-date")
    .addEventListener("change", updateTableHeader);
}

// Add the first bill segment on page load

function removeBillSegment(segmentId) {
  const segment = document.getElementById(segmentId);
  if (segment) {
    segment.remove();
  }
}
function getTotalDifferences() {
  return {
    totalDifferenceBilled: totalDifferenceBilled.textContent,
    totalDifferenceUsage: totalDifferenceUsage.textContent,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Event listener for Customer Information Form

  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileSelect);

  document
    .getElementById("customerInfoForm")
    .addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Check if all fields are filled
      const allFieldsFilled = Array.from(
        document.querySelectorAll("#customerInfoForm input")
      ).every((input) => input.value.trim() !== "");

      if (allFieldsFilled) {
        // If all fields are filled, proceed with the form submission logic
        handleCustomerAndPremiseInfoFormSubmit(event); // Pass the event parameter here
      } else {
        // If any field is not filled, trigger the modal
        const fieldValidationModal = new bootstrap.Modal(
          document.getElementById("fieldValidationModal")
        );
        fieldValidationModal.show();
      }
    });

  // Add event listener for the "Calculate" button
  document
    .getElementById("calculateButton")
    .addEventListener("click", (event) => {
      event.preventDefault();

      // Check if start and end dates are filled in for all segments
      const allDatesFilled = Array.from(
        document.querySelectorAll(".start-date, .end-date")
      ).every((dateInput) => dateInput.value.trim() !== "");

      if (allDatesFilled) {
        // Proceed with calculation logic
        submitAllForms().then(() => {
          const billSegmentsData = handleBillSegmentData();
          let combinedFormData = combineAllFormData();
          const calculationResults = calculateBillSegmentData(billSegmentsData);
          // Continue with any additional logic or logging if needed
          // console.log("Calculation Results:", calculationResults);
        });
      } else {
        // Display an alert if start and end dates are not filled in for all segments
        const fieldValidationModal = new bootstrap.Modal(
          document.getElementById("fieldValidationModal")
        );
        fieldValidationModal.show();
      }
    });

  // Event listener for the "Generate Document" button
  document.getElementById("generateDoc").addEventListener("click", (event) => {
    event.preventDefault();

    // Check if all forms have been submitted
    updateAllFormsSubmittedStatus();
    if (allFormsSubmitted) {
      submitAllForms().then(() => {
        let uploadedTemplate =
          document.getElementById("templateUpload").files[0];

        let combinedFormData = combineAllFormData();
        let totalDifferences = getTotalDifferences();

        // Pass totalDifferences along with other data to your generateDocument function
        generateDocument(combinedFormData, uploadedTemplate, totalDifferences);
      });
    } else {
      const taskValidationModal = new bootstrap.Modal(
        document.getElementById("taskValidationModal")
      );
      taskValidationModal.show();
    }
  });

  document.getElementById("saveJSON").addEventListener("click", (event) => {
    event.preventDefault();
    saveFormDataToJson();
  });

  document
    .getElementById("offCanvasForm")
    .addEventListener("submit", handleOffCanvasFormSubmit);

  // Event listener for adding more bill segments
  document
    .getElementById("addSegmentButton")
    .addEventListener("click", addBillSegment);

  addBillSegment();
});
