import{a as G,i as U,s as F}from"./admin-filter-kelas-BaTSLq81.js";(function(){const y="/admin/api/transaksi",C=[{value:"Iuran",label:"Iuran"},{value:"kas",label:"Kas"},{value:"pemasukan lainnya",label:"Pemasukan Lainnya"},{value:"kebutuhan kelas",label:"Kebutuhan Kelas"},{value:"perlengkapan kelas",label:"Perlengkapan Kelas"},{value:"kegiatan kelas",label:"Kegiatan Kelas"},{value:"pengeluaran lainnya",label:"Pengeluaran Lainnya"}],v=["Iuran","kas","pemasukan lainnya"],L=["kebutuhan kelas","perlengkapan kelas","kegiatan kelas","pengeluaran lainnya"],h=a=>{const e=C.find(t=>t.value.toLowerCase()===String(a??"").toLowerCase());return e?e.label:String(a??"")};let p=[];const K=async(a,e={})=>{let t;try{t=await fetch(a,{...e,headers:{Accept:"application/json",...e.headers||{}},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let l={};try{l=await t.json()}catch{}if(!t.ok)throw new Error(l?.message||"Gagal memuat data transaksi.");return l},$=a=>{const e=String(a.jenis??"").toUpperCase(),t=String(a.tanggal_format??a.tanggal??"").slice(0,10);let l=String(a.waktu??"").trim();if(!l&&a.created_at){const m=String(a.created_at).match(/[T ](\d{2}):(\d{2})/);m&&(l=m[1]+":"+m[2])}const s=Number(a.nominal)||0,r=Number(a.uang_diterima)||s,i=Array.isArray(a.rincian)?a.rincian:[],o=Number(a.nominal_grup)>0?Number(a.nominal_grup):s,u=Number(a.uang_diterima_grup)>0?Number(a.uang_diterima_grup):r;return{id:a.no_bukti||"TRX-"+(a.id_transaksi??""),no_bukti:a.no_bukti??"",id_transaksi:a.id_transaksi??null,jenis:e==="PENGELUARAN"||e==="K"?"keluar":"masuk",kategori:a.kategori??"",keterangan:a.keterangan??"",kelas:a.nama_kelas??"",tanggal:t,waktu:l||"-",tagihan:o,diterima:u,petugas:a.dicatat_oleh??a.pic??a.nama_pembayar??"",rincian:i,jumlah_rincian:Number(a.jumlah_rincian)>0?Number(a.jumlah_rincian):i.length,status_pembayaran:a.status_pembayaran??null,sisa_tagihan:a.sisa_tagihan!==null&&a.sisa_tagihan!==void 0?Number(a.sisa_tagihan):null}},S=async()=>{const a=n("filterKelasRiwayat");if(a){a.value=G();try{const e=await K("/data/kelas"),t=Array.isArray(e?.data)?e.data:[];U(a,t)}catch(e){console.error("Gagal memuat daftar kelas:",e)}}},f=async()=>{const a=n("filterKelasRiwayat"),e=a&&a.value!=="semua"?a.value:"",t=e?`${y}?id_kelas=${encodeURIComponent(e)}`:y;F(a?.value);try{const l=await K(t),s=Array.isArray(l.data)?l.data:[],r=new Map;s.forEach(i=>{const o=i.no_bukti||"TRX-"+(i.id_transaksi??"");if(!r.has(o)){r.set(o,i);return}const u=r.get(o);(!Array.isArray(u.rincian)||u.rincian.length===0)&&Array.isArray(i.rincian)&&(u.rincian=i.rincian,u.nominal_grup=i.nominal_grup,u.uang_diterima_grup=i.uang_diterima_grup,u.jumlah_rincian=i.jumlah_rincian)}),p=Array.from(r.values()).map($),T(),b(),g()}catch(l){console.error("Gagal memuat data transaksi:",l),p=[],g()}},n=a=>document.getElementById(a),c=a=>"Rp "+(Number(a)||0).toLocaleString("id-ID"),A=a=>{const e=String(a??"").slice(0,10).split("-");if(e.length!==3||!e[0])return"-";const t=new Date(Number(e[0]),Number(e[1])-1,Number(e[2]));return Number.isNaN(t.getTime())?String(a):t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},d=a=>String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),N=(a,e)=>Math.max(0,(Number(e)||0)-(Number(a)||0)),k=(a,e)=>Math.min(Number(a)||0,Number(e)||0),x={iuran:"chip--iuran",kas:"chip--kas","pemasukan lainnya":"chip--masuk-lain","kebutuhan kelas":"chip--butuh","perlengkapan kelas":"chip--perlengkapan","kegiatan kelas":"chip--kegiatan","pengeluaran lainnya":"chip--keluar-lain"},R=a=>x[String(a??"").toLowerCase()]||"chip--keluar-lain",E=a=>{const e=n(a);e&&(e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},_=a=>{const e=n(a);e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},b=()=>{const a=n("filterJenis").value,e=n("filterKategori"),t=e.value,l=a==="masuk"?v:a==="keluar"?L:[...v,...L];e.innerHTML='<option value="semua">Semua Kategori</option>'+l.map(s=>`<option value="${d(s)}">${d(h(s))}</option>`).join(""),[...e.options].some(s=>s.value===t)&&(e.value=t)},T=()=>{const a=n("filterBulan");if(!a)return;const e=a.value,t=[...new Set(p.map(s=>String(s.tanggal??"").slice(0,7)).filter(s=>/^\d{4}-\d{2}$/.test(s)))].sort().reverse(),l=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];a.innerHTML='<option value="semua">Semua Bulan</option>'+t.map(s=>{const[r,i]=s.split("-"),o=l[Number(i)-1]??i;return`<option value="${s}">${o} ${r}</option>`}).join(""),[...a.options].some(s=>s.value===e)&&(a.value=e)},g=()=>{const a=n("cariRiwayat").value.trim().toLowerCase(),e=n("filterJenis").value,t=n("filterKategori").value,l=n("filterBulan").value,s=p.filter(r=>!(e!=="semua"&&r.jenis!==e||t!=="semua"&&String(r.kategori??"").toLowerCase()!==String(t).toLowerCase()||l!=="semua"&&!String(r.tanggal??"").startsWith(l)||a&&!`${r.id} ${r.keterangan} ${r.kategori} ${r.kelas} ${r.petugas}`.toLowerCase().includes(a)));s.sort((r,i)=>r.tanggal<i.tanggal?1:r.tanggal>i.tanggal?-1:0),D(s),M(s)},w=()=>{n("cariRiwayat").value="",n("filterJenis").value="semua",n("filterBulan").value="semua";const a=n("filterKelasRiwayat");a&&(a.value="semua"),b(),n("filterKategori").value="semua",g(),f()},j=a=>{const e=k(a.tagihan,a.diterima),t=a.jenis==="masuk"?"+":"−",l=a.kelas?`<span class="cell-keterangan__sub">${d(a.kelas)}</span>`:"",s=a.jumlah_rincian>1?`<span class="cell-rincian">${a.jumlah_rincian} rincian</span>`:"",r=R(a.kategori);return`
            <tr>

                <td>
                    <span class="cell-id">
                        ${d(a.id)}
                    </span>
                </td>

                <td class="cell-keterangan">

                    <div class="cell-keterangan__utama">
                        ${d(a.keterangan)}
                    </div>

                    ${s}

                    ${l}

                </td>

                <td>
                    <span class="chip ${r}">
                        ${d(h(a.kategori))}
                    </span>
                </td>

                <td class="cell-tanggal">

                    <div class="cell-tanggal__utama">
                        ${A(a.tanggal)}
                    </div>

                    <div class="cell-tanggal__sub">
                        ${d(a.waktu)} WIB
                    </div>

                </td>

                <td class="td-r">

                    <span class="cell-nominal cell-nominal--${a.jenis}">
                        ${t}${c(e)}
                    </span>

                </td>

                <td>
                    <span class="cell-petugas">
                        ${d(a.petugas)}
                    </span>
                </td>

                <td class="td-c">

                    <span class="aksi-grup">

                        <button
                            type="button"
                            class="icon-btn"
                            data-aksi="detail"
                            data-id="${a.id}"
                            aria-label="Lihat detail ${a.id}"
                            title="Detail">

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </span>

                </td>

            </tr>
        `},D=a=>{const e=n("isiTabelRiwayat"),t=n("emptyState");e.innerHTML=a.map(j).join(""),a.length===0?(t.hidden=!1,e.innerHTML=""):t.hidden=!0,n("tabelInfo").textContent=`${a.length} transaksi ditampilkan`},M=a=>{const e=a.filter(r=>r.jenis==="masuk").reduce((r,i)=>r+k(i.tagihan,i.diterima),0),t=a.filter(r=>r.jenis==="keluar").reduce((r,i)=>r+k(i.tagihan,i.diterima),0);n("sumMasuk").textContent=c(e),n("sumKeluar").textContent=c(t),n("sumJumlah").textContent=a.length;const l=a.length,s=l?`dari ${l} transaksi terfilter`:"tidak ada transaksi";n("sumMasukNote").textContent=s,n("sumKeluarNote").textContent=s,n("sumJumlahNote").textContent=s},I=a=>{const e=p.find(r=>String(r.id)===String(a));if(!e)return;n("modalDetailTitle").textContent=e.id,n("detailJenis").textContent=e.jenis==="masuk"?"Pemasukan":"Pengeluaran",n("detailKategori").textContent=h(e.kategori),n("detailKelas").textContent=e.kelas||"-",n("detailTanggal").textContent=A(e.tanggal),n("detailWaktu").textContent=`${e.waktu} WIB`,n("detailPetugas").textContent=e.petugas,n("detailKeterangan").textContent=e.keterangan;const t=n("detailStatusBayar");t&&(e.status_pembayaran==="Lunas"?(t.hidden=!1,t.className="badge badge--ok",t.textContent="Lunas"):e.status_pembayaran==="Cicilan"?(t.hidden=!1,t.className="badge badge--pending",t.textContent="Cicilan • Sisa "+c(e.sisa_tagihan??0)):(t.hidden=!0,t.textContent=""));const l=k(e.tagihan,e.diterima),s=N(e.tagihan,e.diterima);n("rincianTagihan").textContent=c(e.tagihan),n("rincianDiterima").textContent=c(e.diterima),n("rincianKembalian").textContent=c(s),n("rincianMasukKas").textContent=c(l),n("rincianLabelDiterima").textContent=e.jenis==="masuk"?"Jumlah uang yang diterima Bendahara":"Jumlah uang yang dibayarkan Bendahara",n("rincianLabelMasukKas").textContent=e.jenis==="masuk"?"Jumlah uang yang masuk ke kas":"Jumlah uang yang keluar dari kas",B(e),E("modalDetail")},B=a=>{const e=n("detailRincian"),t=n("detailRincianList"),l=n("detailRincianTotal");if(!e||!t||!l)return;const s=Array.isArray(a.rincian)?a.rincian.filter(Boolean):[];if(s.length<=1){e.hidden=!0,t.innerHTML="",l.textContent="-";return}t.innerHTML=s.map(i=>{const o=i.nama_iuran?d(i.nama_iuran):d(i.keterangan||"Pembayaran"),u=i.periode?`<span class="detail-rincian__periode">${d(i.periode)}</span>`:"",m=i.status_pembayaran==="Lunas"?'<span class="badge badge--ok">Lunas</span>':i.status_pembayaran==="Cicilan"?`<span class="badge badge--pending">Cicilan${i.sisa_tagihan!=null?" • Sisa "+c(i.sisa_tagihan):""}</span>`:"";return`
                    <div class="detail-rincian__baris">
                        <div class="detail-rincian__info">
                            <span class="detail-rincian__nama">${o}</span>
                            ${u}
                            ${m}
                        </div>
                        <b class="detail-rincian__nominal">${c(i.nominal)}</b>
                    </div>
                `}).join("");const r=s.reduce((i,o)=>i+(Number(o.nominal)||0),0);l.textContent=c(r),e.hidden=!1},P=()=>{n("sidebar");const a=n("sidebarBackdrop"),e=n("sidebarToggle"),t=n("profileBtn"),l=n("profileMenu"),s=()=>{document.body.classList.remove("nav-open"),e.setAttribute("aria-expanded","false")};e.addEventListener("click",o=>{o.stopPropagation();const u=document.body.classList.toggle("nav-open");e.setAttribute("aria-expanded",u?"true":"false")}),a.addEventListener("click",s),window.addEventListener("resize",()=>{window.innerWidth>1024&&s()});const r=()=>{l.classList.remove("is-open"),t.setAttribute("aria-expanded","false")};t.addEventListener("click",o=>{o.stopPropagation();const u=l.classList.toggle("is-open");t.setAttribute("aria-expanded",u?"true":"false")}),document.addEventListener("click",o=>{!l.contains(o.target)&&!t.contains(o.target)&&r();const u=o.target.closest("[data-aksi='detail']");u&&I(u.dataset.id);const m=o.target.closest("[data-tutup-modal]");m&&_(m.dataset.tutupModal)}),document.querySelectorAll(".modal-backdrop").forEach(o=>{o.addEventListener("click",u=>{u.target===o&&_(o.id)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(r(),s(),_("modalDetail"))});const i=new Date;n("topbarDate").textContent=i.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})},J=()=>{b(),P(),n("filterKelasRiwayat")?.addEventListener("change",f),g(),n("cariRiwayat").addEventListener("input",g),n("filterJenis").addEventListener("change",()=>{b(),g()}),n("filterKategori").addEventListener("change",g),n("filterBulan").addEventListener("change",g),n("btnResetFilter").addEventListener("click",w),n("btnKosongkanFilter").addEventListener("click",w)};document.addEventListener("DOMContentLoaded",()=>{J(),S(),f()})})();
