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
    let averageUsage = calculateAverageUsage(usages);

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
  });

  console.log("Segment Calculations:", calculations);
  console.log("Total Overall Consumption:", totalOverallConsumption);

  return {
    segmentCalculations: calculations,
    totalOverallConsumption: totalOverallConsumption,
  };
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
