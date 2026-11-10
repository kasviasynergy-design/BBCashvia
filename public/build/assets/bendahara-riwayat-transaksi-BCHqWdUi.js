(function(){const S=[{value:"Iuran",label:"Iuran"},{value:"kas",label:"Kas"},{value:"pemasukan lainnya",label:"Pemasukan Lainnya"},{value:"kebutuhan kelas",label:"Kebutuhan Kelas"},{value:"perlengkapan kelas",label:"Perlengkapan Kelas"},{value:"kegiatan kelas",label:"Kegiatan Kelas"},{value:"pengeluaran lainnya",label:"Pengeluaran Lainnya"}],y=["Iuran","kas","pemasukan lainnya"],_=["kebutuhan kelas","perlengkapan kelas","kegiatan kelas","pengeluaran lainnya"],v=a=>{const e=S.find(n=>n.value.toLowerCase()===String(a??"").toLowerCase());return e?e.label:String(a??"")};let p=[];const K="/data/transaksi",$=async(a,e={})=>{let n;try{n=await fetch(a,{...e,headers:{Accept:"application/json",...e.headers||{}},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let s={};try{s=await n.json()}catch{}if(!n.ok)throw new Error(s?.message||"Gagal memuat data transaksi.");return s},x=a=>{const e=String(a??"").toUpperCase();return e==="TF"?"Transfer":e==="CH"?"Tunai":e||"Tunai"},T=a=>{const e=String(a.jenis??"").toUpperCase(),n=String(a.tanggal_format??a.tanggal??"").slice(0,10);let s=String(a.waktu??"").trim();if(!s&&a.created_at){const c=String(a.created_at).match(/[T ](\d{2}):(\d{2})/);c&&(s=c[1]+":"+c[2])}const i=Number(a.nominal)||0,r=Number(a.uang_diterima)||i,l=Array.isArray(a.rincian)?a.rincian:[];return{id:a.no_bukti||"TRX-"+(a.id_transaksi??""),jenis:e==="PENGELUARAN"||e==="K"?"keluar":"masuk",kategori:a.kategori??"",keterangan:a.keterangan??"",kelas:a.nama_siswa??"",tanggal:n,waktu:s||"-",metode:x(a.metode),tagihan:i,diterima:r,petugas:a.dicatat_oleh??a.pic??a.nama_pembayar??"",rincian:l,jumlah_rincian:Number(a.jumlah_rincian)>0?Number(a.jumlah_rincian):l.length,status_pembayaran:a.status_pembayaran??null,sisa_tagihan:a.sisa_tagihan!==null&&a.sisa_tagihan!==void 0?Number(a.sisa_tagihan):null}},N=async()=>{try{const a=await $(K);p=(Array.isArray(a.data)?a.data:[]).map(T),R(),b(),g()}catch(a){console.error("Gagal memuat data transaksi:",a),p=[],g()}},t=a=>document.getElementById(a),d=a=>"Rp "+(Number(a)||0).toLocaleString("id-ID"),C=a=>{const e=String(a??"").slice(0,10).split("-");if(e.length!==3||!e[0])return"-";const n=new Date(Number(e[0]),Number(e[1])-1,Number(e[2]));return Number.isNaN(n.getTime())?String(a):n.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})},u=a=>String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),E=(a,e)=>Math.max(0,(Number(e)||0)-(Number(a)||0)),k=(a,e)=>Math.min(Number(a)||0,Number(e)||0),D={iuran:"chip--iuran",kas:"chip--kas","pemasukan lainnya":"chip--masuk-lain","kebutuhan kelas":"chip--butuh","perlengkapan kelas":"chip--perlengkapan","kegiatan kelas":"chip--kegiatan","pengeluaran lainnya":"chip--keluar-lain"},M=a=>D[String(a??"").toLowerCase()]||"chip--keluar-lain",j=a=>{const e=t(a);e&&(e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},L=a=>{const e=t(a);e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},b=()=>{const a=t("filterJenis").value,e=t("filterKategori"),n=e.value,s=a==="masuk"?y:a==="keluar"?_:[...y,..._];e.innerHTML=`<option value="semua">
                Semua Kategori
            </option>`+s.map(i=>`<option value="${u(i)}">
                            ${u(v(i))}
                        </option>`).join(""),[...e.options].some(i=>i.value===n)&&(e.value=n)},R=()=>{const a=t("filterBulan");if(!a)return;const e=a.value,n=[...new Set(p.map(i=>String(i.tanggal??"").slice(0,7)).filter(i=>/^\d{4}-\d{2}$/.test(i)))].sort().reverse(),s=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];a.innerHTML=`<option value="semua">
                Semua Bulan
            </option>`+n.map(i=>{const[r,l]=i.split("-"),c=s[Number(l)-1]??l;return`<option value="${i}">${c} ${r}</option>`}).join(""),[...a.options].some(i=>i.value===e)&&(a.value=e)},g=()=>{const a=t("cariRiwayat").value.trim().toLowerCase(),e=t("filterJenis").value,n=t("filterKategori").value,s=t("filterBulan").value,i=p.filter(r=>!(e!=="semua"&&r.jenis!==e||n!=="semua"&&String(r.kategori??"").toLowerCase()!==String(n).toLowerCase()||s!=="semua"&&!String(r.tanggal??"").startsWith(s)||a&&!`${r.id}
                            ${r.keterangan}
                            ${r.kategori}
                            ${r.kelas}
                            ${r.petugas}
                            ${r.metode}`.toLowerCase().includes(a)));i.sort((r,l)=>r.tanggal<l.tanggal?1:r.tanggal>l.tanggal?-1:0),B(i),P(i)},w=()=>{t("cariRiwayat").value="",t("filterJenis").value="semua",t("filterBulan").value="semua",b(),t("filterKategori").value="semua",g()},I=a=>{const e=k(a.tagihan,a.diterima),n=a.jenis==="masuk"?"+":"−",s=M(a.kategori);return`

            <tr>

                <td>

                    <span class="cell-id">
                        ${u(a.id)}
                    </span>

                </td>


                <td class="cell-keterangan">

                    <div class="cell-keterangan__utama">
                        ${u(a.keterangan)}
                    </div>

                    <span class="cell-keterangan__sub">
                        ${u(a.kelas)}
                    </span>

                </td>


                <td>

                    <span class="chip ${s}">
                        ${u(v(a.kategori))}
                    </span>

                </td>


                <td class="cell-tanggal">

                    <div class="cell-tanggal__utama">
                        ${C(a.tanggal)}
                    </div>

                    <div class="cell-tanggal__sub">
                        ${u(a.waktu)} WIB
                    </div>

                </td>


                <td class="td-r">

                    <span
                        class="cell-nominal cell-nominal--${a.jenis}"
                    >
                        ${n}${d(e)}
                    </span>

                </td>


                <td>

                    <span class="cell-petugas">
                        ${u(a.petugas)}
                    </span>

                </td>


                <td class="td-c">

                    <span class="aksi-grup">

                        <button
                            type="button"
                            class="icon-btn"
                            data-aksi="detail"
                            data-id="${u(a.id)}"
                            aria-label="Lihat detail ${u(a.id)}"
                            title="Detail"
                        >

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>

                    </span>

                </td>

            </tr>

        `},B=a=>{const e=t("isiTabelRiwayat"),n=t("emptyState");e.innerHTML=a.map(I).join(""),a.length===0?(n.hidden=!1,e.innerHTML=""):n.hidden=!0,t("tabelInfo").textContent=`${a.length} transaksi ditampilkan`},P=a=>{const e=a.filter(r=>r.jenis==="masuk").reduce((r,l)=>r+k(l.tagihan,l.diterima),0),n=a.filter(r=>r.jenis==="keluar").reduce((r,l)=>r+k(l.tagihan,l.diterima),0);t("sumMasuk").textContent=d(e),t("sumKeluar").textContent=d(n),t("sumJumlah").textContent=a.length;const s=a.length,i=s?`dari ${s} transaksi terfilter`:"tidak ada transaksi";t("sumMasukNote").textContent=i,t("sumKeluarNote").textContent=i,t("sumJumlahNote").textContent=i},J=a=>{const e=p.find(r=>String(r.id)===String(a));if(!e)return;t("modalDetailTitle").textContent=e.id,t("detailJenis").textContent=e.jenis==="masuk"?"Pemasukan":"Pengeluaran",t("detailKategori").textContent=v(e.kategori),t("detailKelas").textContent=e.kelas,t("detailTanggal").textContent=C(e.tanggal),t("detailWaktu").textContent=`${e.waktu} WIB`,t("detailMetode").textContent=e.metode,t("detailPetugas").textContent=e.petugas,t("detailKeterangan").textContent=e.keterangan;const n=t("detailStatusBayar");n&&(e.status_pembayaran==="Lunas"?(n.hidden=!1,n.className="badge badge--ok",n.textContent="Lunas"):e.status_pembayaran==="Cicilan"?(n.hidden=!1,n.className="badge badge--pending",n.textContent="Cicilan • Sisa "+d(e.sisa_tagihan??0)):(n.hidden=!0,n.textContent="")),H(e);const s=k(e.tagihan,e.diterima),i=E(e.tagihan,e.diterima);t("rincianTagihan").textContent=d(e.tagihan),t("rincianDiterima").textContent=d(e.diterima),t("rincianKembalian").textContent=d(i),t("rincianMasukKas").textContent=d(s),t("rincianLabelDiterima").textContent=e.jenis==="masuk"?"Jumlah uang yang diterima Bendahara":"Jumlah uang yang dibayarkan Bendahara",t("rincianLabelMasukKas").textContent=e.jenis==="masuk"?"Jumlah uang yang masuk ke kas":"Jumlah uang yang keluar dari kas",j("modalDetail")},H=a=>{const e=t("detailRincian"),n=t("detailRincianList"),s=t("detailRincianTotal");if(!e||!n||!s)return;const i=Array.isArray(a.rincian)?a.rincian.filter(Boolean):[];if(i.length<=1){e.hidden=!0,n.innerHTML="",s.textContent="-";return}n.innerHTML=i.map(l=>{const c=l.nama_iuran?u(l.nama_iuran):u(l.keterangan||"Pembayaran"),h=l.periode?`<span class="detail-rincian__periode">${u(l.periode)}</span>`:"",f=l.status_pembayaran==="Lunas"?'<span class="badge badge--ok">Lunas</span>':l.status_pembayaran==="Cicilan"?`<span class="badge badge--pending">Cicilan${l.sisa_tagihan!=null?" • Sisa "+d(l.sisa_tagihan):""}</span>`:"";return`
                    <div class="detail-rincian__baris">
                        <div class="detail-rincian__info">
                            <span class="detail-rincian__nama">${c}</span>
                            ${h}
                            ${f}
                        </div>
                        <b class="detail-rincian__nominal">${d(l.nominal)}</b>
                    </div>
                `}).join("");const r=i.reduce((l,c)=>l+(Number(c.nominal)||0),0);s.textContent=d(r),e.hidden=!1},U=()=>{t("sidebar");const a=t("sidebarBackdrop"),e=t("sidebarToggle"),n=t("profileButton"),s=t("profileDropdown"),i=()=>{document.body.classList.remove("nav-open"),e&&e.setAttribute("aria-expanded","false")};e&&e.addEventListener("click",o=>{o.stopPropagation();const m=document.body.classList.toggle("nav-open");e.setAttribute("aria-expanded",m?"true":"false")}),a&&a.addEventListener("click",i),window.addEventListener("resize",()=>{window.innerWidth>1024&&i()});const r=()=>{s&&(s.classList.remove("is-open"),n&&n.setAttribute("aria-expanded","false"))};n&&s&&n.addEventListener("click",o=>{o.stopPropagation();const m=s.classList.toggle("is-open");n.setAttribute("aria-expanded",m?"true":"false")}),document.addEventListener("click",o=>{s&&n&&!s.contains(o.target)&&!n.contains(o.target)&&r();const m=o.target.closest("[data-aksi='detail']");m&&J(m.dataset.id);const A=o.target.closest("[data-tutup-modal]");A&&L(A.dataset.tutupModal)}),document.querySelectorAll(".modal-backdrop").forEach(o=>{o.addEventListener("click",m=>{m.target===o&&L(o.id)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&(r(),i(),L("modalDetail"))});const l=new Date;t("topbarDate")&&(t("topbarDate").textContent=l.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));const c=t("sidebarLogout"),h=t("btnProfileLogout"),f=()=>{window.location.href="/logout"};c&&c.addEventListener("click",f),h&&h.addEventListener("click",f)},G=()=>{b(),U(),g(),t("cariRiwayat").addEventListener("input",g),t("filterJenis").addEventListener("change",()=>{b(),g()}),t("filterKategori").addEventListener("change",g),t("filterBulan").addEventListener("change",g),t("btnResetFilter").addEventListener("click",w),t("btnKosongkanFilter").addEventListener("click",w)};document.addEventListener("DOMContentLoaded",()=>{G(),N()})})();
