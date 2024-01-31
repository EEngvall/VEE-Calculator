document.getElementById("toggleSideBtn").addEventListener("click", function () {
  var offcanvasElement = document.getElementById("offCanvasFormContainer");

  // Check current placement and toggle
  if (offcanvasElement.classList.contains("offcanvas-end")) {
    offcanvasElement.classList.remove("offcanvas-end");
    offcanvasElement.classList.add("offcanvas-start");
  } else {
    offcanvasElement.classList.remove("offcanvas-start");
    offcanvasElement.classList.add("offcanvas-end");
  }
});

function toggleBootstrapStyle() {
  document.querySelectorAll(".btn").forEach((button) => {
    if (button.classList.contains("tid-btn-blue")) {
      button.classList.remove("tid-btn-blue");
      button.classList.add("btn-primary");
    } else {
      button.classList.remove("btn-primary");
      button.classList.add("tid-btn-blue");
    }
  });
}
