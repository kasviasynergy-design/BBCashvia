document.addEventListener("DOMContentLoaded",()=>{const j="/data/transaksi",A=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],K={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"};let l={},m="",L="all";const C=async t=>{let e;try{e=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let n={};try{n=await e.json()}catch{}if(!e.ok)throw new Error(n?.message||"Gagal mengambil data laporan.");return{data:Array.isArray(n?.data)?n.data:[],ringkasan:n?.ringkasan??{}}},c=t=>String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),M=t=>{const e=String(t||"").toLowerCase();return K[e]||t||"-"},R=t=>{const e=String(t??"").toLowerCase();return e==="pemasukan"||e==="masuk"||e==="m"?"Pemasukan":"Pengeluaran"},x=t=>{const e=String(t??"").slice(0,10),n=e.split("-");if(n.length!==3)return e||"-";const a=new Date(Number(n[0]),Number(n[1])-1,Number(n[2]));return Number.isNaN(a.getTime())?e:new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"short",year:"numeric"}).format(a)},p=t=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0),u=document.getElementById("periodFilter"),v=document.getElementById("statusFilter"),b=document.getElementById("laporanKasTableBody"),g=document.getElementById("tableCount"),w=document.getElementById("emptyState"),B=document.getElementById("rumusPemasukan"),$=document.getElementById("rumusPengeluaran"),I=document.getElementById("rumusSaldo"),F=document.getElementById("btnCetak"),q=document.getElementById("btnUnduhPdf"),O=()=>{const t=new URLSearchParams,e=u?.value||m||"",n=String(e).split("-");if(n.length===2&&n[0]&&n[1]){const a=Number(n[0]),s=Number(n[1]);if(a&&s>=1&&s<=12){const o=new Date(a,s,0).getDate();t.set("dari",`${n[0]}-${n[1]}-01`),t.set("sampai",`${n[0]}-${n[1]}-${String(o).padStart(2,"0")}`)}}return t.toString()},P=t=>{const e=O();window.location.href=e?`${t}?${e}`:t};F?.addEventListener("click",()=>P("/laporan-kas/cetak")),q?.addEventListener("click",()=>P("/laporan-kas/pdf"));const _=t=>{const e={};return t.forEach(n=>{const s=String(n.tanggal??"").slice(0,10).split("-");if(s.length!==3||!s[0])return;const o=Number(s[0]),i=Number(s[1]);if(!o||i<1||i>12)return;const r=`${s[0]}-${s[1]}`;e[r]||(e[r]={kunci:r,tahun:o,bulan:i,period:`${A[i-1]} ${o}`,openingBalance:0,totalMasuk:0,totalKeluar:0,transactions:[]});const N=String(n.no_bukti||"TRX-"+(n.id_transaksi??""));if(e[r].transactions.some(Q=>Q.bukti===N))return;const T=R(n.jenis),E=Number(n.nominal_grup??n.nominal)||0;e[r].transactions.push({bukti:N,tanggal:x(n.tanggal),sortKey:new Date(o,i-1,Number(s[2])||1).getTime(),jenis:T,category:M(n.kategori),description:n.keterangan||"-",amount:E,jumlahRincian:Number(n.jumlah_rincian)||1}),T==="Pemasukan"?e[r].totalMasuk+=E:e[r].totalKeluar+=E}),Object.values(e).forEach(n=>{n.transactions.sort((a,s)=>a.sortKey-s.sortKey)}),e},U=()=>{const t=Object.keys(l).sort((n,a)=>n===a?0:n<a?-1:1);let e=0;return t.forEach(n=>{const a=l[n];a.openingBalance=e,e=e+a.totalMasuk-a.totalKeluar,a.closingBalance=e}),t},H=t=>{B&&(B.textContent=p(t?.totalMasuk??0)),$&&($.textContent=p(t?.totalKeluar??0)),I&&(I.textContent=p(t?.closingBalance??0))},J=t=>{if(b){if(b.innerHTML="",t.length===0){w?.classList.add("show"),g&&(g.textContent="0");return}w?.classList.remove("show"),t.forEach((e,n)=>{const a=e.jenis==="Pemasukan",s=a?"success":"danger",o=a?"+":"-",i=e.jumlahRincian>1?` • ${e.jumlahRincian} iuran`:"",r=document.createElement("tr");r.innerHTML=`
                <td>
                    ${n+1}
                </td>

                <td>
                    <span class="mono-text">
                        ${c(e.tanggal)}
                    </span>
                </td>

                <td>
                    <span class="status-pill ${s}">
                        <span class="status-dot"></span>
                        ${e.jenis}
                    </span>
                </td>

                <td>
                    ${c(e.category)}
                </td>

                <td>
                    <span>
                        ${c(e.description)}
                    </span>

                    <div class="mono-text">
                        ${c(e.bukti)}${i}
                    </div>
                </td>

                <td>
                    <strong class="nominal">
                        ${o}${p(e.amount)}
                    </strong>
                </td>
            `,b.appendChild(r)}),g&&(g.textContent=t.length)}},W=()=>{if(!u)return;const t=Object.values(l).sort((e,n)=>e.kunci<n.kunci?1:-1);u.innerHTML=t.map(e=>`
                <option value="${c(e.kunci)}">
                    ${c(e.period)}
                </option>
            `).join(""),t.length>0&&(m=t[0].kunci),u.value=m},h=()=>{const t=u?.value||"all",e=t==="all"?l[m]??null:l[t]??null;H(e);const n=L,a=(e?.transactions??[]).filter(s=>n==="all"||s.jenis.toLowerCase()===n);J(a)};u?.addEventListener("change",h),v?.addEventListener("change",()=>{L=v.value||"all",h()});const S=document.getElementById("profileButton"),k=document.querySelector(".profile-wrapper"),D=document.getElementById("profileDropdown");S&&k&&D&&(S.addEventListener("click",t=>{t.stopPropagation(),k.classList.toggle("open")}),D.addEventListener("click",t=>{t.stopPropagation()}),document.addEventListener("click",()=>{k.classList.remove("open")}));const y=document.getElementById("sidebar"),f=document.getElementById("sidebarBackdrop"),G=document.getElementById("menuToggle"),X=document.querySelectorAll(".nav-link"),z=()=>{y?.classList.add("open"),f?.classList.add("show"),document.body.classList.add("nav-open")},d=()=>{y?.classList.remove("open"),f?.classList.remove("show"),document.body.classList.remove("nav-open")};G?.addEventListener("click",t=>{t.stopPropagation(),y?.classList.contains("open")?d():z()}),f?.addEventListener("click",d),X.forEach(t=>{t.addEventListener("click",()=>{window.innerWidth<=900&&d()})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(d(),k?.classList.remove("open"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&d()}),(async()=>{let t=[];try{t=(await C(j)).data}catch(e){console.error("Gagal memuat laporan kas:",e)}l=_(t),U(),W(),h()})()});
