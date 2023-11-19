function selectTemplate(billSegmentsLength, uploadedTemplate) {
  const defaultTemplatePath = "Template-Short-Web.docx";
  const alternateTemplatePath = "Template-Long-Web.docx";

  // Check if a template file is uploaded
  if (uploadedTemplate && uploadedTemplate instanceof File) {
    return uploadedTemplate;
  } else {
    // Select default or alternate template based on the number of bill segments
    return billSegmentsLength <= 3
      ? defaultTemplatePath
      : alternateTemplatePath;
  }
}

// Example usage:
let templateToUse = selectTemplate(globalDataObject.billSegments.length);
console.log("Selected Template: ", templateToUse);
console.log(globalDataObject.billSegments.length);

function generateDocument(combinedFormData, uploadedTemplate) {
  // Assuming combinedFormData is an object containing all the data needed for the document

  // Load the Docxtemplater and PizZip libraries
  const PizZip = window.PizZip;
  const Docxtemplater = window.docxtemplater;
  let template = selectTemplate(
    combinedFormData.billSegments.length,
    uploadedTemplate
  );
  let fetchPromise;

  if (template instanceof File) {
    // If the template is an uploaded file
    fetchPromise = Promise.resolve(new Blob([template]));
  } else {
    // If the template is a path
    fetchPromise = fetch(template).then((response) => response.blob());
  }

  fetchPromise
    .then((blob) => blob.arrayBuffer())
    .then((buffer) => {
      // Rest of your code to load and process the docx file...
    })
    .catch((error) => {
      console.error("Error fetching the template:", error);
    });

  // Generate a filename using Customer Name and Current Date
  const customerName =
    combinedFormData.customerAndPremiseInfo.customerName || "Unknown";
  const currentDate = new Date();
  const formattedDate = currentDate
    .toLocaleDateString("en-US")
    .replace(/\//g, "-");
  const filename = `${customerName} ${formattedDate}.docx`;

  // Prepare data for Docxtemplater
  const docData = {
    customerName: combinedFormData.customerAndPremiseInfo.customerName,
    accountNumber: combinedFormData.customerAndPremiseInfo.accountNumber,
    mailingAddress: combinedFormData.customerAndPremiseInfo.mailingAddress,
    mailingCity: combinedFormData.customerAndPremiseInfo.mailingCity,
    mailingState: combinedFormData.customerAndPremiseInfo.mailingState,
    mailingZip: combinedFormData.customerAndPremiseInfo.mailingZip,
    premiseAddress: combinedFormData.customerAndPremiseInfo.premiseAddress,
    premiseCity: combinedFormData.customerAndPremiseInfo.premiseCity,
    premiseState: combinedFormData.customerAndPremiseInfo.premiseState,
    premiseZip: combinedFormData.customerAndPremiseInfo.premiseZip,
    removalDate: formatDate(combinedFormData.offCanvasData.removalDate),
  };

  // Add bill segment data, if needed
  combinedFormData.billSegments.forEach((segment, index) => {
    docData[`startDate${index + 1}`] = segment.startDate;
    docData[`endDate${index + 1}`] = segment.endDate;
    // ... and other bill segment data
  });
  // Load your docx file as a binary content
  // This can be done using a file input or fetching the file from a server
  fetchPromise
    .then((blob) => blob.arrayBuffer())
    .then((buffer) => {
      // Load the docx file as a binary
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Set the templateVariables
      // doc.setData(combinedFormData);
      doc.setData(docData);

      try {
        // Render the document
        doc.render();
      } catch (error) {
        // Handle rendering errors
        console.error("Error rendering document:", error);
      }

      // Output the document using a Blob
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Use FileSaver to save the document with the custom filename
      saveAs(out, filename);
    })
    .catch((error) => {
      console.error("Error fetching the template:", error);
    });

  console.log("Document Data:", combinedFormData);
  console.log("Selected Template: ", templateToUse);
  console.log("Uploaded Template File:", uploadedTemplate);
}
