(function(){const A="/admin/api/transaksi",C=[{value:"Iuran",label:"Iuran"},{value:"kas",label:"Kas"},{value:"pemasukan lainnya",label:"Pemasukan Lainnya"},{value:"kebutuhan kelas",label:"Kebutuhan Kelas"},{value:"perlengkapan kelas",label:"Perlengkapan Kelas"},{value:"kegiatan kelas",label:"Kegiatan Kelas"},{value:"pengeluaran lainnya",label:"Pengeluaran Lainnya"}],_=["Iuran","kas","pemasukan lainnya"],v=["kebutuhan kelas","perlengkapan kelas","kegiatan kelas","pengeluaran lainnya"],h=a=>{const n=C.find(t=>t.value.toLowerCase()===String(a??"").toLowerCase());return n?n.label:String(a??"")};let p=[];const w=async(a,n={})=>{let t;try{t=await fetch(a,{...n,headers:{Accept:"application/json",...n.headers||{}},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let r={};try{r=await t.json()}catch{}if(!t.ok)throw new Error(r?.message||"Gagal memuat data transaksi.");return r},$=a=>{const n=String(a.jenis??"").toUpperCase(),t=String(a.tanggal_format??a.tanggal??"").slice(0,10);let r=String(a.waktu??"").trim();if(!r&&a.created_at){const m=String(a.created_at).match(/[T ](\d{2}):(\d{2})/);m&&(r=m[1]+":"+m[2])}const i=Number(a.nominal)||0,s=Number(a.uang_diterima)||i,l=Array.isArray(a.rincian)?a.rincian:[],o=Number(a.nominal_grup)>0?Number(a.nominal_grup):i,u=Number(a.uang_diterima_grup)>0?Number(a.uang_diterima_grup):s;return{id:a.no_bukti||"TRX-"+(a.id_transaksi??""),no_bukti:a.no_bukti??"",id_transaksi:a.id_transaksi??null,jenis:n==="PENGELUARAN"||n==="K"?"keluar":"masuk",kategori:a.kategori??"",keterangan:a.keterangan??"",kelas:a.nama_siswa??"",tanggal:t,waktu:r||"-",tagihan:o,diterima:u,petugas:a.dicatat_oleh??a.pic??a.nama_pembayar??"",rincian:l,jumlah_rincian:Number(a.jumlah_rincian)>0?Number(a.jumlah_rincian):l.length,status_pembayaran:a.status_pembayaran??null,sisa_tagihan:a.sisa_tagihan!==null&&a.sisa_tagihan!==void 0?Number(a.sisa_tagihan):null}},K=async()=>{try{const a=await w(A),n=Array.isArray(a.data)?a.data:[],t=new Map;n.forEach(r=>{const i=r.no_bukti||"TRX-"+(r.id_transaksi??"");if(!t.has(i)){t.set(i,r);return}const s=t.get(i);(!Array.isArray(s.rincian)||s.rincian.length===0)&&Array.isArray(r.rincian)&&(s.rincian=r.rincian,s.nominal_grup=r.nominal_grup,s.uang_diterima_grup=r.uang_diterima_grup,s.jumlah_rincian=r.jumlah_rincian)}),p=Array.from(t.values()).map($),E(),b(),g()}catch(a){console.error("Gagal memuat data transaksi:",a),p=[],g()}},e=a=>document.getElementById(a),c=a=>"Rp "+(Number(a)||0).toLocaleString("id-ID"),y=a=>{const n=String(a??"").slice(0,10).split("-");if(n.length!==3||!n[0])return"-";const t=new Date(Number(n[0]),Number(n[1])-1,Number(n[2]));return Number.isNaN(t.getTime())?String(a):t.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},d=a=>String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),S=(a,n)=>Math.max(0,(Number(n)||0)-(Number(a)||0)),k=(a,n)=>Math.min(Number(a)||0,Number(n)||0),N={iuran:"chip--iuran",kas:"chip--kas","pemasukan lainnya":"chip--masuk-lain","kebutuhan kelas":"chip--butuh","perlengkapan kelas":"chip--perlengkapan","kegiatan kelas":"chip--kegiatan","pengeluaran lainnya":"chip--keluar-lain"},x=a=>N[String(a??"").toLowerCase()]||"chip--keluar-lain",T=a=>{const n=e(a);n&&(n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},f=a=>{const n=e(a);n&&(n.classList.remove("is-open"),n.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},b=()=>{const a=e("filterJenis").value,n=e("filterKategori"),t=n.value,r=a==="masuk"?_:a==="keluar"?v:[..._,...v];n.innerHTML='<option value="semua">Semua Kategori</option>'+r.map(i=>`<option value="${d(i)}">${d(h(i))}</option>`).join(""),[...n.options].some(i=>i.value===t)&&(n.value=t)},E=()=>{const a=e("filterBulan");if(!a)return;const n=a.value,t=[...new Set(p.map(i=>String(i.tanggal??"").slice(0,7)).filter(i=>/^\d{4}-\d{2}$/.test(i)))].sort().reverse(),r=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];a.innerHTML='<option value="semua">Semua Bulan</option>'+t.map(i=>{const[s,l]=i.split("-"),o=r[Number(l)-1]??l;return`<option value="${i}">${o} ${s}</option>`}).join(""),[...a.options].some(i=>i.value===n)&&(a.value=n)},g=()=>{const a=e("cariRiwayat").value.trim().toLowerCase(),n=e("filterJenis").value,t=e("filterKategori").value,r=e("filterBulan").value,i=p.filter(s=>!(n!=="semua"&&s.jenis!==n||t!=="semua"&&String(s.kategori??"").toLowerCase()!==String(t).toLowerCase()||r!=="semua"&&!String(s.tanggal??"").startsWith(r)||a&&!`${s.id} ${s.keterangan} ${s.kategori} ${s.kelas} ${s.petugas}`.toLowerCase().includes(a)));i.sort((s,l)=>s.tanggal<l.tanggal?1:s.tanggal>l.tanggal?-1:0),M(i),R(i)},L=()=>{e("cariRiwayat").value="",e("filterJenis").value="semua",e("filterBulan").value="semua",b(),e("filterKategori").value="semua",g()},j=a=>{const n=k(a.tagihan,a.diterima),t=a.jenis==="masuk"?"+":"−",r=a.kelas?`<span class="cell-keterangan__sub">${d(a.kelas)}</span>`:"",i=a.jumlah_rincian>1?`<span class="cell-rincian">${a.jumlah_rincian} rincian</span>`:"",s=x(a.kategori);return`
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

                    ${i}

                    ${r}

                </td>

                <td>
                    <span class="chip ${s}">
                        ${d(h(a.kategori))}
                    </span>
                </td>

                <td class="cell-tanggal">

                    <div class="cell-tanggal__utama">
                        ${y(a.tanggal)}
                    </div>

                    <div class="cell-tanggal__sub">
                        ${d(a.waktu)} WIB
                    </div>

                </td>

                <td class="td-r">

                    <span class="cell-nominal cell-nominal--${a.jenis}">
                        ${t}${c(n)}
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
        `},M=a=>{const n=e("isiTabelRiwayat"),t=e("emptyState");n.innerHTML=a.map(j).join(""),a.length===0?(t.hidden=!1,n.innerHTML=""):t.hidden=!0,e("tabelInfo").textContent=`${a.length} transaksi ditampilkan`},R=a=>{const n=a.filter(s=>s.jenis==="masuk").reduce((s,l)=>s+k(l.tagihan,l.diterima),0),t=a.filter(s=>s.jenis==="keluar").reduce((s,l)=>s+k(l.tagihan,l.diterima),0);e("sumMasuk").textContent=c(n),e("sumKeluar").textContent=c(t),e("sumJumlah").textContent=a.length;const r=a.length,i=r?`dari ${r} transaksi terfilter`:"tidak ada transaksi";e("sumMasukNote").textContent=i,e("sumKeluarNote").textContent=i,e("sumJumlahNote").textContent=i},D=a=>{const n=p.find(s=>String(s.id)===String(a));if(!n)return;e("modalDetailTitle").textContent=n.id,e("detailJenis").textContent=n.jenis==="masuk"?"Pemasukan":"Pengeluaran",e("detailKategori").textContent=h(n.kategori),e("detailKelas").textContent=n.kelas||"-",e("detailTanggal").textContent=y(n.tanggal),e("detailWaktu").textContent=`${n.waktu} WIB`,e("detailPetugas").textContent=n.petugas,e("detailKeterangan").textContent=n.keterangan;const t=e("detailStatusBayar");t&&(n.status_pembayaran==="Lunas"?(t.hidden=!1,t.className="badge badge--ok",t.textContent="Lunas"):n.status_pembayaran==="Cicilan"?(t.hidden=!1,t.className="badge badge--pending",t.textContent="Cicilan • Sisa "+c(n.sisa_tagihan??0)):(t.hidden=!0,t.textContent=""));const r=k(n.tagihan,n.diterima),i=S(n.tagihan,n.diterima);e("rincianTagihan").textContent=c(n.tagihan),e("rincianDiterima").textContent=c(n.diterima),e("rincianKembalian").textContent=c(i),e("rincianMasukKas").textContent=c(r),e("rincianLabelDiterima").textContent=n.jenis==="masuk"?"Jumlah uang yang diterima Bendahara":"Jumlah uang yang dibayarkan Bendahara",e("rincianLabelMasukKas").textContent=n.jenis==="masuk"?"Jumlah uang yang masuk ke kas":"Jumlah uang yang keluar dari kas",B(n),T("modalDetail")},B=a=>{const n=e("detailRincian"),t=e("detailRincianList"),r=e("detailRincianTotal");if(!n||!t||!r)return;const i=Array.isArray(a.rincian)?a.rincian.filter(Boolean):[];if(i.length<=1){n.hidden=!0,t.innerHTML="",r.textContent="-";return}t.innerHTML=i.map(l=>{const o=l.nama_iuran?d(l.nama_iuran):d(l.keterangan||"Pembayaran"),u=l.periode?`<span class="detail-rincian__periode">${d(l.periode)}</span>`:"",m=l.status_pembayaran==="Lunas"?'<span class="badge badge--ok">Lunas</span>':l.status_pembayaran==="Cicilan"?`<span class="badge badge--pending">Cicilan${l.sisa_tagihan!=null?" • Sisa "+c(l.sisa_tagihan):""}</span>`:"";return`
                    <div class="detail-rincian__baris">
                        <div class="detail-rincian__info">
                            <span class="detail-rincian__nama">${o}</span>
                            ${u}
                            ${m}
                        </div>
                        <b class="detail-rincian__nominal">${c(l.nominal)}</b>
                    </div>
                `}).join("");const s=i.reduce((l,o)=>l+(Number(o.nominal)||0),0);r.textContent=c(s),n.hidden=!1},I=()=>{e("sidebar");const a=e("sidebarBackdrop"),n=e("sidebarToggle"),t=e("profileBtn"),r=e("profileMenu"),i=()=>{document.body.classList.remove("nav-open"),n.setAttribute("aria-expanded","false")};n.addEventListener("click",o=>{o.stopPropagation();const u=document.body.classList.toggle("nav-open");n.setAttribute("aria-expanded",u?"true":"false")}),a.addEventListener("click",i),window.addEventListener("resize",()=>{window.innerWidth>1024&&i()});const s=()=>{r.classList.remove("is-open"),t.setAttribute("aria-expanded","false")};t.addEventListener("click",o=>{o.stopPropagation();const u=r.classList.toggle("is-open");t.setAttribute("aria-expanded",u?"true":"false")}),document.addEventListener("click",o=>{!r.contains(o.target)&&!t.contains(o.target)&&s();const u=o.target.closest("[data-aksi='detail']");u&&D(u.dataset.id);const m=o.target.closest("[data-tutup-modal]");m&&f(m.dataset.tutupModal)}),document.querySelectorAll(".modal-backdrop").forEach(o=>{o.addEventListener("click",u=>{u.target===o&&f(o.id)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(s(),i(),f("modalDetail"))});const l=new Date;e("topbarDate").textContent=l.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})},J=()=>{b(),I(),g(),e("cariRiwayat").addEventListener("input",g),e("filterJenis").addEventListener("change",()=>{b(),g()}),e("filterKategori").addEventListener("change",g),e("filterBulan").addEventListener("change",g),e("btnResetFilter").addEventListener("click",L),e("btnKosongkanFilter").addEventListener("click",L)};document.addEventListener("DOMContentLoaded",()=>{J(),K()})})();
