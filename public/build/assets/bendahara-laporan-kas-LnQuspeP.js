document.addEventListener("DOMContentLoaded",()=>{const f="XI RPL 1",$=["Iuran","Kas","Pemasukan lainnya"],K=["Kebutuhan kelas","Perlengkapan kelas","Kegiatan kelas","Pengeluaran lainnya"],w=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],x=[{id:"TRX-001",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas September",kelas:"XI RPL 1",tanggal:"2026-09-01",waktu:"07:30",nominal:45e4,metode:"Tunai"},{id:"TRX-002",jenis:"masuk",kategori:"Kas",keterangan:"Kas kelas mingguan",kelas:"XI RPL 1",tanggal:"2026-09-05",waktu:"08:10",nominal:15e4,metode:"Tunai"},{id:"TRX-003",jenis:"keluar",kategori:"Perlengkapan kelas",keterangan:"Pembelian spidol dan penghapus papan",kelas:"XI RPL 1",tanggal:"2026-09-07",waktu:"13:20",nominal:85e3,metode:"Tunai"},{id:"TRX-004",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas September",kelas:"XI RPL 1",tanggal:"2026-09-10",waktu:"07:25",nominal:375e3,metode:"Transfer"},{id:"TRX-005",jenis:"keluar",kategori:"Kebutuhan kelas",keterangan:"Pembelian air minum kelas",kelas:"XI RPL 1",tanggal:"2026-09-12",waktu:"10:15",nominal:65e3,metode:"Tunai"},{id:"TRX-006",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas September",kelas:"XI RPL 1",tanggal:"2026-09-15",waktu:"07:40",nominal:525e3,metode:"Transfer"},{id:"TRX-007",jenis:"keluar",kategori:"Kegiatan kelas",keterangan:"Kebutuhan kegiatan kelas",kelas:"XI RPL 1",tanggal:"2026-09-18",waktu:"11:30",nominal:175e3,metode:"Transfer"},{id:"TRX-008",jenis:"masuk",kategori:"Kas",keterangan:"Tambahan kas kelas",kelas:"XI RPL 1",tanggal:"2026-09-20",waktu:"08:00",nominal:2e5,metode:"Tunai"},{id:"TRX-009",jenis:"keluar",kategori:"Perlengkapan kelas",keterangan:"Pembelian alat kebersihan",kelas:"XI RPL 1",tanggal:"2026-09-22",waktu:"14:00",nominal:9e4,metode:"Tunai"},{id:"TRX-010",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas September",kelas:"XI RPL 1",tanggal:"2026-09-25",waktu:"07:35",nominal:425e3,metode:"Transfer"},{id:"TRX-011",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas Oktober",kelas:"XI RPL 1",tanggal:"2026-10-01",waktu:"07:20",nominal:5e5,metode:"Transfer"},{id:"TRX-012",jenis:"masuk",kategori:"Kas",keterangan:"Kas kelas mingguan",kelas:"XI RPL 1",tanggal:"2026-10-03",waktu:"08:05",nominal:175e3,metode:"Tunai"},{id:"TRX-013",jenis:"keluar",kategori:"Kebutuhan kelas",keterangan:"Pembelian konsumsi rapat kelas",kelas:"XI RPL 1",tanggal:"2026-10-04",waktu:"12:10",nominal:12e4,metode:"Tunai"},{id:"TRX-014",jenis:"masuk",kategori:"Iuran",keterangan:"Iuran kelas Oktober",kelas:"XI RPL 1",tanggal:"2026-10-06",waktu:"07:45",nominal:45e4,metode:"Transfer"},{id:"TRX-015",jenis:"keluar",kategori:"Kegiatan kelas",keterangan:"Kebutuhan kegiatan kelas",kelas:"XI RPL 1",tanggal:"2026-10-08",waktu:"10:30",nominal:15e4,metode:"Transfer"},{id:"TRX-016",jenis:"masuk",kategori:"Pemasukan lainnya",keterangan:"Pengembalian dana kegiatan",kelas:"XI RPL 1",tanggal:"2026-10-10",waktu:"09:15",nominal:1e5,metode:"Transfer"},{id:"TRX-017",jenis:"keluar",kategori:"Perlengkapan kelas",keterangan:"Pembelian kertas dan tinta",kelas:"XI RPL 1",tanggal:"2026-10-12",waktu:"13:40",nominal:11e4,metode:"Tunai"}],t=a=>document.querySelector(a);t("#sidebar");const X=t("#sidebarBackdrop"),y=t("#btnSidebar"),g=t("#profileButton"),R=t("#profileDropdown"),I=t("#filterMulai"),j=t("#filterSelesai"),d=t("#filterBulan"),k=t("#filterTahun"),h=t("#filterJenis"),b=t("#filterKategori"),M=t("#btnResetFilter"),N=t("#btnKosongkanFilter"),aa=t("#sumMasuk"),ea=t("#sumKeluar"),na=t("#sumSaldo"),ta=t("#sumJumlah"),sa=t("#sumMasukNote"),oa=t("#sumKeluarNote");t("#sumSaldoNote");const ra=t("#sumJumlahNote"),A=t("#isiTabelLaporan"),F=t("#footTabelLaporan"),_=t("#emptyState"),B=t("#tabelInfo"),D=t("#barChart"),H=t("#chartColumns"),O=t("#chartYLabels"),J=t("#grafikKosong"),U=t("#btnCetak"),q=t("#btnEkspor"),ia=t("#printPeriode"),L=t("#toast"),la=t("#toastText"),G=t("#toastIcon");let u=[];function c(a){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(a||0)}function ua(a){const e=Math.abs(a||0);return e>=1e6?"Rp "+(e/1e6).toFixed(e%1e6===0?0:1).replace(".",",")+" jt":e>=1e3?"Rp "+(e/1e3).toFixed(e%1e3===0?0:1).replace(".",",")+" rb":c(e)}function T(a){return a?new Date(`${a}T00:00:00`).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):"-"}function ca(a){return w[a]||""}function v(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(a,e="success"){L&&(la.textContent=a,e==="error"?(G.textContent="error",L.classList.add("toast--error")):(G.textContent="check_circle",L.classList.remove("toast--error")),L.classList.add("is-show"),clearTimeout(m.timeout),m.timeout=setTimeout(()=>{L.classList.remove("is-show")},2500))}function da(){document.body.classList.add("nav-open")}function P(){document.body.classList.remove("nav-open")}y&&y.addEventListener("click",()=>{document.body.classList.contains("nav-open")?P():da()}),X&&X.addEventListener("click",P),document.querySelectorAll(".side-link").forEach(a=>{a.addEventListener("click",()=>{window.innerWidth<=1024&&P()})}),window.addEventListener("resize",()=>{window.innerWidth>=1025&&P()}),g&&g.addEventListener("click",a=>{a.stopPropagation();const e=R.classList.toggle("is-open");g.setAttribute("aria-expanded",e?"true":"false")}),document.addEventListener("click",a=>{R&&g&&!R.contains(a.target)&&!g.contains(a.target)&&(R.classList.remove("is-open"),g.setAttribute("aria-expanded","false"))});async function E(){if(!b)return;const a=h.value;let e=[];try{const s=await fetch("/bendahara/api/transaksi/kategori",{headers:{Accept:"application/json"},credentials:"same-origin"});if(s.ok){const r=await s.json();r.success&&r.data&&(a==="masuk"?e=r.data.masuk||[]:a==="keluar"?e=r.data.keluar||[]:e=r.data.semua||[])}}catch(s){console.warn("Gagal memuat kategori dari server:",s)}e.length||(a==="masuk"?e=[...$]:a==="keluar"?e=[...K]:e=[...new Set([...$,...K])]),b.innerHTML=`
            <option value="">
                Semua Kategori
            </option>
        `,e.forEach(s=>{const r=document.createElement("option");r.value=s.value||s,r.textContent=s.label||s,b.appendChild(r)})}function ka(){if(d){d.innerHTML=`
                <option value="">
                    Semua Bulan
                </option>
            `;for(let a=0;a<12;a++){const e=document.createElement("option");e.value=String(a+1).padStart(2,"0"),e.textContent=ca(a),d.appendChild(e)}}if(k){const a=[...new Set(x.map(e=>e.tanggal.substring(0,4)))].sort();k.innerHTML=`
                <option value="">
                    Semua Tahun
                </option>
            `,a.forEach(e=>{const s=document.createElement("option");s.value=e,s.textContent=e,k.appendChild(s)})}}function C(){const a=I.value,e=j.value,s=d.value,r=k.value,n=h.value,o=b.value;u=x.filter(i=>i.kelas===f).filter(i=>!(a&&i.tanggal<a||e&&i.tanggal>e||s&&i.tanggal.substring(5,7)!==s||r&&i.tanggal.substring(0,4)!==r||n&&i.jenis!==n||o&&i.kategori!==o)).sort((i,l)=>`${i.tanggal} ${i.waktu}`.localeCompare(`${l.tanggal} ${l.waktu}`)),ga(),ma(),pa(),fa()}function ga(){const a=u.filter(n=>n.jenis==="masuk").reduce((n,o)=>n+o.nominal,0),e=u.filter(n=>n.jenis==="keluar").reduce((n,o)=>n+o.nominal,0),s=a-e,r=u.length;aa.textContent=c(a),ea.textContent=c(e),na.textContent=c(s),ta.textContent=r,sa.textContent=`${u.filter(n=>n.jenis==="masuk").length} transaksi pemasukan`,oa.textContent=`${u.filter(n=>n.jenis==="keluar").length} transaksi pengeluaran`,ra.textContent=`Transaksi kelas ${f}`}function ma(){if(H.innerHTML="",O.innerHTML="",!u.length){D.classList.add("is-hidden"),J.classList.add("is-show");return}D.classList.remove("is-hidden"),J.classList.remove("is-show");const a={};u.forEach(o=>{const i=o.tanggal.substring(0,7);a[i]||(a[i]={masuk:0,keluar:0}),o.jenis==="masuk"?a[i].masuk+=o.nominal:a[i].keluar+=o.nominal});const e=Object.keys(a).sort(),s=Math.max(...e.flatMap(o=>[a[o].masuk,a[o].keluar]),1),r=Math.ceil(s/1e5)*1e5,n=4;for(let o=n;o>=0;o--){const i=r*(o/n),l=document.createElement("span");l.textContent=ua(i),O.appendChild(l)}e.forEach(o=>{const i=a[o],l=document.createElement("div");l.className="barchart__col";const p=document.createElement("div");p.className="barchart__pair";const Z=V(i.masuk,r,"in","Pemasukan"),ba=V(i.keluar,r,"out","Pengeluaran"),S=document.createElement("span");S.className="barchart__mon";const La=Number(o.substring(5,7))-1;S.textContent=`${w[La].substring(0,3)} ${o.substring(0,4)}`,p.appendChild(Z),p.appendChild(ba),l.appendChild(p),l.appendChild(S),H.appendChild(l)})}function V(a,e,s,r){const n=document.createElement("div");n.className=`barchart__bar barchart__bar--${s}`;const o=a>0?Math.max(4,a/e*100):2;n.style.height=`${o}%`;const i=document.createElement("span");return i.className="barchart__tip",i.textContent=`${r}: ${c(a)}`,n.appendChild(i),n}function pa(){if(A.innerHTML="",F.innerHTML="",!u.length){_.classList.add("is-show"),B.textContent="Menampilkan 0 transaksi";return}_.classList.remove("is-show");let a=0,e=0,s=0;u.forEach(n=>{n.jenis==="masuk"?(a+=n.nominal,e+=n.nominal):(a-=n.nominal,s+=n.nominal);const o=document.createElement("tr"),i=n.jenis==="masuk"?c(n.nominal):"-",l=n.jenis==="keluar"?c(n.nominal):"-";o.innerHTML=`

                <td>

                    <div class="table-date">

                        <strong>
                            ${v(T(n.tanggal))}
                        </strong>

                        <span>
                            ${v(n.waktu)}
                        </span>

                    </div>

                </td>


                <td>

                    <div class="table-description">

                        <strong>
                            ${v(n.keterangan)}
                        </strong>

                        <span>
                            ${v(n.id)}
                        </span>

                    </div>

                </td>


                <td>

                    <span
                        class="
                            category-chip
                            category-chip--${n.jenis}
                        "
                    >
                        ${v(n.kategori)}
                    </span>

                </td>


                <td>

                    <span class="money money--in">
                        ${i}
                    </span>

                </td>


                <td>

                    <span class="money money--out">
                        ${l}
                    </span>

                </td>


                <td>

                    <span class="balance">
                        ${c(a)}
                    </span>

                </td>

            `,A.appendChild(o)});const r=e-s;F.innerHTML=`

            <tr class="table-total">

                <td colspan="3">

                    Total

                </td>

                <td>

                    <strong class="money money--in">
                        ${c(e)}
                    </strong>

                </td>

                <td>

                    <strong class="money money--out">
                        ${c(s)}
                    </strong>

                </td>

                <td>

                    <strong class="balance">
                        ${c(r)}
                    </strong>

                </td>

            </tr>

        `,B.textContent=`Menampilkan ${u.length} transaksi kelas ${f}`}function fa(){const a=I.value,e=j.value,s=d.value,r=k.value;let n="Semua periode";a&&e?n=`${T(a)} - ${T(e)}`:a?n=`Mulai ${T(a)}`:e?n=`Sampai ${T(e)}`:s&&r?n=`${w[Number(s)-1]} ${r}`:s?n=`Bulan ${w[Number(s)-1]}`:r&&(n=`Tahun ${r}`),ia.textContent=`${n} • ${f}`}function W(){I.value="",j.value="",d.value="",k.value="",h.value="",E(),C(),m("Filter laporan telah direset.")}function ha(){if(!u.length){m("Tidak ada data untuk diekspor.","error");return}let a=0;const e=[];e.push(["Tanggal","ID Transaksi","Keterangan","Kelas","Kategori","Jenis","Pemasukan","Pengeluaran","Saldo"]),u.forEach(l=>{l.jenis==="masuk"?a+=l.nominal:a-=l.nominal,e.push([l.tanggal,l.id,l.keterangan,l.kelas,l.kategori,l.jenis==="masuk"?"Pemasukan":"Pengeluaran",l.jenis==="masuk"?l.nominal:0,l.jenis==="keluar"?l.nominal:0,a])});const s=e.map(l=>l.map(p=>`"${String(p??"").replace(/"/g,'""')}"`).join(";")).join(`
`),r=new Blob(["\uFEFF"+s],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(r),o=document.createElement("a"),i=new Date().toISOString().slice(0,10);o.href=n,o.download=`laporan-kas-${f.toLowerCase().replace(/\s+/g,"-")}-${i}.csv`,document.body.appendChild(o),o.click(),o.remove(),URL.revokeObjectURL(n),m("Laporan berhasil diekspor.")}U&&U.addEventListener("click",()=>{if(!u.length){m("Tidak ada data untuk dicetak.","error");return}window.print()}),q&&q.addEventListener("click",ha),h&&h.addEventListener("change",()=>{E(),C()}),[I,j,d,k,b].forEach(a=>{a&&a.addEventListener("change",C)}),M&&M.addEventListener("click",W),N&&N.addEventListener("click",W);function Y(){window.location.href="/"}const z=t("#btnSidebarLogout"),Q=t("#btnProfileLogout");z&&z.addEventListener("click",Y),Q&&Q.addEventListener("click",Y),ka(),E(),C()});
