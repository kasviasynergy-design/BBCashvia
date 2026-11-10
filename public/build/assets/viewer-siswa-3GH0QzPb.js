import{k as _,a as G}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{let r=[];const C="/data/siswa",j=async(t,e={})=>{let n;const a=new AbortController,s=setTimeout(()=>a.abort(),3e4);try{n=await fetch(t,{...e,headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest",...e.headers||{}},credentials:"same-origin",signal:a.signal})}catch(W){throw clearTimeout(s),W?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(s);let d={};try{d=await n.json()}catch{}if(!n.ok)throw n.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):n.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):n.status===401||n.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(d?.message||"Gagal memuat data siswa.");return d},q=t=>({nis:t.nis??"",nama:t.nama??"",kelas:t.kelas??"",gender:t.jenis_kelamin||"-",dibayar:Number(t.total_dibayar)||0,status:t.status||"Aktif"}),P=t=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0),h=async()=>{const t=document.getElementById("studentTableBody");t&&(t.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="5"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));try{const e=await j(C);r=(Array.isArray(e.data)?e.data:[]).map(q),x(),u()}catch(e){console.error("Gagal memuat data siswa:",e),r=[],u()}},p=document.getElementById("studentTableBody"),k=document.getElementById("searchInput"),E=document.getElementById("statusFilter"),l=document.getElementById("tableCount"),b=document.getElementById("emptyState"),v=document.getElementById("totalSiswa"),L=document.getElementById("siswaAktif"),S=document.getElementById("siswaTidakAktif"),I=document.getElementById("infoJumlahSiswa");function x(){const t=r.length,e=r.filter(n=>n.status==="Aktif").length;v&&(v.textContent=t),L&&(L.textContent=e),S&&(S.textContent=t-e),I&&(I.textContent=t)}function F(t){return String(t||"-").split(" ").slice(0,2).map(e=>e.charAt(0)).join("").toUpperCase()}function M(t){if(p){if(p.innerHTML="",t.length===0){b?.classList.add("show"),l&&(l.textContent="0");return}b?.classList.remove("show"),t.forEach((e,n)=>{const a=document.createElement("tr"),s=e.status==="Aktif"?"success":"danger";a.innerHTML=`
                <td>${n+1}</td>

                <td>
                    <span class="mono-text">
                        ${e.nis}
                    </span>
                </td>

                <td>
                    <div class="table-person">
                        <div class="table-avatar">
                            ${F(e.nama)}
                        </div>

                        <span>
                            ${e.nama}
                        </span>
                    </div>
                </td>

                <td>
                    ${e.gender}
                </td>

                <td>
                    <span class="mono-text">
                        ${P(e.dibayar)}
                    </span>
                </td>

                <td>
                    <span class="status-pill ${s}">
                        <span class="status-dot"></span>
                        ${e.status}
                    </span>
                </td>
            `,p.appendChild(a)}),l&&(l.textContent=t.length)}}function u(){const t=k?.value.trim().toLowerCase()||"",e=E?.value||"all",n=r.filter(a=>{const s=a.nama.toLowerCase().includes(t)||a.nis.toLowerCase().includes(t),d=e==="all"||a.status===e;return s&&d});M(n)}k?.addEventListener("input",u),E?.addEventListener("change",u);const N=()=>document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||"",R=async(t,e)=>{let n;try{n=await fetch(t,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":N(),"X-Idempotency-Key":G()},body:JSON.stringify(e),credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let a={};try{a=await n.json()}catch{}if(!n.ok){const s=a?.errors?Object.values(a.errors).flat().join(" "):"";throw new Error(s||a?.message||"Gagal menyimpan data.")}return a},$=document.getElementById("btnTambahSiswa"),B=document.getElementById("modalFormSiswa"),w=document.getElementById("formSiswa"),o=document.getElementById("formErrorSiswa"),f=(t,e=!1)=>{o&&(o.textContent=t,o.classList.toggle("success",e),o.hidden=!1)},T=()=>{o&&(o.hidden=!0,o.classList.remove("success"))},D=t=>{t&&(t.hidden=!1,requestAnimationFrame(()=>{t.classList.add("is-open")}),document.body.classList.add("modal-open"))},g=t=>{t&&(t.classList.remove("is-open"),window.setTimeout(()=>{t.hidden=!0},180),window.setTimeout(()=>{document.querySelector(".modal.is-open")||document.body.classList.remove("modal-open")},190))};$?.addEventListener("click",()=>{D(B),T(),document.getElementById("inputNisSiswa")?.focus()}),document.querySelectorAll("[data-close-modal]").forEach(t=>{t.addEventListener("click",()=>{g(t.closest(".modal"))})}),w?.addEventListener("submit",async t=>{t.preventDefault();const e={nis:document.getElementById("inputNisSiswa")?.value.trim()||"",nama:document.getElementById("inputNamaSiswa")?.value.trim()||"",jenis_kelamin:document.getElementById("inputJkSiswa")?.value||"",status:document.getElementById("inputStatusSiswa")?.value||"Aktif",no_hp:document.getElementById("inputHpSiswa")?.value.trim()||""};if(T(),!e.nis||!e.nama){f("NIS dan nama siswa wajib diisi.");return}const n=w.querySelector('button[type="submit"]'),a=_(n);if(a)try{await R("/viewer/api/siswa",e),f(`Siswa ${e.nama} berhasil ditambahkan ke kelas.`,!0),w.reset(),await h(),window.setTimeout(()=>{g(B)},1300)}catch(s){f(s.message)}finally{a.pulihkan()}}),h();const O=document.getElementById("profileButton"),i=document.querySelector(".profile-wrapper");O?.addEventListener("click",t=>{t.stopPropagation(),i?.classList.toggle("open")}),document.addEventListener("click",t=>{i&&!i.contains(t.target)&&i.classList.remove("open")});function A(){window.confirm("Apakah kamu yakin ingin keluar dari akun Viewer?")&&(window.location.href="/logout")}document.getElementById("logoutButton")?.addEventListener("click",A),document.getElementById("dropdownLogout")?.addEventListener("click",t=>{t.stopPropagation(),i?.classList.remove("open"),A()});const m=document.getElementById("sidebar"),y=document.getElementById("sidebarBackdrop"),H=document.getElementById("menuToggle");function X(){m?.classList.add("open"),y?.classList.add("show"),document.body.classList.add("nav-open")}function c(){m?.classList.remove("open"),y?.classList.remove("show"),document.body.classList.remove("nav-open")}H?.addEventListener("click",t=>{t.stopPropagation(),m?.classList.contains("open")?c():X()}),y?.addEventListener("click",c),m?.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",()=>{window.innerWidth<=900&&c()})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(document.querySelectorAll(".modal.is-open").forEach(e=>{g(e)}),c(),i?.classList.remove("open"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&c()})});
