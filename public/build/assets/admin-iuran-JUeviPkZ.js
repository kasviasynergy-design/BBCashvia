import{k as Y,a as Z}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const B="/admin/api/iuran";let m=[],f=null,A=null,v=null,N=null;const K={"sekali bayar":"Sekali Bayar",mingguan:"Mingguan",bulanan:"Bulanan",tahunan:"Tahunan"},P=document.getElementById("sidebarToggle"),R=document.getElementById("sidebarBackdrop"),E=document.getElementById("profileBtn"),T=document.getElementById("profileMenu"),S=document.getElementById("modalIuran"),O=document.getElementById("modalDetailIuran"),M=document.getElementById("modalHapusIuran"),C=document.getElementById("formIuran"),d=document.getElementById("formErrorIuran");function g(t){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(Number(t)||0)}function j(t){if(!t)return"-";const e=String(t).slice(0,10),n=new Date(`${e}T00:00:00`);return Number.isNaN(n.getTime())?"-":n.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function u(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}let p=[];function H(t){if(t==null||t==="")return"Semua Kelas";const e=p.find(n=>String(n.id_kelas)===String(t));return e?e.nama_kelas:"Semua Kelas"}function q(t){if(!t.target||t.target<=0)return 0;const e=Math.round(t.terkumpul/t.target*100);return Math.max(0,Math.min(100,e))}async function G(){if(!p.length)try{const t=await k("/admin/api/kelas");p=Array.isArray(t.data)?t.data:[],J()}catch{p=[]}}function J(){const t=document.getElementById("inputKelasIuran");if(!t)return;const e=t.value;t.innerHTML=`
            <option value="">
                - Semua Kelas (khusus Admin) -
            </option>
            ${p.map(n=>`
                <option value="${u(n.id_kelas)}">
                    ${u(n.nama_kelas)}
                </option>
            `).join("")}
        `,t.value=p.some(n=>String(n.id_kelas)===String(e))?e:""}function X(t){return{id:Number(t.id_iuran),id_kelas:t.id_kelas??"",nama_iuran:t.nama_iuran??"",keterangan:t.keterangan??"",jatuh_tempo:t.jatuh_tempo?String(t.jatuh_tempo).slice(0,10):"",kategori:t.kategori??"",nominal:Number(t.nominal)||0,status:t.status??"aktif",jumlah_siswa:Number(t.jumlah_siswa)||0,target:Number(t.target)||0,terkumpul:Number(t.terkumpul)||0,peserta:Array.isArray(t.peserta)?t.peserta:[]}}function w(t){return m.find(e=>Number(e.id)===Number(t))}async function k(t,e="GET",n=null){const r={Accept:"application/json","X-Requested-With":"XMLHttpRequest"};if(e==="POST"&&(r["X-Idempotency-Key"]=Z()),e!=="GET"){const l=document.querySelector('meta[name="csrf-token"]')?.content;l&&(r["X-CSRF-TOKEN"]=l)}const o={method:e,headers:r,credentials:"same-origin"};n!==null&&(r["Content-Type"]="application/json",o.body=JSON.stringify(n));let i;try{i=await fetch(t,o)}catch{throw new Error("Tidak dapat terhubung ke server. Pastikan Laravel sedang berjalan.")}const a=i.headers.get("content-type")||"";let s={};if(a.includes("application/json"))s=await i.json();else if(!i.ok)throw i.status===419?new Error("Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."):i.status===401||i.status===403?new Error("Akses ditolak atau sesi login berakhir. Silakan login kembali."):new Error("Server tidak memberikan respons yang sesuai. Periksa route dan controller Laravel.");if(!i.ok){if(i.status===422&&s.errors){const l=Object.values(s.errors).flat().filter(Boolean);throw new Error(l.join(" ")||"Periksa kembali data yang kamu masukkan.")}throw i.status===419?new Error("Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."):i.status===401||i.status===403?new Error("Kamu tidak memiliki akses atau sesi login telah berakhir."):i.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):new Error(s.message||`Permintaan gagal (${i.status}).`)}return s}function b(t,e){const n=document.getElementById("toast"),r=document.getElementById("toastTitle"),o=document.getElementById("toastMessage"),i=document.getElementById("toastIcon");!n||!r||!o||(r.textContent=t,o.textContent=e,i&&(i.textContent=t.toLowerCase().includes("gagal")||t.toLowerCase().includes("error")?"error":"check_circle"),n.classList.add("is-muncul"),clearTimeout(N),N=setTimeout(()=>{n.classList.remove("is-muncul")},3500))}const F=document.getElementById("topbarDate");F&&(F.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date));function _(){document.body.classList.remove("nav-open")}P?.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),R?.addEventListener("click",_),document.querySelectorAll(".side-link").forEach(t=>{t.addEventListener("click",()=>{window.innerWidth<=1024&&_()})}),window.addEventListener("resize",()=>{window.innerWidth>1024&&_()}),E?.addEventListener("click",t=>{t.stopPropagation();const e=T?.classList.toggle("is-open")??!1;E.setAttribute("aria-expanded",String(e))}),document.addEventListener("click",t=>{T&&E&&!T.contains(t.target)&&!E.contains(t.target)&&(T.classList.remove("is-open"),E.setAttribute("aria-expanded","false"))});function L(t){t&&(t.hidden=!1,requestAnimationFrame(()=>{t.classList.add("is-open")}),document.body.classList.add("modal-open"))}function h(t){t&&(t.classList.remove("is-open"),setTimeout(()=>{t.hidden=!0,Array.from(document.querySelectorAll(".modal")).some(n=>!n.hidden&&n.classList.contains("is-open"))||document.body.classList.remove("modal-open")},180))}document.querySelectorAll("[data-close-modal]").forEach(t=>{t.addEventListener("click",()=>{h(t.closest(".modal"))})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&document.querySelectorAll(".modal.is-open").forEach(e=>{h(e)})});function U(){const t=m.length,e=m.reduce((r,o)=>r+o.nominal,0);document.getElementById("sumTotalIuran").textContent=t,document.getElementById("sumTagihan").textContent=g(e);const n=m.reduce((r,o)=>r+o.terkumpul,0);document.getElementById("sumTerkumpul").textContent=g(n),document.getElementById("sumTerkumpulNote").textContent="Dari pembayaran siswa",document.getElementById("sumTagihanNote").textContent="Jumlah nominal per iuran",document.getElementById("jumlahIuranFoot").textContent=`${t} iuran`}function y(){const t=document.getElementById("isiTabelIuran"),e=document.getElementById("emptyState"),n=document.getElementById("cariIuran").value.trim().toLowerCase(),r=document.getElementById("filterKategori").value,o=document.getElementById("filterStatusIuran").value,i=m.filter(a=>{const s=a.nama_iuran.toLowerCase().includes(n)||(a.keterangan||"").toLowerCase().includes(n),l=!r||a.kategori===r,c=!o||a.status===o;return s&&l&&c});t.innerHTML="",e.hidden=i.length!==0,i.forEach(a=>{const s=document.createElement("tr"),l=K[a.kategori]||a.kategori||"-";s.innerHTML=`
                <td>
                    <div class="table-primary">
                        ${u(a.nama_iuran)}
                    </div>
                    <div class="table-secondary">
                        ${u(a.keterangan||"-")}
                    </div>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${u(H(a.id_kelas))}
                    </span>
                </td>

                <td>
                    <span class="frequency-badge">
                        ${u(l)}
                    </span>
                </td>

                <td>${u(j(a.jatuh_tempo))}</td>

                <td>
                    <strong class="money">
                        ${g(a.nominal)}
                    </strong>
                </td>

                <td>
                    <strong class="money">
                        ${g(a.terkumpul)}
                    </strong>
                </td>

                <td>
                    <div class="progress-cell">
                        <div class="progress-track">
                            <span style="width:${q(a)}%"></span>
                        </div>
                        <small>${q(a)}% • ${a.jumlah_siswa} siswa</small>
                    </div>
                </td>

                <td>
                    <span class="status-badge status-badge--${u(a.status)}">
                        ${a.status==="aktif"?"Aktif":"Selesai"}
                    </span>
                </td>

                <td>
                    <div class="table-actions">
                        <button
                            type="button"
                            class="icon-btn"
                            title="Lihat detail"
                            data-action="detail"
                            data-id="${a.id}"
                        >
                            <span class="material-symbols-outlined">visibility</span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn"
                            title="Edit"
                            data-action="edit"
                            data-id="${a.id}"
                        >
                            <span class="material-symbols-outlined">edit</span>
                        </button>

                        <button
                            type="button"
                            class="icon-btn icon-btn--danger"
                            title="Hapus"
                            data-action="delete"
                            data-id="${a.id}"
                        >
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `,t.appendChild(s)}),U()}async function $(){const t=document.getElementById("isiTabelIuran");t.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="9"><div class="skeleton skeleton-text--lg"></div></td></tr>').join("");try{await G();const e=await k(B);m=Array.isArray(e.data)?e.data.map(X):[],y()}catch(e){m=[],y(),t.innerHTML=`
                <tr>
                    <td colspan="9" style="text-align:center;padding:24px">
                        ${u(e.message)}
                    </td>
                </tr>
            `,document.getElementById("emptyState").hidden=!0,b("Gagal memuat data",e.message)}}function W(){C.reset(),d.textContent="",d.hidden=!0}document.getElementById("btnTambahIuran")?.addEventListener("click",()=>{f=null,document.getElementById("modalIuranTitle").textContent="Tambah Iuran",document.getElementById("modalIuranSub").textContent="Masukkan informasi iuran kelas.",W(),L(S)});function z(t){const e=w(t);e&&(f=e.id,document.getElementById("modalIuranTitle").textContent="Edit Iuran",document.getElementById("modalIuranSub").textContent="Perbarui informasi iuran.",document.getElementById("inputNamaIuran").value=e.nama_iuran,document.getElementById("inputKategori").value=e.kategori,document.getElementById("inputJatuhTempo").value=e.jatuh_tempo,document.getElementById("inputNominalIuran").value=e.nominal,document.getElementById("inputStatusIuran").value=e.status,document.getElementById("inputKeteranganIuran").value=e.keterangan,document.getElementById("inputKelasIuran").value=e.id_kelas!=null?String(e.id_kelas):"",d.textContent="",d.hidden=!0,L(S))}C?.addEventListener("submit",async t=>{t.preventDefault();const e=document.getElementById("inputNamaIuran").value.trim(),n=document.getElementById("inputKategori").value,r=document.getElementById("inputJatuhTempo").value,o=Number(document.getElementById("inputNominalIuran").value),i=document.getElementById("inputStatusIuran").value,a=document.getElementById("inputKeteranganIuran").value.trim(),s=document.getElementById("inputKelasIuran").value;if(!e||!n||!r||!Number.isFinite(o)||o<=0){d.textContent="Lengkapi semua data yang wajib diisi dan pastikan nominal lebih dari nol.",d.hidden=!1;return}const l={nama_iuran:e,kategori:n,jatuh_tempo:r,nominal:o,status:i,id_kelas:s?Number(s):null,keterangan:a||null},c=C.querySelector('button[type="submit"]'),I=Y(c);if(I)try{f!==null?(await k(`${B}/${f}`,"PUT",l),h(S),b("Berhasil","Iuran berhasil diperbarui.")):(await k(B,"POST",l),h(S),b("Berhasil","Iuran berhasil ditambahkan.")),f=null,await $()}catch(D){d.textContent=D.message,d.hidden=!1}finally{I.pulihkan()}});function V(t){const e=w(t);e&&(A=e.id,document.getElementById("detailIuranTitle").textContent=e.nama_iuran,document.getElementById("detailIuranSub").textContent=e.keterangan||"Tidak ada keterangan.",document.getElementById("detailKategori").textContent=K[e.kategori]||e.kategori||"-",document.getElementById("detailJatuhTempo").textContent=j(e.jatuh_tempo),document.getElementById("detailNominal").textContent=g(e.nominal),document.getElementById("detailTerkumpul").textContent=g(e.terkumpul),document.getElementById("cariDetailSiswa").value="",document.getElementById("filterDetailStatus").value="",x(),L(O))}function x(){const t=document.getElementById("isiTabelDetail"),e=document.getElementById("emptyDetail"),n=w(A),r=document.getElementById("cariDetailSiswa").value.trim().toLowerCase(),o=document.getElementById("filterDetailStatus").value,a=(n?n.peserta:[]).filter(s=>{const l=String(s.nama_siswa??"").toLowerCase(),c=String(s.nis??"").toLowerCase(),I=!r||l.includes(r)||c.includes(r),D=!o||o==="lunas"&&s.lunas||o==="belum"&&!s.lunas;return I&&D});t.innerHTML="",e.hidden=a.length!==0,a.forEach((s,l)=>{const c=document.createElement("tr"),I=H(n?n.id_kelas:"");c.innerHTML=`
                <td>${l+1}</td>

                <td>
                    <div class="table-primary">
                        ${u(s.nama_siswa)}
                    </div>
                </td>

                <td>${u(s.nis??"-")}</td>

                <td>${u(I)}</td>

                <td>
                    <strong class="money">
                        ${g(s.nominal)}
                    </strong>
                </td>

                <td>
                    <span class="status-badge status-badge--${s.lunas?"lunas":"belum"}">
                        ${s.lunas?"Lunas":"Belum Bayar"}
                    </span>
                </td>
            `,t.appendChild(c)})}document.getElementById("cariDetailSiswa")?.addEventListener("input",x),document.getElementById("filterDetailStatus")?.addEventListener("change",x),document.getElementById("isiTabelIuran")?.addEventListener("click",t=>{const e=t.target.closest("[data-action]");if(!e)return;const n=Number(e.dataset.id),r=e.dataset.action;r==="detail"&&V(n),r==="edit"&&z(n),r==="delete"&&Q(n)});function Q(t){const e=w(t);e&&(v=e.id,document.getElementById("hapusIuranNama").textContent=e.nama_iuran,L(M))}document.getElementById("btnKonfirmasiHapus")?.addEventListener("click",async()=>{if(v===null)return;const t=v,e=document.getElementById("btnKonfirmasiHapus");e.disabled=!0;try{await k(`${B}/${t}`,"DELETE"),v=null,h(M),b("Berhasil","Iuran berhasil dihapus."),await $()}catch(n){b("Gagal menghapus",n.message)}finally{e.disabled=!1}}),document.getElementById("cariIuran")?.addEventListener("input",y),document.getElementById("filterKategori")?.addEventListener("change",y),document.getElementById("filterStatusIuran")?.addEventListener("change",y),document.getElementById("btnResetFilter")?.addEventListener("click",()=>{document.getElementById("cariIuran").value="",document.getElementById("filterKategori").value="",document.getElementById("filterStatusIuran").value="",y()}),$()});
