function updateCustomerContactSummary(calculations) {
  let differences = getTotalDifferences();
  const summaryContainer = document.getElementById("customerContactSummary");
  summaryContainer.innerHTML = ""; // Clear previous content

  const summarySection = document.getElementById(
    "customerContactSummarySection"
  );

  // Create a paragraph for the initial content
  const initialContentParagraph = document.createElement("p");
  initialContentParagraph.textContent = `Meter ${
    globalDataObject.customerAndPremiseInfo.meterNumber
  } had SIO Prolonged Estimation activity occur on ${formatDateShort(
    globalDataObject.offCanvasData.errorDate
  )} showing estimation 
  start ${formatDateShort(
    globalDataObject.offCanvasData.estimationDate
  )} until meter was replaced on 01/00.  Re estimated usage for   
  bill segment(s) using data from prior years during the same billing periods and usage on new meter as follows below:`;

  summaryContainer.appendChild(initialContentParagraph);

  // Initialize totalRebillConsumption
  let totalRebillConsumption = 0;

  // Loop through the array
  calculations.forEach((calculation, index) => {
    // Access specific properties of the calculation object
    const startDate = calculation.startDate;
    const endDate = calculation.endDate;
    const averageUsage = calculation.averageUsage.toFixed(0);
    const totalConsumption = calculation.totalConsumption.toFixed(0);
    const days = calculation.days;

    // Update totalRebillConsumption
    totalRebillConsumption += parseFloat(totalConsumption);

    // Concatenate the values into the result string
    const segmentSummary = document.createElement("p");
    segmentSummary.textContent = `Segment ${index + 1}: ${formatDateShort(
      startDate
    )} - ${formatDateShort(
      endDate
    )} (Days: ${days}, Average Usage: ${averageUsage} kWh/Day, Total Consumption: ${totalConsumption} kWh)`;

    // Append the string element to the summaryContainer
    summaryContainer.appendChild(segmentSummary);
  });

  // Add overall total consumption to the summary
  const overallSummary = document.createElement("p");
  overallSummary.textContent = `Total Overall Consumption: ${totalRebillConsumption.toFixed(
    0
  )} kWh`;

  overallSummary.textContent = `Total net additional bill or credit ${differences.totalDifferenceBilled}`;
  summaryContainer.appendChild(overallSummary);

  // Display the summary section
  summarySection.style.display = "block";
  console.log(globalDataObject);

  // Add event listener to the copy button
  const copyBtn = document.getElementById("copyToClipboardBtn");
  copyBtn.addEventListener("click", () => {
    copyTextToClipboard(summaryContainer.textContent);
    alert("Text copied to clipboard!");
  });
}

// Function to copy text to clipboard using Clipboard API
function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}
