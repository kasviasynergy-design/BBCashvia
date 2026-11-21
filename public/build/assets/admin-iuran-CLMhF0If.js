import{k as Z,a as ee}from"./simpan-guard-D5jj-dSF.js";import{n as te,s as ne,i as ae}from"./admin-filter-kelas-BaTSLq81.js";document.addEventListener("DOMContentLoaded",()=>{const I="/admin/api/iuran";let m=[],f=null,x=null,T=null,A=null;const N={"sekali bayar":"Sekali Bayar",mingguan:"Mingguan",bulanan:"Bulanan",tahunan:"Tahunan"},R=document.getElementById("sidebarToggle"),O=document.getElementById("sidebarBackdrop"),E=document.getElementById("profileBtn"),w=document.getElementById("profileMenu"),S=document.getElementById("modalIuran"),G=document.getElementById("modalDetailIuran"),M=document.getElementById("modalHapusIuran"),K=document.getElementById("formIuran"),d=document.getElementById("formErrorIuran");function g(e){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(Number(e)||0)}function j(e){if(!e)return"-";const t=String(e).slice(0,10),n=new Date(`${t}T00:00:00`);return Number.isNaN(n.getTime())?"-":n.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function u(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}let p=[];function F(e){if(e==null||e==="")return"Semua Kelas";const t=p.find(n=>String(n.id_kelas)===String(e));return t?t.nama_kelas:"Semua Kelas"}function H(e){if(!e.target||e.target<=0)return 0;const t=Math.round(e.terkumpul/e.target*100);return Math.max(0,Math.min(100,t))}async function J(){if(!p.length)try{const e=await h("/admin/api/kelas");p=Array.isArray(e.data)?e.data:[],U(),q()}catch{p=[],q()}}function U(){const e=document.getElementById("inputKelasIuran");if(!e)return;const t=e.value;e.innerHTML=`
            <option value="">
                - Semua Kelas (khusus Admin) -
            </option>
            ${p.map(n=>`
                <option value="${u(n.id_kelas)}">
                    ${u(n.nama_kelas)}
                </option>
            `).join("")}
        `,e.value=p.some(n=>String(n.id_kelas)===String(t))?t:""}function q(){ae(document.getElementById("filterKelasIuran"),p)}function X(e){return{id:Number(e.id_iuran),id_kelas:e.id_kelas??"",nama_iuran:e.nama_iuran??"",keterangan:e.keterangan??"",jatuh_tempo:e.jatuh_tempo?String(e.jatuh_tempo).slice(0,10):"",kategori:e.kategori??"",nominal:Number(e.nominal)||0,status:e.status??"aktif",jumlah_siswa:Number(e.jumlah_siswa)||0,target:Number(e.target)||0,terkumpul:Number(e.terkumpul)||0,peserta:Array.isArray(e.peserta)?e.peserta:[]}}function L(e){return m.find(t=>Number(t.id)===Number(e))}async function h(e,t="GET",n=null){const r={Accept:"application/json","X-Requested-With":"XMLHttpRequest"};if(t==="POST"&&(r["X-Idempotency-Key"]=ee()),t!=="GET"){const l=document.querySelector('meta[name="csrf-token"]')?.content;l&&(r["X-CSRF-TOKEN"]=l)}const i={method:t,headers:r,credentials:"same-origin"};n!==null&&(r["Content-Type"]="application/json",i.body=JSON.stringify(n));let o;try{o=await fetch(e,i)}catch{throw new Error("Tidak dapat terhubung ke server. Pastikan Laravel sedang berjalan.")}const a=o.headers.get("content-type")||"";let s={};if(a.includes("application/json"))s=await o.json();else if(!o.ok)throw o.status===419?new Error("Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."):o.status===401||o.status===403?new Error("Akses ditolak atau sesi login berakhir. Silakan login kembali."):new Error("Server tidak memberikan respons yang sesuai. Periksa route dan controller Laravel.");if(!o.ok){if(o.status===422&&s.errors){const l=Object.values(s.errors).flat().filter(Boolean);throw new Error(l.join(" ")||"Periksa kembali data yang kamu masukkan.")}throw o.status===419?new Error("Sesi atau token CSRF kedaluwarsa. Muat ulang halaman, lalu coba lagi."):o.status===401||o.status===403?new Error("Kamu tidak memiliki akses atau sesi login telah berakhir."):o.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):new Error(s.message||`Permintaan gagal (${o.status}).`)}return s}function k(e,t){const n=document.getElementById("toast"),r=document.getElementById("toastTitle"),i=document.getElementById("toastMessage"),o=document.getElementById("toastIcon");!n||!r||!i||(r.textContent=e,i.textContent=t,o&&(o.textContent=e.toLowerCase().includes("gagal")||e.toLowerCase().includes("error")?"error":"check_circle"),n.classList.add("is-muncul"),clearTimeout(A),A=setTimeout(()=>{n.classList.remove("is-muncul")},3500))}const P=document.getElementById("topbarDate");P&&(P.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date));function _(){document.body.classList.remove("nav-open")}R?.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),O?.addEventListener("click",_),document.querySelectorAll(".side-link").forEach(e=>{e.addEventListener("click",()=>{window.innerWidth<=1024&&_()})}),window.addEventListener("resize",()=>{window.innerWidth>1024&&_()}),E?.addEventListener("click",e=>{e.stopPropagation();const t=w?.classList.toggle("is-open")??!1;E.setAttribute("aria-expanded",String(t))}),document.addEventListener("click",e=>{w&&E&&!w.contains(e.target)&&!E.contains(e.target)&&(w.classList.remove("is-open"),E.setAttribute("aria-expanded","false"))});function C(e){e&&(e.hidden=!1,requestAnimationFrame(()=>{e.classList.add("is-open")}),document.body.classList.add("modal-open"))}function b(e){e&&(e.classList.remove("is-open"),setTimeout(()=>{e.hidden=!0,Array.from(document.querySelectorAll(".modal")).some(n=>!n.hidden&&n.classList.contains("is-open"))||document.body.classList.remove("modal-open")},180))}document.querySelectorAll("[data-close-modal]").forEach(e=>{e.addEventListener("click",()=>{b(e.closest(".modal"))})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&document.querySelectorAll(".modal.is-open").forEach(t=>{b(t)})});function W(){const e=m.length,t=m.reduce((r,i)=>r+i.nominal,0);document.getElementById("sumTotalIuran").textContent=e,document.getElementById("sumTagihan").textContent=g(t);const n=m.reduce((r,i)=>r+i.terkumpul,0);document.getElementById("sumTerkumpul").textContent=g(n),document.getElementById("sumTerkumpulNote").textContent="Dari pembayaran siswa",document.getElementById("sumTagihanNote").textContent="Jumlah nominal per iuran",document.getElementById("jumlahIuranFoot").textContent=`${e} iuran`}function B(){const e=document.getElementById("isiTabelIuran"),t=document.getElementById("emptyState"),n=document.getElementById("cariIuran").value.trim().toLowerCase(),r=document.getElementById("filterKategori").value,i=document.getElementById("filterStatusIuran").value,o=m.filter(a=>{const s=a.nama_iuran.toLowerCase().includes(n)||(a.keterangan||"").toLowerCase().includes(n),l=!r||a.kategori===r,c=!i||a.status===i;return s&&l&&c});e.innerHTML="",t.hidden=o.length!==0,o.forEach(a=>{const s=document.createElement("tr"),l=N[a.kategori]||a.kategori||"-";s.innerHTML=`
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
                        ${u(F(a.id_kelas))}
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
                            <span style="width:${H(a)}%"></span>
                        </div>
                        <small>${H(a)}% • ${a.jumlah_siswa} siswa</small>
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
            `,e.appendChild(s)}),W()}async function v(){const e=document.getElementById("isiTabelIuran");e.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="9"><div class="skeleton skeleton-text--lg"></div></td></tr>').join("");try{await J();const t=document.getElementById("filterKelasIuran"),n=te(t),r=n?`${I}?id_kelas=${encodeURIComponent(n)}`:I,i=await h(r);m=Array.isArray(i.data)?i.data.map(X):[],B(),ne(t?.value)}catch(t){m=[],B(),e.innerHTML=`
                <tr>
                    <td colspan="9" style="text-align:center;padding:24px">
                        ${u(t.message)}
                    </td>
                </tr>
            `,document.getElementById("emptyState").hidden=!0,k("Gagal memuat data",t.message)}}function z(){K.reset(),d.textContent="",d.hidden=!0}document.getElementById("btnTambahIuran")?.addEventListener("click",()=>{f=null,document.getElementById("modalIuranTitle").textContent="Tambah Iuran",document.getElementById("modalIuranSub").textContent="Masukkan informasi iuran kelas.",z(),C(S)});function V(e){const t=L(e);t&&(f=t.id,document.getElementById("modalIuranTitle").textContent="Edit Iuran",document.getElementById("modalIuranSub").textContent="Perbarui informasi iuran.",document.getElementById("inputNamaIuran").value=t.nama_iuran,document.getElementById("inputKategori").value=t.kategori,document.getElementById("inputJatuhTempo").value=t.jatuh_tempo,document.getElementById("inputNominalIuran").value=t.nominal,document.getElementById("inputStatusIuran").value=t.status,document.getElementById("inputKeteranganIuran").value=t.keterangan,document.getElementById("inputKelasIuran").value=t.id_kelas!=null?String(t.id_kelas):"",d.textContent="",d.hidden=!0,C(S))}K?.addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("inputNamaIuran").value.trim(),n=document.getElementById("inputKategori").value,r=document.getElementById("inputJatuhTempo").value,i=Number(document.getElementById("inputNominalIuran").value),o=document.getElementById("inputStatusIuran").value,a=document.getElementById("inputKeteranganIuran").value.trim(),s=document.getElementById("inputKelasIuran").value;if(!t||!n||!r||!Number.isFinite(i)||i<=0){d.textContent="Lengkapi semua data yang wajib diisi dan pastikan nominal lebih dari nol.",d.hidden=!1;return}const l={nama_iuran:t,kategori:n,jatuh_tempo:r,nominal:i,status:o,id_kelas:s?Number(s):null,keterangan:a||null},c=K.querySelector('button[type="submit"]'),y=Z(c);if(y)try{f!==null?(await h(`${I}/${f}`,"PUT",l),b(S),k("Berhasil","Iuran berhasil diperbarui.")):(await h(I,"POST",l),b(S),k("Berhasil","Iuran berhasil ditambahkan.")),f=null,await v()}catch(D){d.textContent=D.message,d.hidden=!1}finally{y.pulihkan()}});function Q(e){const t=L(e);t&&(x=t.id,document.getElementById("detailIuranTitle").textContent=t.nama_iuran,document.getElementById("detailIuranSub").textContent=t.keterangan||"Tidak ada keterangan.",document.getElementById("detailKategori").textContent=N[t.kategori]||t.kategori||"-",document.getElementById("detailJatuhTempo").textContent=j(t.jatuh_tempo),document.getElementById("detailNominal").textContent=g(t.nominal),document.getElementById("detailTerkumpul").textContent=g(t.terkumpul),document.getElementById("cariDetailSiswa").value="",document.getElementById("filterDetailStatus").value="",$(),C(G))}function $(){const e=document.getElementById("isiTabelDetail"),t=document.getElementById("emptyDetail"),n=L(x),r=document.getElementById("cariDetailSiswa").value.trim().toLowerCase(),i=document.getElementById("filterDetailStatus").value,a=(n?n.peserta:[]).filter(s=>{const l=String(s.nama_siswa??"").toLowerCase(),c=String(s.nis??"").toLowerCase(),y=!r||l.includes(r)||c.includes(r),D=!i||i==="lunas"&&s.lunas||i==="belum"&&!s.lunas;return y&&D});e.innerHTML="",t.hidden=a.length!==0,a.forEach((s,l)=>{const c=document.createElement("tr"),y=F(n?n.id_kelas:"");c.innerHTML=`
                <td>${l+1}</td>

                <td>
                    <div class="table-primary">
                        ${u(s.nama_siswa)}
                    </div>
                </td>

                <td>${u(s.nis??"-")}</td>

                <td>${u(y)}</td>

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
            `,e.appendChild(c)})}document.getElementById("cariDetailSiswa")?.addEventListener("input",$),document.getElementById("filterDetailStatus")?.addEventListener("change",$),document.getElementById("isiTabelIuran")?.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const n=Number(t.dataset.id),r=t.dataset.action;r==="detail"&&Q(n),r==="edit"&&V(n),r==="delete"&&Y(n)});function Y(e){const t=L(e);t&&(T=t.id,document.getElementById("hapusIuranNama").textContent=t.nama_iuran,C(M))}document.getElementById("btnKonfirmasiHapus")?.addEventListener("click",async()=>{if(T===null)return;const e=T,t=document.getElementById("btnKonfirmasiHapus");t.disabled=!0;try{await h(`${I}/${e}`,"DELETE"),T=null,b(M),k("Berhasil","Iuran berhasil dihapus."),await v()}catch(n){k("Gagal menghapus",n.message)}finally{t.disabled=!1}}),document.getElementById("cariIuran")?.addEventListener("input",B),document.getElementById("filterKategori")?.addEventListener("change",B),document.getElementById("filterStatusIuran")?.addEventListener("change",B),document.getElementById("filterKelasIuran")?.addEventListener("change",v),document.getElementById("btnResetFilter")?.addEventListener("click",()=>{document.getElementById("cariIuran").value="",document.getElementById("filterKategori").value="",document.getElementById("filterStatusIuran").value="",document.getElementById("filterKelasIuran")&&(document.getElementById("filterKelasIuran").value="semua"),v()}),v()});
