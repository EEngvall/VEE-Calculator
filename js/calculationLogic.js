function calculateAverageUsage(usages) {
  const sum = usages.reduce((a, b) => a + b, 0);
  return usages.length > 0 ? sum / usages.length : 0;
}

function calculateTotalConsumption(averageUsage, days) {
  return Math.round(averageUsage * days);
}

function calculateBillSegmentData(billSegments) {
  let calculations = [];
  let totalOverallConsumption = 0;

  // Clear the previous content in the usageInfoContainer
  clearUsageInfo();

  billSegments.forEach((segment, index) => {
    // Constructing the usage field names based on the segment index
    let usage2020FieldName = `usage2020-${index + 1}`;
    let usage2021FieldName = `usage2021-${index + 1}`;
    let usage2022FieldName = `usage2022-${index + 1}`;

    // Extract usage values, filter out empty or non-numeric values, and convert them to numbers
    let usages = [
      segment[usage2020FieldName],
      segment[usage2021FieldName],
      segment[usage2022FieldName],
    ]
      .filter((value) => value && !isNaN(value))
      .map(Number);

    // Calculate average usage
    let averageUsage = Math.round(calculateAverageUsage(usages));

    // Calculate the number of days in the billing period
    let days = calculateDaysInBillingPeriod(
      segment[`startDate${index + 1}`],
      segment[`endDate${index + 1}`]
    );

    // Calculate total consumption for this segment
    let totalConsumption = calculateTotalConsumption(averageUsage, days);

    // Add to the total overall consumption
    totalOverallConsumption += totalConsumption;

    // Add the calculated values to the results array
    calculations.push({
      segmentIndex: index + 1,
      startDate: segment[`startDate${index + 1}`],
      endDate: segment[`endDate${index + 1}`],
      averageUsage: averageUsage,
      totalConsumption: totalConsumption,
      days: days,
    });

    appendUsageInfo(
      index + 1,
      segment[`startDate${index + 1}`],
      segment[`endDate${index + 1}`],
      averageUsage,
      totalConsumption,
      days
    );
  });
  // console.log(calculations);
  // Update the customerContactSummary div
  updateCustomerContactSummary(calculations);
  return {
    segmentCalculations: calculations,
    totalOverallConsumption: totalOverallConsumption,
  };
}

function clearUsageInfo() {
  // Clear the content of the usageInfoContainer
  document.getElementById("calculatedSegmentInfoContainer").innerHTML = "";
}
function appendUsageInfo(
  index,
  startDate,
  endDate,
  averageUsage,
  totalConsumption,
  days
) {
  // Create a div element for each segment's usage information
  let usageInfoDiv = document.createElement("div");

  // Format the information and set it as the innerHTML of the div
  usageInfoDiv.innerHTML = `
      <p>${formatDate(startDate)} - ${formatDate(
    endDate
  )} (${days} Days) Average Usage: ${averageUsage.toFixed(
    0
  )} kWh/Day, Total Consumption: ${totalConsumption.toFixed(0)} kWh</p>
  `;

  // Append the div to the usageInfoContainer
  document
    .getElementById("calculatedSegmentInfoContainer")
    .appendChild(usageInfoDiv);
}

function calculateDaysInBillingPeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds and convert to days
  const differenceInTime = end.getTime() - start.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
}

function performCalculationsAfterFormSubmission() {
  event.preventDefault();
  const billSegmentsData = handleBillSegmentData(); // Collect bill segment data
  const calculationResults = calculateBillSegmentData(billSegmentsData); // Perform calculations
  console.log("Calculation Results:", calculationResults);
  // Any additional logic that needs to be performed after calculations
}
