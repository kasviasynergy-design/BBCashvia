(function () {
  "use strict";

  var Dash = window.BBCashviaDash;

  // Data dummy visual — sementara untuk kebutuhan tampilan (Sprint 1).
  // Nantinya diganti hasil fetch dari backend tanpa mengubah struktur markup.
  var PROFILE = {
    name: "Siti Rahmawati",
    roleLabel: "Bendahara",
    identity: "bendahara@bbcashvia.sch.id"
  };

  var session = Dash.initChrome("bendahara", PROFILE);
  if (!session) { return; }

  var greetName = document.querySelector("[data-greet-name]");
  if (greetName) { greetName.textContent = session.name || PROFILE.name; }

  // Grafik penerimaan & pengeluaran mingguan (nilai Rupiah per pekan)
  var chartEl = document.getElementById("weeklyChart");
  if (chartEl) {
    Dash.renderChart(chartEl,
      [[2850000, 720000], [3420000, 950000], [3060000, 1080000], [2970000, 1100000]],
      ["Pekan 1", "Pekan 2", "Pekan 3", "Pekan 4"],
      { ariaLabel: "Grafik penerimaan dan pengeluaran mingguan" }
    );
  }

  // Pagination sisi klien untuk tabel pembayaran hari ini (dummy 8 baris, 4 per halaman)
  var PAYMENTS = [
    { no: "KAS-20261001-039", jam: "07:12", nama: "Muhammad Alif Pratama", kelas: "XI RPL 1", nominal: 10000, metode: "QRIS" },
    { no: "KAS-20261001-038", jam: "07:08", nama: "Nabila Azzahra Putri", kelas: "XI RPL 1", nominal: 10000, metode: "Tunai" },
    { no: "KAS-20261001-037", jam: "07:03", nama: "Dimas Fakhri Ramadhan", kelas: "XI RPL 2", nominal: 10000, metode: "Transfer Bank" },
    { no: "KAS-20261001-036", jam: "06:58", nama: "Siti Khadijah", kelas: "XI RPL 2", nominal: 10000, metode: "Tunai" },
    { no: "KAS-20261001-035", jam: "06:51", nama: "Rizky Maulana Yusuf", kelas: "XI RPL 1", nominal: 10000, metode: "QRIS" },
    { no: "KAS-20261001-034", jam: "06:47", nama: "Aisyah Nurhaliza", kelas: "XI RPL 2", nominal: 10000, metode: "Tunai" },
    { no: "KAS-20261001-033", jam: "06:41", nama: "Farhan Hidayatullah", kelas: "XI RPL 1", nominal: 10000, metode: "Transfer Bank" },
    { no: "KAS-20261001-032", jam: "06:36", nama: "Putri Anjani Sari", kelas: "XI RPL 2", nominal: 10000, metode: "Tunai" }
  ];

  var PER_PAGE = 4;
  var tbody = document.querySelector("[data-pay-tbody]");
  var pageInfo = document.querySelector("[data-page-info]");
  var pager = document.querySelector("[data-pager]");
  var currentPage = 1;
  var totalPages = Math.ceil(PAYMENTS.length / PER_PAGE);

  function renderPage(page) {
    currentPage = page;
    var start = (page - 1) * PER_PAGE;
    var rows = PAYMENTS.slice(start, start + PER_PAGE);

    if (tbody) {
      tbody.innerHTML = rows.map(function (p) {
        return '' +
          '<tr>' +
            '<td><div class="table__primary">' + p.no + '</div><div class="table__secondary">' + p.jam + ' WIB</div></td>' +
            '<td><div class="table__person"><span class="avatar" aria-hidden="true">' + Dash.initials(p.nama) + '</span><span class="table__primary">' + p.nama + '</span></div></td>' +
            '<td><span class="table__secondary">' + p.kelas + '</span></td>' +
            '<td><span class="table__nominal table__nominal--in">' + Dash.formatRupiah(p.nominal) + '</span></td>' +
            '<td><span class="tag-method">' + p.metode + '</span></td>' +
            '<td><span class="badge badge--ok">Terverifikasi</span></td>' +
          '</tr>';
      }).join("");
    }

    if (pageInfo) {
      var from = start + 1;
      var to = Math.min(start + PER_PAGE, PAYMENTS.length);
      pageInfo.textContent = "Menampilkan " + from + "–" + to + " dari " + PAYMENTS.length + " transaksi";
    }

    if (pager) {
      var btns = pager.querySelectorAll("[data-page]");
      for (var i = 0; i < btns.length; i++) {
        var pnum = parseInt(btns[i].getAttribute("data-page"), 10);
        btns[i].classList.toggle("is-current", pnum === page);
        btns[i].disabled = pnum === page;
      }
      var prev = pager.querySelector("[data-page-prev]");
      var next = pager.querySelector("[data-page-next]");
      if (prev) { prev.disabled = page === 1; }
      if (next) { next.disabled = page === totalPages; }
    }
  }

  if (pager) {
    pager.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-page],[data-page-prev],[data-page-next]");
      if (!btn || btn.disabled) { return; }
      if (btn.hasAttribute("data-page-prev")) { renderPage(Math.max(1, currentPage - 1)); return; }
      if (btn.hasAttribute("data-page-next")) { renderPage(Math.min(totalPages, currentPage + 1)); return; }
      renderPage(parseInt(btn.getAttribute("data-page"), 10));
    });
  }

  if (tbody) { renderPage(1); }
})();
