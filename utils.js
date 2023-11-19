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

// Other utility functions...
