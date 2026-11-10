document.addEventListener("DOMContentLoaded",()=>{let u=[];const T="/data/transaksi",A=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],P={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"},$=e=>{const t=String(e||"").toLowerCase();return P[t]||e||"-"},S=async(e,t={})=>{let n;try{n=await fetch(e,{...t,headers:{Accept:"application/json",...t.headers||{}},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let s={};try{s=await n.json()}catch{}if(!n.ok)throw new Error(s?.message||"Gagal memuat data transaksi.");return s},x=e=>{const t=String(e??"").slice(0,10),n=t.split("-");if(n.length!==3)return t;const s=Number(n[1]);return`${n[2]} ${A[s-1]??n[1]} ${n[0]}`},K=e=>{const t=String(e.jenis??"").toUpperCase();return{receipt:e.no_bukti||"TRX-"+(e.id_transaksi??""),date:x(e.tanggal),type:t==="PENGELUARAN"||t==="K"?"Pengeluaran":"Pemasukan",category:$(e.kategori),description:e.keterangan||e.nama_pembayar||"-",amount:Number(e.nominal)||0,status:"Berhasil"}},D=async()=>{try{const e=await S(T);u=(Array.isArray(e.data)?e.data:[]).map(K),c()}catch(e){console.error("Gagal memuat data transaksi:",e),u=[],c()}},m=document.getElementById("transactionTableBody"),g=document.getElementById("searchInput"),y=document.getElementById("typeFilter"),k=document.getElementById("categoryFilter"),h=document.getElementById("statusFilter"),E=document.getElementById("tableCount"),L=document.getElementById("emptyState"),F=document.getElementById("totalTransactions"),N=document.getElementById("totalIncome"),M=document.getElementById("totalExpense"),_=document.getElementById("cashBalance"),i=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),G=e=>{const t=e.filter(a=>a.type==="Pemasukan"&&a.status==="Berhasil").reduce((a,o)=>a+o.amount,0),n=e.filter(a=>a.type==="Pengeluaran"&&a.status==="Berhasil").reduce((a,o)=>a+o.amount,0),s=t-n;F.textContent=e.length,N.textContent=i(t),M.textContent=i(n),_.textContent=i(s)},R=e=>{if(m.innerHTML="",e.length===0){L.classList.add("show"),E.textContent="Tidak ada transaksi";return}L.classList.remove("show"),e.forEach((t,n)=>{const s=document.createElement("tr"),a=t.type==="Pemasukan"?"income":"expense",o=t.status==="Berhasil"?"success":"cancelled",p=t.type==="Pemasukan"?"+":"-";s.innerHTML=`
                <td>
                    <span class="transaction-number">
                        ${n+1}
                    </span>
                </td>

                <td>
                    <span class="receipt-number">
                        ${t.receipt}
                    </span>
                </td>

                <td>
                    ${t.date}
                </td>

                <td>
                    <span class="transaction-type ${a}">
                        ${t.type}
                    </span>
                </td>

                <td>
                    <span class="transaction-category">
                        ${t.category}
                    </span>
                </td>

                <td>
                    <span class="transaction-description">
                        ${t.description}
                    </span>
                </td>

                <td>
                    <span class="transaction-nominal ${a}">
                        ${p}${i(t.amount)}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${o}">
                        ${t.status}
                    </span>
                </td>
            `,m.appendChild(s)}),E.textContent=`Menampilkan ${e.length} transaksi`},c=()=>{const e=g.value.trim().toLowerCase(),t=y.value,n=k.value,s=h.value,a=u.filter(o=>{const p=o.receipt.toLowerCase().includes(e)||o.description.toLowerCase().includes(e)||o.category.toLowerCase().includes(e),J=t==="all"||o.type===t,O=n==="all"||o.category===n,W=s==="all"||o.status===s;return p&&J&&O&&W});R(a),G(a)};g.addEventListener("input",c),y.addEventListener("change",c),k.addEventListener("change",c),h.addEventListener("change",c);const f=document.getElementById("profileButton"),r=document.querySelector(".profile-wrapper"),w=document.getElementById("profileDropdown");f&&r&&w&&(f.addEventListener("click",e=>{e.stopPropagation(),r.classList.toggle("open")}),w.addEventListener("click",e=>{e.stopPropagation()}),document.addEventListener("click",()=>{r.classList.remove("open")}));const B=()=>{window.confirm("Apakah kamu yakin ingin keluar dari akun Viewer?")&&(window.location.href="/logout")},v=document.getElementById("logoutButton"),b=document.getElementById("dropdownLogout");v&&v.addEventListener("click",B),b&&b.addEventListener("click",B);const I=document.getElementById("sidebar"),d=document.getElementById("sidebarBackdrop"),C=document.getElementById("menuToggle"),j=document.querySelectorAll(".nav-link"),U=()=>{I.classList.add("open"),d.classList.add("show"),document.body.classList.add("nav-open")},l=()=>{I.classList.remove("open"),d.classList.remove("show"),document.body.classList.remove("nav-open")};C&&C.addEventListener("click",U),d&&d.addEventListener("click",l),j.forEach(e=>{e.addEventListener("click",()=>{window.innerWidth<=900&&l()})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(l(),r&&r.classList.remove("open"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&l()}),D()});
