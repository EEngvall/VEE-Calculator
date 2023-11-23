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
// console.log("Selected Template: ", templateToUse);
// console.log(globalDataObject.billSegments.length);

function generateDocument(
  combinedFormData,
  uploadedTemplate,
  totalDifferences
) {
  // Load the Docxtemplater and PizZip libraries
  const PizZip = window.PizZip;
  const Docxtemplater = window.docxtemplater;
  // Initialize running totals
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
      // Load the docx file as a binary
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Prepare data for Docxtemplater
      const docData = {
        customerName: combinedFormData.customerAndPremiseInfo.customerName,
        accountNumber: combinedFormData.customerAndPremiseInfo.accountNumber,
        csrName: combinedFormData.customerServiceRepName,
        mailingAddress: combinedFormData.customerAndPremiseInfo.mailingAddress,
        mailingCity: combinedFormData.customerAndPremiseInfo.mailingCity,
        mailingState: combinedFormData.customerAndPremiseInfo.mailingState,
        mailingZip: combinedFormData.customerAndPremiseInfo.mailingZip,
        premiseAddress: combinedFormData.customerAndPremiseInfo.premiseAddress,
        premiseCity: combinedFormData.customerAndPremiseInfo.premiseCity,
        premiseState: combinedFormData.customerAndPremiseInfo.premiseState,
        premiseZip: combinedFormData.customerAndPremiseInfo.premiseZip,
        removalDate: formatDate(combinedFormData.offCanvasData.removalDate),
        meterNumber: combinedFormData.customerAndPremiseInfo.meterNumber,
        netDifferenceBilled: totalDifferences.totalDifferenceBilled,
        netDifferenceUsage: totalDifferences.totalDifferenceUsage,
        newChargeDate: combinedFormData.customerAndPremiseInfo.newChargeDate,
        billingPeriod: getBillingPeriodText(combinedFormData.billSegments),
      };

      // Function to determine the billing period text
      function getBillingPeriodText(billSegments) {
        if (billSegments.length === 1) {
          // If there is only one bill segment, use its end date
          return `${formatDateShort(billSegments[0].endDate1)}`;
        } else {
          // If there are multiple bill segments, use the range of end dates
          const firstEndDate = formatDateShort(billSegments[0].endDate1);
          const lastEndDate = formatDateShort(
            billSegments[billSegments.length - 1][
              `endDate${billSegments.length}`
            ]
          );
          return `${firstEndDate} - ${lastEndDate}`;
        }
      }
      // Loop through each bill segment and add corresponding data to docData
      combinedFormData.billSegments.forEach((segment, index) => {
        // Log the structure of each segment
        console.log(`Segment ${index + 1}:`, segment);
        // Log the formatted dates to the console
        console.log(
          `Formatted Start Date ${index + 1}:`,
          formatDate(segment[`startDate${index + 1}`])
        );
        console.log(
          `Formatted End Date ${index + 1}:`,
          formatDate(segment[`endDate${index + 1}`])
        );

        // Use backticks (`) for string interpolation
        docData[`startDate${index + 1}`] = formatDateShort(
          segment[`startDate${index + 1}`]
        );
        docData[`endDate${index + 1}`] = formatDateShort(
          segment[`endDate${index + 1}`]
        );

        const originalBilledInput = document.querySelector(
          `input[name="originalBilled${index + 1}"]`
        );
        const correctedBilledInput = document.querySelector(
          `input[name="correctedBilled${index + 1}"]`
        );
        const originalUsageInput = document.querySelector(
          `input[name="originalUsage${index + 1}"]`
        );
        const correctedUsageInput = document.querySelector(
          `input[name="correctedUsage${index + 1}"]`
        );

        // Check if the inputs are present before accessing their values
        if (
          originalBilledInput &&
          correctedBilledInput &&
          originalUsageInput &&
          correctedUsageInput
        ) {
          const originalBilled = parseFloat(originalBilledInput.value) || 0;
          const correctedBilled = parseFloat(correctedBilledInput.value) || 0;
          const differenceBilled = correctedBilled - originalBilled;

          const originalUsage = parseFloat(originalUsageInput.value) || 0;
          const correctedUsage = parseFloat(correctedUsageInput.value) || 0;
          const differenceUsage = correctedUsage - originalUsage;

          // Log extracted values for confirmation
          console.log(`Original Billed ${index + 1}:`, originalBilled);
          console.log(`Corrected Billed ${index + 1}:`, correctedBilled);
          console.log(
            `Difference Billed ${index + 1}:`,
            differenceBilled.toFixed(2)
          );

          console.log(`Original Usage ${index + 1}:`, originalUsage);
          console.log(`Corrected Usage ${index + 1}:`, correctedUsage);
          console.log(
            `Difference Usage ${index + 1}:`,
            differenceUsage.toFixed(0)
          );

          // Add table data to docData
          docData[`originalBilled${index + 1}`] = originalBilled.toFixed(2);
          docData[`correctedBilled${index + 1}`] = correctedBilled.toFixed(2);
          docData[`differenceBilled${index + 1}`] = differenceBilled.toFixed(2);

          docData[`originalUsage${index + 1}`] = originalUsage;
          docData[`correctedUsage${index + 1}`] = correctedUsage;
          docData[`differenceUsage${index + 1}`] = differenceUsage.toFixed(0);
        } else {
          console.error(`Inputs for segment ${index + 1} not found.`);
        }
      });

      // Set the templateVariables
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
      const customerName =
        combinedFormData.customerAndPremiseInfo.customerName || "Unknown";
      const currentDate = new Date();
      const formattedDate = currentDate
        .toLocaleDateString("en-US")
        .replace(/\//g, "-");
      const filename = `${customerName} ${formattedDate}.docx`;

      saveAs(out, filename);
    })
    .catch((error) => {
      console.error("Error fetching the template:", error);
    });

  console.log("Document Data:", combinedFormData);
  // console.log("Selected Template: ", templateToUse);
  // console.log("Uploaded Template File:", uploadedTemplate);
}
