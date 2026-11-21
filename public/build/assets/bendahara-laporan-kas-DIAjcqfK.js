document.addEventListener("DOMContentLoaded",()=>{const C=document.body.dataset.kelasLabel||"Kelas Saya",A=["Iuran","Kas","Pemasukan lainnya"],K=["Kebutuhan kelas","Perlengkapan kelas","Kegiatan kelas","Pengeluaran lainnya"],E=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];let T=[];async function et(){try{const t=await fetch("/bendahara/api/transaksi",{headers:{Accept:"application/json"},credentials:"same-origin"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();if(!a.success||!Array.isArray(a.data))throw new Error(a.message||"Respons transaksi tidak valid");const r=new Set;T=a.data.filter(n=>{const e=n.no_bukti||`id:${n.id_transaksi}`;return!e||r.has(e)?!1:(r.add(e),!0)}).map(n=>{const e=String(n.jenis||"").trim().toLowerCase(),s=["pengeluaran","keluar","k"].includes(e)?"keluar":"masuk",i=String(n.created_at||""),l=Number(n.nominal_grup??n.nominal??0)||0;return{id:n.no_bukti||String(n.id_transaksi??"-"),jenis:s,kategori:n.kategori||"-",keterangan:n.keterangan||n.kategori||"-",kelas:n.nama_kelas||"",tanggal:String(n.tanggal||i).substring(0,10),waktu:i.substring(11,16)||"",nominal:l,metode:n.metode==="TF"?"Transfer":"Tunai"}})}catch(t){console.warn("Gagal memuat transaksi dari server:",t),T=[],g("Gagal memuat data transaksi dari server.","error")}}const o=t=>document.querySelector(t);o("#sidebar");const N=o("#sidebarBackdrop"),_=o("#btnSidebar"),m=o("#profileButton"),y=o("#profileDropdown"),f=o("#filterMulai"),k=o("#filterSelesai"),d=o("#filterBulan"),p=o("#filterTahun"),b=o("#filterJenis"),v=o("#filterKategori"),D=o("#btnResetFilter"),F=o("#btnKosongkanFilter"),nt=o("#sumMasuk"),st=o("#sumKeluar"),rt=o("#sumSaldo"),ot=o("#sumJumlah"),it=o("#sumMasukNote"),lt=o("#sumKeluarNote");o("#sumSaldoNote");const ct=o("#sumJumlahNote"),P=o("#isiTabelLaporan"),R=o("#footTabelLaporan"),B=o("#emptyState"),I=o("#tabelInfo"),H=o("#barChart"),J=o("#chartColumns"),U=o("#chartYLabels"),O=o("#grafikKosong"),G=o("#btnCetak"),Y=o("#btnUnduhPdf"),q=o("#btnEkspor"),ut=o("#printPeriode"),L=o("#toast"),dt=o("#toastText"),V=o("#toastIcon");let c=[];function u(t){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(t||0)}function pt(t){const a=Math.abs(t||0);return a>=1e6?"Rp "+(a/1e6).toFixed(a%1e6===0?0:1).replace(".",",")+" jt":a>=1e3?"Rp "+(a/1e3).toFixed(a%1e3===0?0:1).replace(".",",")+" rb":u(a)}function $(t){return t?new Date(`${t}T00:00:00`).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}):"-"}function gt(t){return E[t]||""}function S(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function g(t,a="success"){L&&(dt.textContent=t,a==="error"?(V.textContent="error",L.classList.add("toast--error")):(V.textContent="check_circle",L.classList.remove("toast--error")),L.classList.add("is-show"),clearTimeout(g.timeout),g.timeout=setTimeout(()=>{L.classList.remove("is-show")},2500))}function mt(){document.body.classList.add("nav-open")}function w(){document.body.classList.remove("nav-open")}_&&_.addEventListener("click",()=>{document.body.classList.contains("nav-open")?w():mt()}),N&&N.addEventListener("click",w),document.querySelectorAll(".side-link").forEach(t=>{t.addEventListener("click",()=>{window.innerWidth<=1024&&w()})}),window.addEventListener("resize",()=>{window.innerWidth>=1025&&w()}),m&&m.addEventListener("click",t=>{t.stopPropagation();const a=y.classList.toggle("is-open");m.setAttribute("aria-expanded",a?"true":"false")}),document.addEventListener("click",t=>{y&&m&&!y.contains(t.target)&&!m.contains(t.target)&&(y.classList.remove("is-open"),m.setAttribute("aria-expanded","false"))});async function M(){if(!v)return;const t=b.value;let a=[];try{const r=await fetch("/bendahara/api/transaksi/kategori",{headers:{Accept:"application/json"},credentials:"same-origin"});if(r.ok){const n=await r.json();n.success&&n.data&&(t==="masuk"?a=n.data.masuk||[]:t==="keluar"?a=n.data.keluar||[]:a=n.data.semua||[])}}catch(r){console.warn("Gagal memuat kategori dari server:",r)}a.length||(t==="masuk"?a=[...A]:t==="keluar"?a=[...K]:a=[...new Set([...A,...K])]),v.innerHTML=`
            <option value="">
                Semua Kategori
            </option>
        `,a.forEach(r=>{const n=document.createElement("option");n.value=r.value||r,n.textContent=r.label||r,v.appendChild(n)})}function ft(){if(d){d.innerHTML=`
                <option value="">
                    Semua Bulan
                </option>
            `;for(let t=0;t<12;t++){const a=document.createElement("option");a.value=String(t+1).padStart(2,"0"),a.textContent=gt(t),d.appendChild(a)}}if(p){const t=[...new Set(T.map(a=>a.tanggal.substring(0,4)))].sort();p.innerHTML=`
                <option value="">
                    Semua Tahun
                </option>
            `,t.forEach(a=>{const r=document.createElement("option");r.value=a,r.textContent=a,p.appendChild(r)})}}function x(){const t=f.value,a=k.value,r=d.value,n=p.value,e=b.value,s=v.value;c=T.filter(i=>!(t&&i.tanggal<t||a&&i.tanggal>a||r&&i.tanggal.substring(5,7)!==r||n&&i.tanggal.substring(0,4)!==n||e&&i.jenis!==e||s&&i.kategori!==s)).sort((i,l)=>`${i.tanggal} ${i.waktu}`.localeCompare(`${l.tanggal} ${l.waktu}`)),kt(),ht(),bt(),vt()}function kt(){const t=c.filter(e=>e.jenis==="masuk").reduce((e,s)=>e+s.nominal,0),a=c.filter(e=>e.jenis==="keluar").reduce((e,s)=>e+s.nominal,0),r=t-a,n=c.length;nt.textContent=u(t),st.textContent=u(a),rt.textContent=u(r),ot.textContent=n,it.textContent=`${c.filter(e=>e.jenis==="masuk").length} transaksi pemasukan`,lt.textContent=`${c.filter(e=>e.jenis==="keluar").length} transaksi pengeluaran`,ct.textContent=`Transaksi kelas ${C}`}function ht(){if(J.innerHTML="",U.innerHTML="",!c.length){H.classList.add("is-hidden"),O.classList.add("is-show");return}H.classList.remove("is-hidden"),O.classList.remove("is-show");const t={};c.forEach(s=>{const i=s.tanggal.substring(0,7);t[i]||(t[i]={masuk:0,keluar:0}),s.jenis==="masuk"?t[i].masuk+=s.nominal:t[i].keluar+=s.nominal});const a=Object.keys(t).sort(),r=Math.max(...a.flatMap(s=>[t[s].masuk,t[s].keluar]),1),n=Math.ceil(r/1e5)*1e5,e=4;for(let s=e;s>=0;s--){const i=n*(s/e),l=document.createElement("span");l.textContent=pt(i),U.appendChild(l)}a.forEach(s=>{const i=t[s],l=document.createElement("div");l.className="barchart__col";const h=document.createElement("div");h.className="barchart__pair";const at=W(i.masuk,n,"in","Pemasukan"),St=W(i.keluar,n,"out","Pengeluaran"),j=document.createElement("span");j.className="barchart__mon";const Ct=Number(s.substring(5,7))-1;j.textContent=`${E[Ct].substring(0,3)} ${s.substring(0,4)}`,h.appendChild(at),h.appendChild(St),l.appendChild(h),l.appendChild(j),J.appendChild(l)})}function W(t,a,r,n){const e=document.createElement("div");e.className=`barchart__bar barchart__bar--${r}`;const s=t>0?Math.max(4,t/a*100):2;e.style.height=`${s}%`;const i=document.createElement("span");return i.className="barchart__tip",i.textContent=`${n}: ${u(t)}`,e.appendChild(i),e}function bt(){if(P.innerHTML="",R.innerHTML="",!c.length){B.classList.add("is-show"),I.textContent="Menampilkan 0 transaksi";return}B.classList.remove("is-show");let t=0,a=0,r=0;c.forEach(e=>{e.jenis==="masuk"?(t+=e.nominal,a+=e.nominal):(t-=e.nominal,r+=e.nominal);const s=document.createElement("tr"),i=e.jenis==="masuk"?u(e.nominal):"-",l=e.jenis==="keluar"?u(e.nominal):"-";s.innerHTML=`

                <td>

                    <div class="table-date">

                        <strong>
                            ${S($(e.tanggal))}
                        </strong>

                        <span>
                            ${S(e.waktu)}
                        </span>

                    </div>

                </td>


                <td>

                    <div class="table-description">

                        <strong>
                            ${S(e.keterangan)}
                        </strong>

                        <span>
                            ${S(e.id)}
                        </span>

                    </div>

                </td>


                <td>

                    <span
                        class="
                            category-chip
                            category-chip--${e.jenis}
                        "
                    >
                        ${S(e.kategori)}
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
                        ${u(t)}
                    </span>

                </td>

            `,P.appendChild(s)});const n=a-r;R.innerHTML=`

            <tr class="table-total">

                <td colspan="3">

                    Total

                </td>

                <td>

                    <strong class="money money--in">
                        ${u(a)}
                    </strong>

                </td>

                <td>

                    <strong class="money money--out">
                        ${u(r)}
                    </strong>

                </td>

                <td>

                    <strong class="balance">
                        ${u(n)}
                    </strong>

                </td>

            </tr>

        `,I.textContent=`Menampilkan ${c.length} transaksi kelas ${C}`}function vt(){const t=f.value,a=k.value,r=d.value,n=p.value;let e="Semua periode";t&&a?e=`${$(t)} - ${$(a)}`:t?e=`Mulai ${$(t)}`:a?e=`Sampai ${$(a)}`:r&&n?e=`${E[Number(r)-1]} ${n}`:r?e=`Bulan ${E[Number(r)-1]}`:n&&(e=`Tahun ${n}`),ut.textContent=`${e} • ${C}`}function z(){f.value="",k.value="",d.value="",p.value="",b.value="",M(),x(),g("Filter laporan telah direset.")}function Lt(){if(!c.length){g("Tidak ada data untuk diekspor.","error");return}let t=0;const a=[];a.push(["Tanggal","ID Transaksi","Keterangan","Kelas","Kategori","Jenis","Pemasukan","Pengeluaran","Saldo"]),c.forEach(l=>{l.jenis==="masuk"?t+=l.nominal:t-=l.nominal,a.push([l.tanggal,l.id,l.keterangan,l.kelas,l.kategori,l.jenis==="masuk"?"Pemasukan":"Pengeluaran",l.jenis==="masuk"?l.nominal:0,l.jenis==="keluar"?l.nominal:0,t])});const r=a.map(l=>l.map(h=>`"${String(h??"").replace(/"/g,'""')}"`).join(";")).join(`
`),n=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),e=URL.createObjectURL(n),s=document.createElement("a"),i=new Date().toISOString().slice(0,10);s.href=e,s.download=`laporan-kas-${C.toLowerCase().replace(/\s+/g,"-")}-${i}.csv`,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(e),g("Laporan berhasil diekspor.")}function $t(){const t=[],a=(e,s)=>{t.push(`${e}=${encodeURIComponent(s)}`)},r=f?f.value:"",n=k?k.value:"";if(r&&n)a("dari",r),a("sampai",n);else if(r)a("dari",r);else if(n)a("sampai",n);else{const e=d?d.value:"",s=p?p.value:"";if(e&&s){const i=new Date(Number(s),Number(e)-1,1),l=new Date(Number(s),Number(e),0);a("dari",`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`),a("sampai",`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")}`)}else if(s)a("dari",`${s}-01-01`),a("sampai",`${s}-12-31`);else if(e){const i=new Date().getFullYear(),l=new Date(i,Number(e),0);a("dari",`${i}-${String(e).padStart(2,"0")}-01`),a("sampai",`${i}-${String(l.getMonth()+1).padStart(2,"0")}-${String(l.getDate()).padStart(2,"0")}`)}}return t.length?`?${t.join("&")}`:""}function Q(t,a){if(!c.length){g(a,"error");return}window.location.href=t+$t()}G&&G.addEventListener("click",()=>{Q("/laporan-kas/cetak","Tidak ada data untuk dicetak.")}),Y&&Y.addEventListener("click",()=>{Q("/laporan-kas/pdf","Tidak ada data untuk diunduh.")}),q&&q.addEventListener("click",Lt),b&&b.addEventListener("change",()=>{M(),x()}),[f,k,d,p,v].forEach(t=>{t&&t.addEventListener("change",x)}),D&&D.addEventListener("click",z),F&&F.addEventListener("click",z);function X(){window.location.href="/"}const Z=o("#btnSidebarLogout"),tt=o("#btnProfileLogout");Z&&Z.addEventListener("click",X),tt&&tt.addEventListener("click",X),(async()=>(await et(),ft(),await M(),x()))()});
