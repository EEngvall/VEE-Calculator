function processFormData() {
  const form = document.getElementById("dataForm");
  const formData = new FormData(form);
  const formDataObject = {};

  // Initialize the count of bill segments
  let billSegmentCount = 0;

  // Process non-bill-segment fields
  for (let [key, value] of formData.entries()) {
    if (!key.endsWith("[]")) {
      formDataObject[key] = value;
    }
  }

  // Process bill segments
  const billSegments = document.querySelectorAll(".bill-segment");
  billSegments.forEach((segment, index) => {
    billSegmentCount++; // Increment the bill segment count
    const segmentData = {};

    // Process inputs within each bill segment
    segment.querySelectorAll("input, select").forEach((input) => {
      const name = input.name.replace("[]", "");
      segmentData[name] = input.value;
    });

    // Process corresponding row in the bill segment table
    const tableRowInputs = document.querySelectorAll(
      `#billSegmentTable tr:nth-child(${
        index * 4 + 2
      }), #billSegmentTable tr:nth-child(${
        index * 4 + 3
      }), #billSegmentTable tr:nth-child(${index * 4 + 4}) input`
    );

    tableRowInputs.forEach((input) => {
      if (input.name) {
        const inputNameParts = input.name.match(/BillSegment\d+\[(\w+)\]/);
        if (inputNameParts && inputNameParts.length > 1) {
          const inputName = inputNameParts[1]; // Extract name suffix
          segmentData[inputName] = input.value;
        }
      }
    });

    formDataObject[`billSegment${index + 1}`] = segmentData;
  });

  // Add the number of bill segments to formDataObject
  formDataObject.numberOfSegments = billSegmentCount;

  return formDataObject;
}

function generateFormDataObject() {
  const form = document.getElementById("dataForm");
  const formData = new FormData(form);
  const dataObject = {};

  for (let [key, value] of formData.entries()) {
    // Check if the key starts with "billSegment"
    if (key.startsWith("billSegment")) {
      // Extract the segment number and the property name
      const match = key.match(/billSegment(\d+)([A-Z][a-zA-Z]*)/);
      if (match) {
        const segmentNumber = match[1];
        const propertyName = match[2];

        // Initialize the segment object if it doesn't exist
        if (!dataObject[`billSegment${segmentNumber}`]) {
          dataObject[`billSegment${segmentNumber}`] = {};
        }

        // Convert the first character of the property name to lowercase
        const formattedPropertyName =
          propertyName.charAt(0).toLowerCase() + propertyName.slice(1);

        // Assign the value to the correct property in the segment object
        dataObject[`billSegment${segmentNumber}`][formattedPropertyName] =
          value;
      }
    } else {
      // For non-bill-segment fields, add them directly to dataObject
      dataObject[key] = value;
    }
  }

  return dataObject;
}

function mergeBillSegmentData(formDataObject) {
  // Iterate through each bill segment div
  const billSegmentDivs = document.querySelectorAll(".bill-segment");
  billSegmentDivs.forEach((div, index) => {
    const segmentNumber = index + 1; // Segment number (1, 2, 3, etc.)

    // Create an object to hold this segment's data, if not already present
    if (!formDataObject[`billSegment${segmentNumber}`]) {
      formDataObject[`billSegment${segmentNumber}`] = {};
    }

    // Extract data from each input within the div
    const inputs = div.querySelectorAll("input");
    inputs.forEach((input) => {
      // Extracting and assigning input values to the corresponding segment
      formDataObject[`billSegment${segmentNumber}`][input.name] = input.value;
    });

    // Extract data from corresponding rows in the billSegmentTable
    const segmentRows = document.querySelectorAll(
      `#billSegmentTable tbody tr[data-segment="${segmentNumber}"]`
    );
    segmentRows.forEach((row) => {
      const inputs = row.querySelectorAll("input, select");
      inputs.forEach((input) => {
        // Assuming the input names are structured correctly
        formDataObject[`billSegment${segmentNumber}`][input.name] = input.value;
      });
    });
  });

  return formDataObject;
}

