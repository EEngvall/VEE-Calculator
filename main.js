function addBillSegment() {
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
  <label>Start Date: <input type="date" name="startDate${segmentIndex}" class="start-date form-control"></label>
  <label>End Date: <input type="date" name="endDate${segmentIndex}" class="end-date form-control"></label>
  <label>2020 Usage: <input type="number" name="usage2020-${segmentIndex}" class="form-control"></label>
  <label>2021 Usage: <input type="number" name="usage2021-${segmentIndex}" class="form-control"></label>
  <label>2022 Usage: <input type="number" name="usage2022-${segmentIndex}" class="form-control"></label>
</div>
  `;
  segmentDiv.innerHTML = segmentContent;

  let rebilledTable = document.createElement("table");
  rebilledTable.className = "table table-bordered mt-3";
  rebilledTable.id = `rebilledTable${segmentIndex}`;
  rebilledTable.innerHTML = `
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
    const originalBilled =
      parseFloat(
        rebilledTable.querySelector(
          `input[name="originalBilled${segmentIndex}"]`
        ).value
      ) || 0;
    const correctedBilled =
      parseFloat(
        rebilledTable.querySelector(
          `input[name="correctedBilled${segmentIndex}"]`
        ).value
      ) || 0;
    const differenceBilled = correctedBilled - originalBilled;
    rebilledTable.querySelector(
      `#differenceBilled${segmentIndex}`
    ).textContent = formatCurrency(differenceBilled);

    const originalUsage =
      parseFloat(
        rebilledTable.querySelector(
          `input[name="originalUsage${segmentIndex}"]`
        ).value
      ) || 0;
    const correctedUsage =
      parseFloat(
        rebilledTable.querySelector(
          `input[name="correctedUsage${segmentIndex}"]`
        ).value
      ) || 0;
    const differenceUsage = correctedUsage - originalUsage;
    rebilledTable.querySelector(`#differenceUsage${segmentIndex}`).textContent =
      differenceUsage + " kWh";
  }

  function formatCurrency(value) {
    let sign = value < 0 ? "-" : "";
    let absValue = Math.abs(value).toFixed(2);
    return sign + "$" + absValue;
  }

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

document.addEventListener("DOMContentLoaded", function () {
  // Event listener for Customer Information Form

  document
    .getElementById("customerInfoForm")
    .addEventListener("submit", handleCustomerAndPremiseInfoFormSubmit);

  // Attach this function to the calculate button's event listener
  document
    .getElementById("calculateButton")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const billSegmentsData = handleBillSegmentData();
      const calculationResults = calculateBillSegmentData(billSegmentsData);
      console.log("Calculation Results:", calculationResults);
    });

  // Event listener for Generate Document button
  // document.getElementById("generateDoc").addEventListener("click", function () {
  //   // Get the uploaded template file
  //   let uploadedTemplate = document.getElementById("templateUpload").files[0];

  //   let combinedFormData = combineAllFormData();
  //   generateDocument(combinedFormData, uploadedTemplate);
  // });

  document.getElementById("generateDoc").addEventListener("click", (event) => {
    event.preventDefault();
    submitAllForms().then(() => {
      let uploadedTemplate = document.getElementById("templateUpload").files[0];

      let combinedFormData = combineAllFormData();
      generateDocument(combinedFormData, uploadedTemplate);
    });
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
