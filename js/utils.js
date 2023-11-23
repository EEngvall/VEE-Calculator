// utils.js
function formatDate(dateString, timeZone = "America/Los_Angeles") {
  if (!dateString) return "";

  // Create a Date object with the specified time zone
  const dateObj = new Date(dateString + "T00:00:00");
  const options = { year: "numeric", month: "long", day: "numeric", timeZone };
  let formattedDate = dateObj.toLocaleDateString("en-US", options);

  // Add the ordinal suffix to the day
  const day = dateObj.getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 ? 0 : ((day % 100) - (day % 10) != 10) * (day % 10)
  ];

  return formattedDate.replace(
    new RegExp(" " + day + " "),
    ` ${day}${suffix}, `
  );
}

function formatDateShort(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
}

function resetApplication() {
  // Clear customer info
  setValueIfExists("customerName", "");
  setValueIfExists("accountNumber", "");
  setValueIfExists("mailingAddress", "");
  setValueIfExists("mailingCity", "");
  setValueIfExists("mailingState", "");
  setValueIfExists("mailingZip", "");
  setValueIfExists("premiseAddress", "");
  setValueIfExists("premiseCity", "");
  setValueIfExists("premiseState", "");
  setValueIfExists("premiseZip", "");
  setValueIfExists("removalDate", "");
  setValueIfExists("removalTime", "");
  setValueIfExists("errorDate", "");
  setValueIfExists("estimationDate", "");
  setValueIfExists("meterNumber", "");
  // Clear the content of the usageInfoContainer
  clearUsageInfo();
  document.getElementById("customerContactSummary").innerHTML = ""; // Clear previous content
  document.getElementById("customerContactSummarySection").style.display =
    "none"; // Hides heading

  // Update the spans displaying the running totals
  totalDifferenceBilled = 0;
  totalDifferenceUsage = 0;
  document.getElementById("totalDifferenceBilled").textContent = formatCurrency(
    totalDifferenceBilled
  );
  document.getElementById("totalDifferenceUsage").textContent =
    totalDifferenceUsage.toFixed(2) + " kWh";

  // Clear bill segments
  const billSegmentsContainer = document.getElementById(
    "billSegmentsContainer"
  );
  while (billSegmentsContainer.firstChild) {
    billSegmentsContainer.firstChild.remove();
  }

  // Clear generated tables
  const billSegmentTablesContainer = document.getElementById(
    "billSegmentTablesContainer"
  );
  while (billSegmentTablesContainer.firstChild) {
    billSegmentTablesContainer.firstChild.remove();
  }

  updateListItemStyle("task1", false);
  updateListItemStyle("task2", false);
  updateListItemStyle("task3", false);

  allFormsSubmitted = false;
  customerInfoSubmitted = false;
  meterRemovalSubmitted = false;

  // Add the first bill segment on page load
  addBillSegment();
}

function setValueIfExists(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value;
  }
}

function showSection(section) {
  if (section === "home") {
    document.getElementById("homeSection").style.display = "block";
    document.getElementById("configSection").style.display = "none";
  } else if (section === "config") {
    document.getElementById("homeSection").style.display = "none";
    document.getElementById("configSection").style.display = "block";
  }
}

function formatCurrency(value) {
  let sign = value < 0 ? "-" : "";
  let absValue = Math.abs(value).toFixed(2);
  return sign + "$" + absValue;
}
// Attach this function to the reset button's event listener
document
  .getElementById("resetButton")
  .addEventListener("click", resetApplication);

// Attach this function to the reset button's event listener
document
  .getElementById("resetButton")
  .addEventListener("click", resetApplication);

// Other utility functions...