function createWordDocument(formDataObject) {
  const PizZip = window.PizZip;
  const Docxtemplater = window.docxtemplater;

  // Initialize data object
  const docData = {};

  let firstSegmentEndDate, lastSegmentEndDate;
  const uploadedTemplate = document.getElementById("templateUpload").files[0];

  // Define the paths for your templates
  const defaultTemplatePath = "Template-Short-Web.docx"; // Adjust this path as needed
  const alternateTemplatePath = "Template-Long-Web.docx"; // Adjust this path as needed

  // Dynamically set properties from formDataObject to docData
  Object.keys(formDataObject).forEach((key) => {
    // Here you might want to add conditions to format specific fields if needed
    docData[key] = formDataObject[key];
  });

  // Find all keys that start with "billSegment" and store them in an array
  const billSegmentKeys = Object.keys(formDataObject).filter((key) =>
    key.startsWith("billSegment")
  );

  if (billSegmentKeys.length > 0) {
    firstSegmentEndDate = formDataObject[billSegmentKeys[0]].endDate;
    lastSegmentEndDate =
      formDataObject[billSegmentKeys[billSegmentKeys.length - 1]].endDate;

    // Format the dates
    const formattedFirstDate = formatDateToLongString(firstSegmentEndDate);
    const formattedLastDate = formatDateToLongString(lastSegmentEndDate);

    // Determine dateRange based on the number of segments
    docData.dateRange =
      billSegmentKeys.length === 1
        ? formattedLastDate
        : `${formattedFirstDate} - ${formattedLastDate}`;
  }

  // Now lastSegmentIndex contains the index of the last bill segment

  // Dynamically add bill segment data
  // This part assumes that formDataObject already contains structured data for bill segments
  Object.keys(formDataObject).forEach((key) => {
    if (key.startsWith("billSegment")) {
      const segmentIndex = key.replace("billSegment", "");
      const segment = formDataObject[key];

      // Format and add segment-specific data
      Object.keys(segment).forEach((segmentKey) => {
        if (segmentKey.includes("Date")) {
          // Format the date fields
          docData[`${segmentKey}${segmentIndex}`] = formatDateToLongString(
            segment[segmentKey]
          );
        } else {
          // Add other data as is
          docData[`${segmentKey}${segmentIndex}`] = segment[segmentKey];
        }
      });
    }
  });

  // console.log("formDataObject:", formDataObject);

  // Choose the template based on the number of bill segments
  let templatePath =
    formDataObject.numberOfSegments < 4
      ? defaultTemplatePath
      : alternateTemplatePath;

  // console.log("Selected Template Path: ", templatePath);

  let fetchPromise = uploadedTemplate
    ? Promise.resolve(new Blob([uploadedTemplate]))
    : fetch(templatePath).then((response) => response.blob());

  // Load the docx file content
  fetchPromise
    .then((blob) => blob.arrayBuffer())
    .then((buffer) => {
      var zip = new PizZip(buffer);
      var doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData(docData);

      try {
        // Render the document
        doc.render();
      } catch (error) {
        console.error(error);
      }

      const currentDate = new Date();
      const formattedDate = currentDate
        .toLocaleDateString("en-US")
        .replace(/\//g, "-");
      const filename = `${formDataObject.customerName} ${formattedDate} AB.docx`;

      var out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Download the generated document
      saveAs(out, filename);
    })
    .catch((error) => console.error("Error:", error));
}

function formatDateToLongString(dateString) {
  if (!dateString) return "";

  // Create a Date object at noon UTC on the given date
  const dateObj = new Date(dateString + "T12:00:00Z");
  const options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDate = dateObj.toLocaleDateString("en-US", options);

  // Add suffix to the day
  const day = dateObj.getUTCDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 ? 0 : ((day % 100) - (day % 10) != 10) * (day % 10)
  ];

  return formattedDate.replace(
    new RegExp(" " + day + " "),
    ` ${day}${suffix}, `
  );
}

// Example usage
// console.log(formatDateToLongString("2023-11-01")); // "November 1st, 2023"

function formatDate(dateString) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const monthIndex = parseInt(dateParts[1], 10) - 1; // month is 0-indexed
  const day = parseInt(dateParts[2], 10);

  const monthName = monthNames[monthIndex];
  return `${monthName} ${day}, ${year}`;
}

document.getElementById("generateDoc").addEventListener("click", function () {
  let formDataObject = processFormData(); // Get existing form data, including initial bill segment data
  formDataObject = mergeBillSegmentData(formDataObject); // Add/merge additional bill segment data
  Object.assign(formDataObject, offCanvasData); // Merge off-canvas data if needed
  // console.log("formDataObject before doc creation:", formDataObject);

  createWordDocument(formDataObject); // Pass the combined data to createWordDocument
});
