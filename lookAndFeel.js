document.getElementById("toggleSideBtn").addEventListener("click", function () {
  var offcanvasElement = document.getElementById("offCanvasData");

  // Check current placement and toggle
  if (offcanvasElement.classList.contains("offcanvas-end")) {
    offcanvasElement.classList.remove("offcanvas-end");
    offcanvasElement.classList.add("offcanvas-start");
  } else {
    offcanvasElement.classList.remove("offcanvas-start");
    offcanvasElement.classList.add("offcanvas-end");
  }
});
