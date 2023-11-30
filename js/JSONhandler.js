function saveFormDataToJson() {
  const formData = combineAllFormData(); // Adjust this based on your form structure
  const jsonData = JSON.stringify(formData);

  const fileName = globalDataObject.customerAndPremiseInfo.customerName;
  // Save jsonData to a file or store it in a way that suits your application
  // For simplicity, let's log it for now
  console.log(jsonData);
  exportToJsonFile(jsonData, fileName);
}

function loadFormDataFromJson(jsonData) {
  // Remove this line, as jsonData is already an object
  // const formData = JSON.parse(jsonData);

  // Use the jsonData directly

  // Populate customer and premise info
  for (const [key, value] of Object.entries(jsonData.customerAndPremiseInfo)) {
    const inputField = document.querySelector(`[name="${key}"]`);
    if (inputField) {
      inputField.value = value;
    }
  }

  // Populate bill segments
  jsonData.billSegments.forEach((segment, index) => {
    // Call addBillSegment for each bill segment
    addBillSegment();
    console.log(segment);

    // Populate the added bill segment with data from the loaded JSON
    for (const [key, value] of Object.entries(segment, index)) {
      const inputField = document.querySelector(`[name="${key}-${index + 1}"]`);
      if (inputField) {
        inputField.value = value;
        console.log(inputField, inputField.value);
      }
    }
  });

  // Populate offCanvasData
  for (const [key, value] of Object.entries(jsonData.offCanvasData)) {
    const inputField = document.querySelector(`[name="${key}"]`);
    if (inputField) {
      inputField.value = value;
    }
  }

  // Populate other form fields as needed

  // Adjust this based on your form structure and data
  // Set the file input value programmatically
  const fileInput = document.getElementById("fileInput");
  fileInput.value = ""; // Clear the input to allow selecting the same file
}

// Function to open the file explorer
function openFileExplorer() {
  document.getElementById("fileInput").click();
}

function handleFileSelect(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const importedData = JSON.parse(e.target.result);

      // Use the importedData as needed in your application
      console.log(importedData);
      loadFormDataFromJson(importedData);
    };

    reader.readAsText(file);
  }
}

function exportToJsonFile(jsonData, fileName) {
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "data.json";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
