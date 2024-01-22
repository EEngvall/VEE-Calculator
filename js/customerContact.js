function updateCustomerContactSummary(calculations) {
  let differences = getTotalDifferences();
  console.log(getTotalDifferences());
  const summaryContainer = document.getElementById("customerContactSummary");
  summaryContainer.innerHTML = ""; // Clear previous content
  const summarySection = document.getElementById(
    "customerContactSummarySection",
  );
  const errorType = document.getElementById("errorTypeSelector").value;

  // Create a paragraph for the initial content
  const initialContentParagraph = document.createElement("p");
  initialContentParagraph.textContent = `Meter ${
    globalDataObject.customerAndPremiseInfo.meterNumber
  } had ${errorType} activity occur on ${formatDateShort(
    globalDataObject.offCanvasData.errorDate,
  )} showing estimation start ${formatDateShort(
    globalDataObject.offCanvasData.estimationDate,
  )} until meter was replaced on ${formatDateShort(
    globalDataObject.offCanvasData.removalDate,
  )}. 
  Re estimated usage for ${getBillingPeriodText(
    globalDataObject.billSegments,
  )} bill segment(s) using data from prior years during the same billing periods and usage on new meter as follows below:`;

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
      startDate,
    )} - ${formatDateShort(
      endDate,
    )} (Days: ${days}, Average Usage: ${averageUsage} kWh/Day, Total Consumption: ${totalConsumption} kWh)`;

    // Append the string element to the summaryContainer
    summaryContainer.appendChild(segmentSummary);
  });

  // Add overall total consumption to the summary
  const overallSummary = document.createElement("p");

  // Assuming totalRebillConsumption is already formatted with two decimal places
  overallSummary.textContent = `Total Overall Consumption: ${totalRebillConsumption} kWh`;

  // Format totalDifferenceBilled and totalDifferenceUsage with two decimal places
  const formattedTotalDifferenceBilled =
    differences.totalDifferenceBilled.toFixed(2);
  const formattedTotalDifferenceUsage =
    differences.totalDifferenceUsage.toFixed(0);

  overallSummary.textContent = `Total net additional bill or credit $${formattedTotalDifferenceBilled} (${formattedTotalDifferenceUsage}kWh)`;
  summaryContainer.appendChild(overallSummary);

  // Display the summary section
  summarySection.style.display = "block";
  console.log(globalDataObject);

  // Add event listener to the copy button
  const copyBtn = document.getElementById("copyToClipboardBtn");
  copyBtn.addEventListener("click", () => {
    copyTextToClipboard(summaryContainer.textContent);
  });
}

// Function to copy text to clipboard using Clipboard API
function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; // Make it invisible but still part of the layout
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

// Function to determine the billing period text
function getBillingPeriodText(billSegments) {
  if (billSegments.length === 1) {
    // If there is only one bill segment, use its end date
    return `${formatDateShort(billSegments[0].endDate1)}`;
  } else {
    // If there are multiple bill segments, use the range of end dates
    const firstEndDate = formatDateShort(billSegments[0].endDate1);
    const lastEndDate = formatDateShort(
      billSegments[billSegments.length - 1][`endDate${billSegments.length}`],
    );
    return `${firstEndDate} - ${lastEndDate}`;
  }
}
