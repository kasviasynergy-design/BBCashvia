(function () {
  "use strict";

  // Dropdown profil di topbar
  var btn = document.getElementById("profileButton");
  var dropdown = document.getElementById("profileDropdown");

  if (btn && dropdown) {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target) && !btn.contains(event.target)) {
        dropdown.hidden = true;
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") dropdown.hidden = true;
    });
  }
})();
