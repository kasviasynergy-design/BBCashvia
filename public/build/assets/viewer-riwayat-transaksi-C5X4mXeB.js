document.addEventListener("DOMContentLoaded",()=>{let m=[];const v="/data/transaksi",N=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],F={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"},R=e=>{const t=String(e||"").toLowerCase();return F[t]||e||"-"},r=e=>String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),j=async(e,t={})=>{let n;try{n=await fetch(e,{...t,headers:{Accept:"application/json",...t.headers||{}},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let s={};try{s=await n.json()}catch{}if(!n.ok)throw new Error(s?.message||"Gagal memuat data transaksi.");return s},G=e=>{const t=String(e??"").slice(0,10),n=t.split("-");if(n.length!==3)return t;const s=Number(n[1]);return`${n[2]} ${N[s-1]??n[1]} ${n[0]}`},U=e=>{const t=String(e.jenis??"").toUpperCase(),n=String(e.tanggal??"").slice(0,10);return{receipt:e.no_bukti||"TRX-"+(e.id_transaksi??""),tanggalIso:n,date:G(n),type:t==="PENGELUARAN"||t==="K"?"Pengeluaran":"Pemasukan",kategoriMentah:String(e.kategori??""),category:R(e.kategori),description:e.keterangan||e.nama_pembayar||"-",amount:Number(e.nominal_grup??e.nominal)||0,kelas:e.nama_kelas||"-",status:"Berhasil"}},H=()=>{if(!i)return;const e=i.value,t=[...new Set(m.map(n=>String(n.category??"").trim()).filter(Boolean))].sort((n,s)=>n.localeCompare(s,"id"));i.innerHTML='<option value="all">Semua Kategori</option>'+t.map(n=>`<option value="${r(n)}">${r(n)}</option>`).join(""),[...i.options].some(n=>n.value===e)&&(i.value=e)},E=async()=>{try{const e=new URLSearchParams;g?.value&&e.set("dari",g.value),y?.value&&e.set("sampai",y.value);const t=e.toString()?`${v}?${e.toString()}`:v,n=await j(t),s=Array.isArray(n.data)?n.data:[],a=new Map;s.forEach(o=>{const d=o.no_bukti||"TRX-"+(o.id_transaksi??"");a.has(d)||a.set(d,o)}),m=Array.from(a.values()).map(U),H(),u()}catch(e){console.error("Gagal memuat data transaksi:",e),m=[],u()}},L=document.getElementById("riwayatTableBody"),w=document.getElementById("searchInput"),B=document.getElementById("statusFilter"),i=document.getElementById("categoryFilter"),g=document.getElementById("dariTanggal"),y=document.getElementById("sampaiTanggal"),k=document.getElementById("tableCount"),I=document.getElementById("emptyState"),b=document.getElementById("ringkasanTransaksi"),S=document.getElementById("totalTransactions"),$=document.getElementById("totalIncome"),C=document.getElementById("totalExpense"),T=document.getElementById("cashBalance"),l=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),q=e=>{const t=e.filter(a=>a.type==="Pemasukan"&&a.status==="Berhasil").reduce((a,o)=>a+o.amount,0),n=e.filter(a=>a.type==="Pengeluaran"&&a.status==="Berhasil").reduce((a,o)=>a+o.amount,0),s=t-n;S&&(S.textContent=e.length),$&&($.textContent=l(t)),C&&(C.textContent=l(n)),T&&(T.textContent=l(s)),b&&(b.textContent=`${e.length} transaksi • Pemasukan ${l(t)} • Pengeluaran ${l(n)} • Saldo ${l(s)}`)},J=e=>{if(L){if(L.innerHTML="",e.length===0){I?.classList.add("show"),k&&(k.textContent="Tidak ada transaksi");return}I?.classList.remove("show"),e.forEach((t,n)=>{const s=document.createElement("tr"),a=t.type==="Pemasukan"?"income":"expense",o=t.status==="Berhasil"?"success":"cancelled",d=t.type==="Pemasukan"?"+":"-";s.innerHTML=`
                <td>
                    <span class="transaction-number">
                        ${n+1}
                    </span>
                </td>

                <td>
                    <span class="receipt-number">
                        ${r(t.receipt)}
                    </span>
                </td>

                <td>
                    ${r(t.date)}
                </td>

                <td>
                    <span class="transaction-type ${a}">
                        ${r(t.type)}
                    </span>
                </td>

                <td>
                    <span class="transaction-category">
                        ${r(t.category)}
                    </span>
                </td>

                <td>
                    <span class="transaction-description">
                        ${r(t.description)}
                        <span class="transaction-category">${r(t.kelas)}</span>
                    </span>
                </td>

                <td>
                    <span class="transaction-nominal ${a}">
                        ${d}${l(t.amount)}
                    </span>
                </td>

                <td>
                    <span class="status-badge ${o}">
                        ${t.status}
                    </span>
                </td>
            `,L.appendChild(s)}),k&&(k.textContent=`Menampilkan ${e.length} transaksi`)}},u=()=>{const e=(w?.value??"").trim().toLowerCase(),t=B?.value??"all",n=t==="masuk"?"Pemasukan":t==="keluar"?"Pengeluaran":null,s=i?.value??"all",a=g?.value??"",o=y?.value??"",d=m.filter(c=>{const X=!e||String(c.receipt).toLowerCase().includes(e)||String(c.description).toLowerCase().includes(e)||String(c.category).toLowerCase().includes(e)||String(c.kelas).toLowerCase().includes(e),z=!n||c.type===n,V=s==="all"||c.category===s,Q=(!a||c.tanggalIso>=a)&&(!o||c.tanggalIso<=o);return X&&z&&V&&Q});J(d),q(d)};w?.addEventListener("input",u),B?.addEventListener("change",u),i?.addEventListener("change",u),g?.addEventListener("change",E),y?.addEventListener("change",E);const P=document.getElementById("profileButton"),p=document.querySelector(".profile-wrapper"),A=document.getElementById("profileDropdown");P&&p&&A&&(P.addEventListener("click",e=>{e.stopPropagation(),p.classList.toggle("open")}),A.addEventListener("click",e=>{e.stopPropagation()}),document.addEventListener("click",()=>{p.classList.remove("open")}));const K=()=>{window.confirm("Apakah kamu yakin ingin keluar dari akun Viewer?")&&(window.location.href="/logout")},x=document.getElementById("logoutButton"),D=document.getElementById("dropdownLogout");x&&x.addEventListener("click",K),D&&D.addEventListener("click",K);const _=document.getElementById("sidebar"),f=document.getElementById("sidebarBackdrop"),M=document.getElementById("menuToggle"),O=document.querySelectorAll(".nav-link"),W=()=>{_.classList.add("open"),f.classList.add("show"),document.body.classList.add("nav-open")},h=()=>{_.classList.remove("open"),f.classList.remove("show"),document.body.classList.remove("nav-open")};M&&M.addEventListener("click",W),f&&f.addEventListener("click",h),O.forEach(e=>{e.addEventListener("click",()=>{window.innerWidth<=900&&h()})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(h(),p&&p.classList.remove("open"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&h()}),E()});
