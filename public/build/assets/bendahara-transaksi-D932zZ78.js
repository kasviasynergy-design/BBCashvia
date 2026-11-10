import{k as ma,a as Ya}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const t=a=>document.getElementById(a),f=a=>{const n=Number(a)||0;return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(n)},h=a=>{if(a==null)return 0;const n=String(a).replace(/[^\d]/g,"");return Number(n)||0},U=a=>{if(!a)return;const n=h(a.value);a.value=n>0?new Intl.NumberFormat("id-ID").format(n):""},d=a=>String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),pa=a=>{const n=String(a||"").trim().split(/\s+/).filter(Boolean);return n.length?n.length===1?n[0].slice(0,2).toUpperCase():(n[0][0]+n[n.length-1][0]).toUpperCase():"??"},z=a=>{if(!a)return"-";const n=String(a).slice(0,10).split("-");if(n.length!==3||!n[0])return String(a);const e=new Date(Number(n[0]),Number(n[1])-1,Number(n[2]));return Number.isNaN(e.getTime())?String(a):new Intl.DateTimeFormat("id-ID",{day:"2-digit",month:"short",year:"numeric"}).format(e)},ga=()=>{const a=new Date,n=a.getFullYear(),e=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${n}-${e}-${i}`},B="/bendahara/api/transaksi",fa="/bendahara/api/siswa",ka="/bendahara/api/iuran",ba="/bendahara/api/transaksi/kategori";let E=[],S=[],v=[],K="tambah",_=null,C=null,Q=null,G="";const ha=()=>{const a=document.querySelector('meta[name="csrf-token"]');return a?a.getAttribute("content"):""},M=async a=>{let n;const e=new AbortController,i=setTimeout(()=>e.abort(),3e4);try{n=await fetch(a,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin",signal:e.signal})}catch(r){throw clearTimeout(i),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(i);let s={};try{s=await n.json()}catch{}if(!n.ok)throw n.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):n.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):n.status===401||n.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(s?.message||"Gagal mengambil data dari server.");return s},J=async(a,n,e)=>{let i;const s=new AbortController,r=setTimeout(()=>s.abort(),3e4);try{i=await fetch(a,{method:n,headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":G,...String(n).toUpperCase()==="POST"?{"X-Idempotency-Key":Ya()}:{}},credentials:"same-origin",body:JSON.stringify(e),signal:s.signal})}catch(l){throw clearTimeout(r),l?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(r);let o={};try{o=await i.json()}catch{}if(!i.ok){if(i.status>=500)throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");if(i.status===419)throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");if(i.status===401||i.status===403)throw new Error("Akses ditolak. Pastikan kamu sudah login.");if(o?.errors){const l=Object.values(o.errors).flat().filter(Boolean);if(l.length)throw new Error(l.join(" "))}throw new Error(o?.message||"Terjadi kesalahan saat menyimpan.")}return o},va=async a=>{let n;try{n=await fetch(a,{method:"DELETE",headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":G},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let e={};try{e=await n.json()}catch{}if(!n.ok)throw new Error(e?.message||"Gagal menghapus data.");return e},V={masuk:[{value:"Iuran",label:"Iuran"},{value:"kas",label:"Kas"},{value:"pemasukan lainnya",label:"Pemasukan Lainnya"}],keluar:[{value:"kebutuhan kelas",label:"Kebutuhan Kelas"},{value:"perlengkapan kelas",label:"Perlengkapan Kelas"},{value:"kegiatan kelas",label:"Kegiatan Kelas"},{value:"pengeluaran lainnya",label:"Pengeluaran Lainnya"}]};let y=[...V.masuk],L=[...V.keluar];const Sa=async()=>{let a;try{a=await M(ba)}catch{return}const n=a?.data;n&&(Array.isArray(n.masuk)&&n.masuk.length&&(y=n.masuk),Array.isArray(n.keluar)&&n.keluar.length&&(L=n.keluar),na(),ta())},Z=a=>{const e=[...y,...L].find(s=>s.value===a);if(e)return e.label;const i=String(a||"").trim();return i?i.charAt(0).toUpperCase()+i.slice(1):"-"},ya=(a,n)=>{const e=Number(a)||0,i=Number(n)||0;return Math.max(i-e,0)},wa=(a,n)=>{const e=Number(a)||0,i=Number(n)||0;return Math.min(e,i)},O=(a,n,e=null)=>v.reduce((i,s)=>s.jenis!=="masuk"||String(s.id_siswa??"")!==String(a)||String(s.iuranId??"")!==String(n)||e!=null&&String(s.id_transaksi)===String(e)?i:i+(Number(s.nominal)||0),0),D=()=>{const a=t("inputSiswa"),n=t("inputIuran"),e=t("inputSisaTagihan"),i=t("inputNominalBayar");if(!e)return;const s=a?.value||"",r=n?.value||"",o=!!s&&!!r,l=S.find(p=>String(p.id)===String(r)),c=Number(l?.nominal)||0,u=K==="edit"?v.find(p=>String(p.id)===String(_)):null,g=o?O(s,r,u?.id_transaksi??null):0,m=Math.max(c-g,0);e.value=o?new Intl.NumberFormat("id-ID").format(m):"",i&&K==="tambah"&&(i.placeholder=o&&m>0?new Intl.NumberFormat("id-ID").format(m):"0"),P()},Ta=a=>({id_siswa:a.id_siswa,nis:a.nis??"",nama:a.nama??"-",kelas:a.kelas||"-",id_kelas:a.id_kelas??null,rincian_iuran:Array.isArray(a.rincian_iuran)?a.rincian_iuran:[]}),Ea=a=>({id:a.id_iuran,nama:a.nama_iuran??"-",periode:a.keterangan||"-",keterangan:a.keterangan||"",status:String(a.status??"").toLowerCase(),id_kelas:a.id_kelas,nominal:Number(a.nominal)||0}),Ka=a=>{const n=["PEMASUKAN","M"].includes(String(a.jenis||"").toUpperCase())?"masuk":"keluar",e=a.id_siswa!=null?E.find(s=>String(s.id_siswa)===String(a.id_siswa)):null,i=a.id_iuran!=null?S.find(s=>String(s.id)===String(a.id_iuran)):null;return{id_transaksi:a.id_transaksi,id:a.no_bukti??"-",jenis:n,nis:e?e.nis:"",siswa:a.nama_pembayar||(e?e.nama:""),id_siswa:a.id_siswa,iuranId:a.id_iuran,iuran:i?i.nama:a.keterangan||"",kategori:a.kategori||"",nominal:Number(a.nominal)||0,diterima:Number(a.uang_diterima)||0,kembalian:Number(a.kembalian)||0,masukKas:n==="masuk"&&Number(a.nominal)||0,metode:a.metode==="TF"?"Transfer":"Tunai",tanggal:a.tanggal?String(a.tanggal).slice(0,10):"",keterangan:a.keterangan||"",petugas:a.dicatat_oleh||a.pic||"Bendahara"}},La=()=>{const a=t("topbarDate");a&&(a.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date))},aa=()=>{const a=t("inputSiswa");a&&(a.innerHTML=`
            <option value="">
                Pilih siswa
            </option>
        `,E.forEach(n=>{const e=document.createElement("option");e.value=n.id_siswa,e.textContent=`${n.nama} - ${n.nis}`,a.appendChild(e)}))},q=(a="")=>{const n=t("inputIuran");if(!n)return;n.innerHTML=`
            <option value="">
                Pilih iuran
            </option>
        `,S.filter(i=>i.status==="aktif"||a&&String(i.id)===String(a)).forEach(i=>{const s=document.createElement("option");s.value=i.id,s.textContent=`${i.nama} - ${f(i.nominal)}`+(i.status==="aktif"?"":" (Selesai)"),n.appendChild(s)}),a&&(n.value=String(a))},na=()=>{const a=t("inputKategori");if(!a)return;const n=a.value;a.innerHTML="";const e=(s,r)=>{const o=document.createElement("optgroup");o.label=s,r.forEach(l=>{const c=document.createElement("option");c.value=l.value,c.textContent=l.label,o.appendChild(c)}),a.appendChild(o)};e("Pemasukan",y),e("Pengeluaran",L),[...y,...L].some(s=>s.value===n)?a.value=n:a.options.length&&(a.selectedIndex=0)},ea=()=>{const a=t("inputKategori");if(!a)return;const n=a.value;if(!n)return;const i=y.some(r=>r.value===n)?"masuk":"keluar",s=document.querySelector(`input[name="jenisTransaksi"][value="${i}"]`);s&&!s.checked&&(s.checked=!0,$())},Na=()=>{const a=t("inputKategori");if(!a)return;const i=((document.querySelector('input[name="jenisTransaksi"]:checked')?.value??"masuk")==="keluar"?L:y)[0]?.value;i&&[...a.options].some(s=>s.value===i)&&(a.value=i)},ta=()=>{const a=t("filterKategori");if(!a)return;const n=[...y,...L];a.innerHTML=`
            <option value="semua">
                Semua Kategori
            </option>
        `,n.forEach(e=>{const i=document.createElement("option");i.value=e.value,i.textContent=e.label,a.appendChild(i)})},ia=()=>{const a=t("inputIuran"),n=t("inputTagihan");if(!a||!n)return;const e=S.find(i=>String(i.id)===String(a.value));if(!e){n.value="",D();return}n.value=new Intl.NumberFormat("id-ID").format(e.nominal),D()},P=()=>{const a=t("inputDiterima"),n=t("inputNominalBayar"),e=t("hasilKembalian"),i=t("hasilMasukKas"),s=t("uangHint");if(!a||!n||!e||!i)return;const r=h(n.value),o=h(a.value),l=ya(r,o),c=wa(r,o);if(e.textContent=f(l),i.textContent=f(c),s){s.classList.remove("is-peringatan");const u=h(t("inputSisaTagihan")?.value);r>0&&u>0&&r>u?(s.textContent=`Nominal pembayaran melebihi sisa tagihan (sisa ${f(u)}).`,s.classList.add("is-peringatan")):r>0&&o>0&&o<r?(s.textContent=`Uang diterima masih kurang ${f(r-o)} dari nominal pembayaran.`,s.classList.add("is-peringatan")):r>0&&o>=r?u>0&&r<u?s.textContent=`Cicilan: sisa tagihan berikutnya ${f(u-r)}.`:s.textContent=`Tagihan lunas. Kembalian ${f(l)} dan uang yang masuk ke kas ${f(c)}.`:s.textContent="Masukkan nominal pembayaran (boleh penuh atau cicilan) untuk menghitung kembalian."}},Ia=a=>{const n=a.querySelector(".baris-nominal"),e=a.querySelector(".baris-sisa-tagihan");if(!n||!e)return;const i=h(n.value),s=h(e.dataset.tagihanAwal||"0"),r=Math.max(s-i,0),o=Math.max(i-s,0);return e.value=new Intl.NumberFormat("id-ID").format(r),e.dataset.tagihanAwal||(e.dataset.tagihanAwal=s),{sisa:r,kembalian:o}},$=()=>{const a=document.querySelector('input[name="jenisTransaksi"]:checked')?.value||"masuk",n=t("siswaGroup"),e=t("iuranGroup"),i=t("tagihanGroup"),s=t("uangBox"),r=t("pengeluaranNominalGroup"),o=t("inputSiswa"),l=t("inputIuran"),c=t("inputTagihan"),u=t("inputDiterima"),g=t("inputNominalKeluar"),m=t("labelDiterima"),p=t("labelMasukKas"),k=t("infoTagihanGroup"),w=t("inputNominalBayar");a==="keluar"?(n&&(n.hidden=!0),e&&(e.hidden=!0),i&&(i.hidden=!0),k&&(k.hidden=!0),s&&(s.hidden=!0),r&&(r.hidden=!1),o&&(o.value=""),l&&(l.value=""),c&&(c.value=""),w&&(w.value=""),u&&(u.value=""),m&&(m.textContent="Uang Diterima Bendahara"),p&&(p.textContent="Uang Masuk Kas")):(n&&(n.hidden=!1),e&&(e.hidden=!1),i&&(i.hidden=!1),k&&(k.hidden=!1),s&&(s.hidden=!1),r&&(r.hidden=!0),g&&(g.value=""),m&&(m.textContent="Uang Diterima Bendahara"),p&&(p.textContent="Uang Masuk Kas")),na(),D()},X=()=>{const a=t("formTransaksi");a&&a.reset();const n=document.querySelector('input[name="jenisTransaksi"][value="masuk"]');n&&(n.checked=!0);const e=t("inputTagihan");e&&(e.value="");const i=t("inputDiterima");i&&(i.value="");const s=t("inputNominalKeluar");s&&(s.value="");const r=t("inputNominalBayar");r&&(r.value="",r.placeholder="0");const o=t("inputSisaTagihan");o&&(o.value="");const l=t("hasilKembalian");l&&(l.textContent=f(0));const c=t("hasilMasukKas");c&&(c.textContent=f(0));const u=t("inputTanggal");u&&(u.value=ga());const g=t("formError");g&&(g.hidden=!0,g.textContent="");const m=t("modalFormTitle");m&&(m.textContent="Tambah Transaksi");const p=t("btnSimpanText");p&&(p.textContent="Simpan Transaksi"),K="tambah",_=null,$()},_a=()=>{const a=document.querySelector('input[name="jenisTransaksi"]:checked')?.value||"masuk",n=t("inputSiswa")?.value||"",e=t("inputIuran")?.value||"",i=h(t("inputTagihan")?.value),s=h(t("inputDiterima")?.value),r=h(t("inputNominalBayar")?.value),o=h(t("inputNominalKeluar")?.value),l=t("inputTanggal")?.value||"",c=t("inputMetode")?.value||"",u=t("inputKategori")?.value||"",g=t("inputKeterangan")?.value.trim()||"",m=E.find(k=>String(k.id_siswa)===String(n)),p=S.find(k=>String(k.id)===String(e));return{jenis:a,siswa:m,iuran:p,tagihan:i,diterima:s,nominalBayar:r,nominalKeluar:o,tanggal:l,metode:c,kategori:u,keterangan:g}},Ca=a=>{const n=t("formError"),e=i=>{n&&(n.textContent=i,n.hidden=!1)};if(a.jenis!=="masuk"&&a.jenis!=="keluar")return e("Silakan pilih jenis transaksi."),!1;if(!a.tanggal)return e("Tanggal transaksi wajib diisi."),!1;if(!a.metode)return e("Silakan pilih metode transaksi."),!1;if(!a.kategori)return e("Silakan pilih kategori transaksi."),!1;if(a.jenis==="masuk"){if(!a.siswa)return e("Silakan pilih siswa terlebih dahulu."),!1;if(!a.iuran)return e("Silakan pilih iuran terlebih dahulu."),!1;const i=K==="edit"?v.find(c=>String(c.id)===String(_)):null,s=i&&String(i.iuranId)===String(a.iuran.id)&&a.nominalBayar<=Number(i.nominal||0)+.009;if(String(a.iuran.status||"").toLowerCase()!=="aktif"&&!s)return e("Iuran ini sudah berstatus Selesai dan tidak dapat menerima pembayaran baru."),!1;if(!a.tagihan)return e("Nominal tagihan belum tersedia."),!1;if(!a.nominalBayar)return e("Masukkan nominal pembayaran saat ini (boleh penuh atau cicilan)."),!1;const r=K==="edit"?v.find(c=>String(c.id)===String(_)):null,o=O(a.siswa.id_siswa,a.iuran.id,r?.id_transaksi??null),l=Math.max(Number(a.tagihan)-o,0);if(a.nominalBayar>l)return e(`Pembayaran melebihi sisa tagihan. Sisa tagihan saat ini ${f(l)}.`),!1;if(!a.diterima)return e("Masukkan jumlah uang yang diterima bendahara."),!1;if(a.diterima<a.nominalBayar)return e("Jumlah uang yang diterima masih kurang dari nominal pembayaran."),!1}return a.jenis==="keluar"&&!a.nominalKeluar?(e("Masukkan nominal pengeluaran."),!1):(n&&(n.hidden=!0,n.textContent=""),!0)},ja=()=>{const a=(t("cariTransaksi")?.value||"").trim().toLowerCase(),n=t("filterJenis")?.value||"semua",e=t("filterKategori")?.value||"semua",i=t("filterBulan")?.value||"semua";return v.filter(s=>{const r=[s.id,s.jenis,s.siswa,s.nis,s.iuran,s.iuranId,s.kategori,s.keterangan,s.metode,s.petugas].join(" ").toLowerCase(),o=!a||r.includes(a),l=n==="semua"||s.jenis===n,c=e==="semua"||String(s.kategori??"").toLowerCase()===String(e).toLowerCase(),u=String(s.tanggal||""),g=i==="semua"||u.slice(5,7)===i;return o&&l&&c&&g})},sa=a=>{const n=a.reduce((r,o)=>o.jenis!=="masuk"?r:r+Number(o.masukKas||o.nominal||0),0),e=a.reduce((r,o)=>o.jenis!=="keluar"?r:r+Number(o.nominal||0),0),i=n-e,s=a.length;t("sumMasuk")&&(t("sumMasuk").textContent=f(n)),t("sumMasukNote")&&(t("sumMasukNote").textContent=s===0?"Belum ada transaksi terfilter":`dari ${s} transaksi terfilter`),t("sumKeluar")&&(t("sumKeluar").textContent=f(e)),t("sumKeluarNote")&&(t("sumKeluarNote").textContent=s===0?"Belum ada transaksi terfilter":`dari ${s} transaksi terfilter`),t("sumSelisih")&&(t("sumSelisih").textContent=i>0?`+${f(i)}`:f(i)),t("sumSelisih")&&(t("sumSelisih").style.color=i>0?"var(--success)":i<0?"var(--danger)":"var(--text)"),t("sumSelisihNote")&&(t("sumSelisihNote").textContent="pemasukan − pengeluaran")},N=()=>{const a=t("isiTabelTransaksi"),n=t("emptyState"),e=t("tabelInfo");if(!a)return;const i=ja();if(a.innerHTML="",n&&(n.hidden=i.length!==0),!i.length){e&&(e.textContent="Menampilkan 0 transaksi"),sa(i);return}i.forEach(s=>{const r=document.createElement("tr"),o=String(s.metode||"").toLowerCase(),l=s.jenis==="masuk"?"Pemasukan":"Pengeluaran",c=s.jenis==="masuk"?Number(s.masukKas||s.nominal||0):Number(s.nominal||0);let u;s.jenis==="masuk"?u=`

                    <div class="student-cell">

                        <div class="student-avatar">
                            ${d(pa(s.siswa))}
                        </div>

                        <div>

                            <strong>
                                ${d(s.siswa||"-")}
                            </strong>

                            <small>
                                NIS ${d(s.nis||"-")}
                            </small>

                        </div>

                    </div>

                `:u=`

                    <div class="student-cell">

                        <div class="student-avatar">
                            <span class="material-symbols-outlined">
                                payments
                            </span>
                        </div>

                        <div>

                            <strong>
                                Pengeluaran Kas
                            </strong>

                            <small>
                                ${d(s.keterangan||"Transaksi pengeluaran")}
                            </small>

                        </div>

                    </div>

                `;const g=s.jenis==="masuk"?s.iuran||"Pembayaran Iuran":s.keterangan||"Pengeluaran Kas",m=s.jenis==="masuk"?s.keterangan||"Pembayaran iuran":`Kategori: ${Z(s.kategori)}`;r.innerHTML=`

                <td>

                    <span class="transaction-id">
                        ${d(s.id)}
                    </span>

                </td>


                <td>

                    <span class="type-badge type-badge--${d(s.jenis)}">
                        ${d(l)}
                    </span>

                </td>


                <td>

                    ${u}

                </td>


                <td>

                    <span class="transaction-description">

                        <strong>
                            ${d(g)}
                        </strong>

                        <small>
                            ${d(m)}
                        </small>

                    </span>

                </td>


                <td>

                    <span class="transaction-date">
                        ${d(z(s.tanggal))}
                    </span>

                    <small class="transaction-date">
                        ${d(s.tanggal||"-")}
                    </small>

                </td>


                <td>

                    <span class="method-badge method-badge--${d(o)}">
                        ${d(s.metode)}
                    </span>

                </td>


                <td class="cell-petugas">

                    ${d(s.petugas||"-")}

                </td>


                <td class="text-right">

                    <span class="nominal nominal--${d(s.jenis)}">

                        ${d(s.jenis==="keluar"?`-${f(c)}`:f(c))}

                    </span>

                </td>


                <td class="text-center">

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn"
                            data-aksi="detail"
                            data-id="${d(s.id)}"
                            title="Lihat detail"
                            aria-label="Lihat detail"
                        >

                            <span class="material-symbols-outlined">
                                visibility
                            </span>

                        </button>


                        <button
                            type="button"
                            class="action-btn"
                            data-aksi="ubah"
                            data-id="${d(s.id)}"
                            title="Ubah transaksi"
                            aria-label="Ubah transaksi"
                        >

                            <span class="material-symbols-outlined">
                                edit
                            </span>

                        </button>


                        <button
                            type="button"
                            class="action-btn action-btn--delete"
                            data-aksi="hapus"
                            data-id="${d(s.id)}"
                            title="Hapus transaksi"
                            aria-label="Hapus transaksi"
                        >

                            <span class="material-symbols-outlined">
                                delete
                            </span>

                        </button>

                    </div>

                </td>

            `,a.appendChild(r)}),e&&(e.textContent=`Menampilkan ${i.length} transaksi`),sa(i)},A=a=>{const n=t(a);n&&(n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},x=a=>{const n=t(a);n&&(n.classList.remove("is-open"),n.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},W=()=>{document.querySelectorAll(".modal-backdrop.is-open").forEach(a=>{a.classList.remove("is-open"),a.setAttribute("aria-hidden","true")}),document.body.classList.remove("modal-open")},Ba=()=>{X(),q(),A("modalForm")},$a=a=>{const n=v.find(i=>String(i.id)===String(a));if(!n)return;K="edit",_=a;const e=document.querySelector(`input[name="jenisTransaksi"][value="${n.jenis}"]`);e&&(e.checked=!0),$(),t("modalFormTitle")&&(t("modalFormTitle").textContent="Ubah Transaksi"),t("btnSimpanText")&&(t("btnSimpanText").textContent="Simpan Perubahan"),n.jenis==="masuk"?(q(n.iuranId),t("inputSiswa")&&(t("inputSiswa").value=n.id_siswa!=null?n.id_siswa:""),t("inputIuran")&&(t("inputIuran").value=n.iuranId!=null?n.iuranId:""),ia(),t("inputNominalBayar")&&(t("inputNominalBayar").value=new Intl.NumberFormat("id-ID").format(Number(n.nominal||0))),t("inputDiterima")&&(t("inputDiterima").value=new Intl.NumberFormat("id-ID").format(Number(n.diterima||0)))):t("inputNominalKeluar")&&(t("inputNominalKeluar").value=new Intl.NumberFormat("id-ID").format(Number(n.nominal||0))),t("inputKategori")&&(t("inputKategori").value=n.kategori||"",ea()),t("inputMetode")&&(t("inputMetode").value=n.metode||""),t("inputTanggal")&&(t("inputTanggal").value=n.tanggal||""),t("inputKeterangan")&&(t("inputKeterangan").value=n.keterangan||""),P(),A("modalForm")};let ra=0;const oa=a=>String(Math.max(0,Math.floor(Number(a)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,"."),Aa=a=>{const n=a.querySelector(".baris-siswa");n&&(n.innerHTML=`
            <option value="">- Tanpa siswa (kas umum) -</option>
            ${E.map(e=>`
                <option value="${d(e.id_siswa)}">
                    ${d(e.nama)} • ${d(e.nis)}
                </option>
            `).join("")}
        `)},Y=(a,n="")=>{const e=a.querySelector(".baris-iuran");if(!e)return;const i=a.querySelector(".baris-siswa")?.value||"",s=E.find(o=>String(o.id_siswa)===String(i)),r=S.filter(o=>o.status!=="aktif"?!1:o.id_kelas===null||o.id_kelas===void 0?!0:s&&String(o.id_kelas)===String(s.id_kelas));e.innerHTML=`
            <option value="">- Tanpa iuran -</option>
            ${r.map(o=>`
                <option value="${d(o.id)}">
                    ${d(o.nama)} • ${f(o.nominal)}
                </option>
            `).join("")}
        `,n&&[...e.options].some(o=>o.value===String(n))&&(e.value=String(n))},la=a=>{const n=a.querySelector(".baris-iuran")?.value||"",e=a.querySelector(".baris-siswa")?.value||"",i=a.querySelector(".baris-nominal"),s=a.querySelector(".baris-sisa-tagihan");if(!n||!e||!i||!s)return;const r=S.find(u=>String(u.id)===String(n));if(!r){i.value=oa(0),s.value="";return}const o=Number(r.nominal)||0,l=O(e,n),c=Math.max(o-l,0);i.value=oa(c),s.value=new Intl.NumberFormat("id-ID").format(c)},Ma=a=>{const n=a.querySelector(".baris-jenis")?.value||"masuk",e=a.querySelector(".baris-siswa"),i=a.querySelector(".baris-iuran"),s=n==="masuk";e&&(e.disabled=!s),i&&(i.disabled=!s),s||(e&&(e.value=""),i&&(i.value="")),Y(a)},Da=a=>`
        <div class="baris-transaksi" data-baris="${a}">
            <div class="baris-transaksi__head">
                <span class="baris-transaksi__nomor">Baris ${a+1}</span>

                <button type="button" class="icon-btn icon-btn--hapus" data-hapus-baris
                    aria-label="Hapus baris ${a+1}" title="Hapus baris">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>

            <div class="form-grid">
                <label class="field">
                    <span class="field__label">Data Siswa</span>
                    <select class="baris-siswa">
                        <option value="">- Tanpa siswa (kas umum) -</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Iuran</span>
                    <select class="baris-iuran">
                        <option value="">- Tanpa iuran -</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Jenis <b class="wajib">*</b></span>
                    <select class="baris-jenis">
                        <option value="masuk">Pemasukan</option>
                        <option value="keluar">Pengeluaran</option>
                    </select>
                </label>

                <label class="field">
                    <span class="field__label">Kategori <b class="wajib">*</b></span>
                    <select class="baris-kategori"></select>
                </label>

                <label class="field">
                    <span class="field__label">Tanggal <b class="wajib">*</b></span>
                    <input type="date" class="baris-tanggal">
                </label>

                <label class="field">
                    <span class="field__label">Sisa Tagihan</span>
                    <div class="money-input">
                        <span>Rp</span>
                        <input type="text" class="baris-sisa-tagihan" inputmode="numeric" placeholder="0" readonly>
                    </div>
                </label>

                <label class="field">
                    <span class="field__label">Nominal <b class="wajib">*</b></span>
                    <span class="input-uang">
                        <span class="input-uang__pre" aria-hidden="true">Rp</span>
                        <input type="text" class="baris-nominal" inputmode="numeric" placeholder="0" autocomplete="off">
                    </span>
                </label>

                <label class="field field--full">
                    <span class="field__label">Keterangan <b class="wajib">*</b></span>
                    <input type="text" class="baris-keterangan" placeholder="Contoh: setoran kas kelas" autocomplete="off">
                </label>
            </div>
        </div>
    `,ua=a=>{const n=a.querySelector(".baris-jenis")?.value||"masuk",e=a.querySelector(".baris-kategori");if(!e)return;const i=n==="masuk"?y:L,s=e.value;e.innerHTML=i.map(r=>`<option value="${d(r.value)}">${d(r.label)}</option>`).join(""),[...e.options].some(r=>r.value===s)&&(e.value=s)},ca=()=>{const a=t("isiBarisTransaksi");if(!a)return;const n=ra++;a.insertAdjacentHTML("beforeend",Da(n));const e=a.querySelector(`[data-baris="${n}"]`);if(!e)return;Aa(e),Y(e),ua(e);const i=e.querySelector(".baris-tanggal");if(i){const u=new Date;i.value=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}-${String(u.getDate()).padStart(2,"0")}`}e.querySelector(".baris-nominal")?.addEventListener("input",u=>{u.target.value=u.target.value.replace(/\D/g,"").replace(/\B(?=(\d{3})+(?!\d))/g,".")}),e.querySelector(".baris-jenis")?.addEventListener("change",()=>{ua(e),Ma(e);const u=e.querySelector(".baris-sisa-tagihan");u&&(u.value="")}),e.querySelector(".baris-siswa")?.addEventListener("change",()=>{Y(e),la(e)}),e.querySelector(".baris-iuran")?.addEventListener("change",()=>{la(e)});const o=e.querySelector(".baris-nominal"),l=e.querySelector(".baris-sisa-tagihan");o&&l&&o.addEventListener("input",u=>{const g=h(o.value),m=h(l.dataset.tagihanAwal||"0"),p=Math.max(m-g,0);l.value=new Intl.NumberFormat("id-ID").format(p),l.dataset.tagihanAwal||(l.dataset.tagihanAwal=m),Ia(e)});const c=e.querySelector(".baris-siswa");c?c.focus():e.querySelector(".baris-keterangan")?.focus()},qa=()=>{const a=t("isiBarisTransaksi");a&&a.querySelectorAll(".baris-transaksi").forEach((n,e)=>{const i=n.querySelector(".baris-transaksi__nomor");i&&(i.textContent=`Baris ${e+1}`)})},Pa=()=>{const a=t("isiBarisTransaksi");if(!a)return;a.innerHTML="",ra=0;const n=t("formBanyakError");n&&(n.hidden=!0),ca(),A("modalFormBanyak")},xa=()=>{const a=t("isiBarisTransaksi");if(!a)return{galat:["Form tidak ditemukan"],data:[]};const n=[],e=[];return a.querySelectorAll(".baris-transaksi").forEach((i,s)=>{const r=s+1,o=i.querySelector(".baris-jenis")?.value||"masuk",l=i.querySelector(".baris-kategori")?.value||"",c=i.querySelector(".baris-tanggal")?.value||"",u=h(i.querySelector(".baris-nominal")?.value||""),g=(i.querySelector(".baris-keterangan")?.value||"").trim(),m=o==="masuk",p=m&&i.querySelector(".baris-siswa")?.value||"",k=m&&i.querySelector(".baris-iuran")?.value||"",w=p?E.find(H=>String(H.id_siswa)===String(p)):null;c||n.push(`Baris ${r}: tanggal wajib diisi`),l||n.push(`Baris ${r}: kategori wajib dipilih`),u<=0&&n.push(`Baris ${r}: nominal wajib lebih dari 0`),g||n.push(`Baris ${r}: keterangan wajib diisi`),k&&!p&&n.push(`Baris ${r}: pilih siswa untuk pembayaran iuran`),c&&l&&u>0&&g&&!(k&&!p)&&e.push({tanggal:`${c} 00:00:00`,jenis:m?"pemasukan":"pengeluaran",kategori:l,nominal:u,uang_diterima:u,keterangan:g,metode:"CH",id_siswa:p?Number(p):null,id_iuran:k?Number(k):null,id_kelas:w?.id_kelas??null,nama_pembayar:w?.nama||""})}),!e.length&&!n.length&&n.push("Tambahkan minimal satu baris transaksi."),{galat:n,data:e}},Fa=async a=>{a.preventDefault();const n=t("formBanyakError"),{galat:e,data:i}=xa();if(e.length){n&&(n.textContent=e.join(" • "),n.hidden=!1);return}n&&(n.hidden=!0);const s=t("btnSimpanBanyak"),r=ma(s);if(r)try{const o=await J(B,"POST",{transaksi:i}),l=o.jumlah??i.length,c=o.no_bukti_per_siswa?Object.keys(o.no_bukti_per_siswa).length:1;x("modalFormBanyak"),I(c>1?`${l} transaksi dicatat untuk ${c} siswa/grup`:`${l} transaksi berhasil dicatat`),await F()}catch(o){n&&(n.textContent=o?.message||"Gagal menyimpan transaksi.",n.hidden=!1)}finally{r.pulihkan()}},Ha=async()=>{const a=t("formTransaksi")?.querySelector('button[type="submit"]'),n=ma(a);if(n)try{const e=_a();if(!Ca(e))return;const i=e.jenis==="masuk",s=i?e.nominalBayar:e.nominalKeluar,r={id_siswa:i&&e.siswa?e.siswa.id_siswa:null,id_iuran:i&&e.iuran?e.iuran.id:null,tanggal:`${e.tanggal} 00:00:00`,nominal:s,keterangan:e.keterangan||(i?"Pembayaran iuran":"Pengeluaran kas"),nama_pembayar:i&&e.siswa?e.siswa.nama:"",metode:e.metode==="Transfer"?"TF":"CH",jenis:i?"pemasukan":"pengeluaran",kategori:e.kategori||null,periode:"",uang_diterima:i?e.diterima:s,kembalian:0};try{if(K==="edit"){const o=v.find(l=>String(l.id)===String(_));if(!o)return;await J(`${B}/${o.id_transaksi}`,"PUT",r),I("Transaksi berhasil diperbarui.")}else await J(B,"POST",r),I("Transaksi berhasil ditambahkan.")}catch(o){const l=t("formError");l&&(l.textContent=o.message,l.hidden=!1);return}await F(),x("modalForm"),X()}finally{n.pulihkan()}},Ra=a=>{const n=v.find(o=>String(o.id)===String(a));if(!n)return;const e=n.jenis==="masuk";t("modalDetailTitle")&&(t("modalDetailTitle").textContent=n.id),t("detailJenis")&&(t("detailJenis").textContent=e?"Pemasukan":"Pengeluaran"),t("detailMetode")&&(t("detailMetode").textContent=n.metode||"-"),t("detailKategori")&&(t("detailKategori").textContent=Z(n.kategori)),t("detailSiswa")&&(t("detailSiswa").textContent=e?`${n.siswa||"-"} (${n.nis||"-"})`:"-"),t("detailIuran")&&(t("detailIuran").textContent=e&&n.iuran||"-"),t("detailTanggal")&&(t("detailTanggal").textContent=z(n.tanggal)),t("detailPetugas")&&(t("detailPetugas").textContent=n.petugas||"-"),t("detailKeterangan")&&(t("detailKeterangan").textContent=n.keterangan||"Tidak ada keterangan.");const i=t("detailSiswaItem"),s=t("detailIuranItem"),r=t("detailUangRincian");i&&(i.hidden=!e),s&&(s.hidden=!e),r&&(r.hidden=!e),t("rincianTagihan")&&(t("rincianTagihan").textContent=f(n.nominal)),t("rincianDiterima")&&(t("rincianDiterima").textContent=f(n.diterima)),t("rincianKembalian")&&(t("rincianKembalian").textContent=f(n.kembalian)),t("rincianMasukKas")&&(t("rincianMasukKas").textContent=f(n.masukKas)),A("modalDetail")},Ua=a=>{const n=v.find(i=>String(i.id)===String(a));if(!n)return;C=a;const e=t("hapusText");e&&(e.textContent=`Hapus ${n.id}`),A("modalHapus")},Ga=async()=>{if(!C)return;const a=v.find(e=>String(e.id)===String(C));if(!a){x("modalHapus"),C=null;return}try{await va(`${B}/${a.id_transaksi}`)}catch(e){I(e.message);return}const n=C;C=null,x("modalHapus"),await F(),I(`${n} berhasil dihapus.`)},I=a=>{const n=t("toast"),e=t("toastText");!n||!e||(e.textContent=a,n.classList.add("is-muncul"),clearTimeout(Q),Q=setTimeout(()=>{n.classList.remove("is-muncul")},2600))},da=()=>{t("cariTransaksi")&&(t("cariTransaksi").value=""),t("filterJenis")&&(t("filterJenis").value="semua"),t("filterKategori")&&(t("filterKategori").value="semua"),t("filterBulan")&&(t("filterBulan").value="semua"),N()},Ja=()=>{const a=t("sidebarToggle"),n=t("sidebarBackdrop"),e=t("sidebar"),i=()=>{document.body.classList.add("nav-open")},s=()=>{document.body.classList.remove("nav-open")};a&&a.addEventListener("click",()=>{document.body.classList.contains("nav-open")?s():i()}),n&&n.addEventListener("click",s),e&&e.querySelectorAll(".side-link").forEach(r=>{r.addEventListener("click",()=>{s()})}),window.addEventListener("resize",()=>{window.innerWidth>1024&&s()})},Oa=()=>{const a=t("profileButton"),n=t("profileDropdown");!a||!n||(a.addEventListener("click",e=>{e.stopPropagation();const i=n.classList.toggle("is-open");a.setAttribute("aria-expanded",String(i))}),document.addEventListener("click",e=>{!n.contains(e.target)&&!a.contains(e.target)&&(n.classList.remove("is-open"),a.setAttribute("aria-expanded","false"))}))},Xa=()=>{const a=t("sidebarLogout"),n=t("dropdownLogout"),e=()=>{window.location.href="/logout"};a&&a.addEventListener("click",e),n&&n.addEventListener("click",e)},Wa=()=>{const a=t("cariTransaksi"),n=t("filterJenis"),e=t("filterKategori"),i=t("filterBulan"),s=t("btnResetFilter"),r=t("btnKosongkanFilter"),o=t("btnTambahTransaksi"),l=t("inputSiswa"),c=t("inputIuran"),u=t("inputDiterima"),g=t("inputNominalBayar"),m=t("inputNominalKeluar"),p=t("formTransaksi"),k=t("isiTabelTransaksi"),w=t("btnKonfirmasiHapus");a&&a.addEventListener("input",N),n&&n.addEventListener("change",N),e&&e.addEventListener("change",N),i&&i.addEventListener("change",N),s&&s.addEventListener("click",da),r&&r.addEventListener("click",da),o&&o.addEventListener("click",Ba);const H=t("btnTambahBanyak");H&&H.addEventListener("click",Pa),t("btnTambahBaris")?.addEventListener("click",ca),t("isiBarisTransaksi")?.addEventListener("click",b=>{const T=b.target.closest("[data-hapus-baris]");if(!T)return;const j=T.closest(".baris-transaksi");if(!j)return;if((t("isiBarisTransaksi")?.querySelectorAll(".baris-transaksi").length||0)<=1){I("Minimal satu baris transaksi harus ada.");return}j.remove(),qa()}),t("formTransaksiBanyak")?.addEventListener("submit",Fa),document.querySelectorAll('input[name="jenisTransaksi"]').forEach(b=>{b.addEventListener("change",()=>{Na(),$()})}),t("inputKategori")?.addEventListener("change",ea),l&&l.addEventListener("change",D),c&&c.addEventListener("change",ia),g&&g.addEventListener("input",()=>{U(g),P()}),u&&u.addEventListener("input",()=>{U(u),P()}),m&&m.addEventListener("input",()=>{U(m)}),p&&p.addEventListener("submit",b=>{b.preventDefault(),Ha()}),k&&k.addEventListener("click",b=>{const T=b.target.closest("[data-aksi]");if(!T)return;const j=T.dataset.aksi,R=T.dataset.id;j==="detail"&&Ra(R),j==="ubah"&&$a(R),j==="hapus"&&Ua(R)}),w&&w.addEventListener("click",Ga),document.querySelectorAll("[data-tutup-modal]").forEach(b=>{b.addEventListener("click",W)}),document.querySelectorAll(".modal-backdrop").forEach(b=>{b.addEventListener("click",T=>{T.target===b&&W()})}),document.addEventListener("keydown",b=>{b.key==="Escape"&&(W(),document.body.classList.remove("nav-open"))})},F=async()=>{const a=t("isiTabelTransaksi");a&&(a.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="9"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));let n={data:[]},e={data:[]},i={data:[]};try{[n,e,i]=await Promise.all([M(fa),M(ka),M(B)])}catch(s){console.error(s),I(s.message);return}E=(Array.isArray(n?.data)?n.data:[]).map(Ta),S=(Array.isArray(e?.data)?e.data:[]).map(Ea),v=(Array.isArray(i?.data)?i.data:[]).map(Ka),aa(),q(),N()};G=ha(),La(),aa(),q(),ta(),Ja(),Oa(),Xa(),Wa(),$(),N(),X(),Sa().finally(F)});
