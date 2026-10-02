(function () {
  "use strict";

  var Dash = window.BBCashviaDash;

  // Data dummy visual — sementara untuk kebutuhan tampilan (Sprint 1).
  // Nantinya diganti hasil fetch dari backend tanpa mengubah struktur markup.
  var PROFILE = {
    name: "Muhammad Rizky Pratama",
    roleLabel: "Viewer",
    identity: "viewer@bbcashvia.sch.id"
  };

  var session = Dash.initChrome("viewer", PROFILE);
  if (!session) { return; }

  var greetName = document.querySelector("[data-greet-name]");
  if (greetName) { greetName.textContent = session.name || PROFILE.name; }
})();
