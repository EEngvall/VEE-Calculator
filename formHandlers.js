// Global Data Object
let globalDataObject = {
  customerAndPremiseInfo: {},
  billSegments: [],
  offCanvasData: {},
};

// Handle Customer and Premise Info Form Submission
//console.log("Script loaded and executing");

function handleCustomerAndPremiseInfoFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  let customerAndPremiseInfo = {};

  for (let [key, value] of formData.entries()) {
    customerAndPremiseInfo[key] = value;
  }

  // Store customer and premise info in global object
  globalDataObject.customerAndPremiseInfo = customerAndPremiseInfo;
  console.log(customerAndPremiseInfo);
}

function handleBillSegmentData() {
  event.preventDefault();
  let billSegmentsData = [];
  const billSegments = document.querySelectorAll(".bill-segment");

  billSegments.forEach((segment, index) => {
    let segmentData = {};
    segment.querySelectorAll("input, select").forEach((input) => {
      // console.log(`Input Name: ${input.name}, Value: ${input.value}`);
      segmentData[input.name] = input.value;
    });
    billSegmentsData.push(segmentData);
  });

  console.log("Bill Segments Data:", billSegmentsData);
  globalDataObject.billSegments = billSegmentsData;

  return billSegmentsData; // Add this line to return the collected data
}

// Handle Off-Canvas Form Submission
function handleOffCanvasFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  let offCanvasData = {};

  for (let [key, value] of formData.entries()) {
    offCanvasData[key] = value;
  }

  // Store off-canvas data in global object
  globalDataObject.offCanvasData = offCanvasData;
  console.log("Off-Canvas Data:", offCanvasData);

  // Close the off-canvas window
  const offCanvasElement = document.getElementById("offCanvasFormContainer");
  const offcanvasInstance = bootstrap.Offcanvas.getInstance(offCanvasElement);

  if (offcanvasInstance) {
    offcanvasInstance.hide();
  } else {
    console.warn("Off-canvas element not found");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const sameAsPremiseCheckbox = document.getElementById(
    "sameAsPremiseCheckbox"
  );
  const mailingAddressSection = document.getElementById(
    "mailingAddressSection"
  );

  // Function to update the mailing address based on premise address
  const updateMailingAddress = () => {
    const premiseAddress = document.getElementById("premiseAddress").value;
    const premiseCity = document.getElementById("premiseCity").value;
    const premiseState = document.getElementById("stateSelect").value;
    const premiseZip = document.getElementById("premiseZip").value;

    document.getElementById("mailingAddress").value = premiseAddress;
    document.getElementById("mailingCity").value = premiseCity;
    document.getElementById("mailingStateSelect").value = premiseState;
    document.getElementById("mailingZip").value = premiseZip;
  };

  // Add change event listeners to premise fields
  ["premiseAddress", "premiseCity", "stateSelect", "premiseZip"].forEach(
    (id) => {
      document
        .getElementById(id)
        .addEventListener("change", updateMailingAddress);
    }
  );

  // Function to handle the checkbox change
  const handleCheckboxChange = () => {
    const isChecked = sameAsPremiseCheckbox.checked;
    mailingAddressSection.style.display = isChecked ? "none" : "block";

    // If checkbox is checked, update the mailing address fields
    // with the premise address fields' values
    if (isChecked) {
      document.getElementById("mailingAddress").value =
        document.getElementById("premiseAddress").value;
      document.getElementById("mailingCity").value =
        document.getElementById("premiseCity").value;
      document.getElementById("mailingStateSelect").value =
        document.getElementById("stateSelect").value;
      document.getElementById("mailingZip").value =
        document.getElementById("premiseZip").value;
    }
  };

  // Event listener for checkbox change
  sameAsPremiseCheckbox.addEventListener("change", handleCheckboxChange);

  // Initial setup
  sameAsPremiseCheckbox.checked = true; // Set the checkbox to checked initially
  handleCheckboxChange(); // Update the UI based on the checkbox state

  // Event listener for checkbox change
  sameAsPremiseCheckbox.addEventListener("change", handleCheckboxChange);

  // Initial setup
  sameAsPremiseCheckbox.checked = true; // Set the checkbox to checked initially
  handleCheckboxChange(); // Update the UI based on the checkbox state
});

// Combine all form data
function combineAllFormData() {
  // Combine all parts of the globalDataObject
  return { ...globalDataObject };
}

function submitAllForms() {
  const formsToSubmit = [
    document.getElementById("customerInfoForm"),
    document.getElementById("billSegmentForm"),
    document.getElementById("offCanvasForm"),
    // Add other forms if necessary
  ];

  const submissionPromises = formsToSubmit.map((form) => {
    return new Promise((resolve) => {
      form.addEventListener("submit", resolve, { once: true });
      form.dispatchEvent(new Event("submit"));
    });
  });

  performCalculationsAfterFormSubmission();
  return Promise.all(submissionPromises);
}

// Example usage:
// After all forms have been submitted, you can call combineAllFormData
// to get a single object with all the data combined.
// let combinedFormData = combineAllFormData();
// console.log("Combined Form Data:", combinedFormData);
