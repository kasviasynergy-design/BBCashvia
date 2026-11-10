document.addEventListener("DOMContentLoaded",()=>{const N="/data/transaksi",K=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],S={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"};let i={},k="",L="all";const $=async n=>{let e;try{e=await fetch(n,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let t={};try{t=await e.json()}catch{}if(!e.ok)throw new Error(t?.message||"Gagal mengambil data laporan.");return{data:Array.isArray(t?.data)?t.data:[],ringkasan:t?.ringkasan??{}}},l=n=>String(n??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),C=n=>{const e=String(n||"").toLowerCase();return S[e]||n||"-"},M=n=>{const e=String(n??"").toLowerCase();return e==="pemasukan"||e==="masuk"||e==="m"?"Pemasukan":"Pengeluaran"},R=n=>{const e=String(n??"").slice(0,10),t=e.split("-");if(t.length!==3)return e||"-";const a=new Date(Number(t[0]),Number(t[1])-1,Number(t[2]));return Number.isNaN(a.getTime())?e:new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"short",year:"numeric"}).format(a)},m=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(n)||0),u=document.getElementById("periodFilter"),v=document.getElementById("statusFilter"),b=document.getElementById("laporanKasTableBody"),p=document.getElementById("tableCount"),w=document.getElementById("emptyState"),B=document.getElementById("rumusPemasukan"),I=document.getElementById("rumusPengeluaran"),P=document.getElementById("rumusSaldo"),x=n=>{const e={};return n.forEach(t=>{const s=String(t.tanggal??"").slice(0,10).split("-");if(s.length!==3||!s[0])return;const c=Number(s[0]),r=Number(s[1]);if(!c||r<1||r>12)return;const o=`${s[0]}-${s[1]}`;e[o]||(e[o]={kunci:o,tahun:c,bulan:r,period:`${K[r-1]} ${c}`,openingBalance:0,totalMasuk:0,totalKeluar:0,transactions:[]});const A=String(t.no_bukti||"TRX-"+(t.id_transaksi??""));if(e[o].transactions.some(G=>G.bukti===A))return;const D=M(t.jenis),E=Number(t.nominal_grup??t.nominal)||0;e[o].transactions.push({bukti:A,tanggal:R(t.tanggal),sortKey:new Date(c,r-1,Number(s[2])||1).getTime(),jenis:D,category:C(t.kategori),description:t.keterangan||"-",amount:E,jumlahRincian:Number(t.jumlah_rincian)||1}),D==="Pemasukan"?e[o].totalMasuk+=E:e[o].totalKeluar+=E}),Object.values(e).forEach(t=>{t.transactions.sort((a,s)=>a.sortKey-s.sortKey)}),e},F=()=>{const n=Object.keys(i).sort((t,a)=>t===a?0:t<a?-1:1);let e=0;return n.forEach(t=>{const a=i[t];a.openingBalance=e,e=e+a.totalMasuk-a.totalKeluar,a.closingBalance=e}),n},O=n=>{B&&(B.textContent=m(n?.totalMasuk??0)),I&&(I.textContent=m(n?.totalKeluar??0)),P&&(P.textContent=m(n?.closingBalance??0))},_=n=>{if(b){if(b.innerHTML="",n.length===0){w?.classList.add("show"),p&&(p.textContent="0");return}w?.classList.remove("show"),n.forEach((e,t)=>{const a=e.jenis==="Pemasukan",s=a?"success":"danger",c=a?"+":"-",r=e.jumlahRincian>1?` • ${e.jumlahRincian} iuran`:"",o=document.createElement("tr");o.innerHTML=`
                <td>
                    ${t+1}
                </td>

                <td>
                    <span class="mono-text">
                        ${l(e.tanggal)}
                    </span>
                </td>

                <td>
                    <span class="status-pill ${s}">
                        <span class="status-dot"></span>
                        ${e.jenis}
                    </span>
                </td>

                <td>
                    ${l(e.category)}
                </td>

                <td>
                    <span>
                        ${l(e.description)}
                    </span>

                    <div class="mono-text">
                        ${l(e.bukti)}${r}
                    </div>
                </td>

                <td>
                    <strong class="nominal">
                        ${c}${m(e.amount)}
                    </strong>
                </td>
            `,b.appendChild(o)}),p&&(p.textContent=n.length)}},q=()=>{if(!u)return;const n=Object.values(i).sort((e,t)=>e.kunci<t.kunci?1:-1);u.innerHTML=n.map(e=>`
                <option value="${l(e.kunci)}">
                    ${l(e.period)}
                </option>
            `).join(""),n.length>0&&(k=n[0].kunci),u.value=k},h=()=>{const n=u?.value||"all",e=n==="all"?i[k]??null:i[n]??null;O(e);const t=L,a=(e?.transactions??[]).filter(s=>t==="all"||s.jenis.toLowerCase()===t);_(a)};u?.addEventListener("change",h),v?.addEventListener("change",()=>{L=v.value||"all",h()});const T=document.getElementById("profileButton"),g=document.querySelector(".profile-wrapper"),j=document.getElementById("profileDropdown");T&&g&&j&&(T.addEventListener("click",n=>{n.stopPropagation(),g.classList.toggle("open")}),j.addEventListener("click",n=>{n.stopPropagation()}),document.addEventListener("click",()=>{g.classList.remove("open")}));const y=document.getElementById("sidebar"),f=document.getElementById("sidebarBackdrop"),H=document.getElementById("menuToggle"),J=document.querySelectorAll(".nav-link"),W=()=>{y?.classList.add("open"),f?.classList.add("show"),document.body.classList.add("nav-open")},d=()=>{y?.classList.remove("open"),f?.classList.remove("show"),document.body.classList.remove("nav-open")};H?.addEventListener("click",n=>{n.stopPropagation(),y?.classList.contains("open")?d():W()}),f?.addEventListener("click",d),J.forEach(n=>{n.addEventListener("click",()=>{window.innerWidth<=900&&d()})}),document.addEventListener("keydown",n=>{n.key==="Escape"&&(d(),g?.classList.remove("open"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&d()}),(async()=>{let n=[];try{n=(await $(N)).data}catch(e){console.error("Gagal memuat laporan kas:",e)}i=x(n),F(),q(),h()})()});
