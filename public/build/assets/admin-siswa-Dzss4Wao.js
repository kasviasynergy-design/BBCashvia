import{k as G,b as ca}from"./simpan-guard-D5jj-dSF.js";import{a as pa,s as ba,i as fa}from"./admin-filter-kelas-BaTSLq81.js";(function(){const _="/admin/api/siswa",T="/admin/api/kelas",a=e=>document.getElementById(e);let y=[],v=[],w=[],E="tambah",j=null,x=null,C="tambah",I=null,A=null,H="siswa",m=1,K=1,P=0;const u=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t]),U=e=>String(e||"?").trim().split(/\s+/).slice(0,2).map(t=>t.charAt(0)).join("").toUpperCase(),S=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(e)||0),p=e=>{const t=a("toast"),s=a("toastText");if(!t||!s){alert(e);return}s.textContent=e,t.classList.add("is-muncul"),clearTimeout(t._timer),t._timer=setTimeout(()=>{t.classList.remove("is-muncul")},2800)},B=e=>{const t=a("formError");t?(t.textContent=e,t.hidden=!1):p(e)},$=()=>{const e=a("formError");e&&(e.textContent="",e.hidden=!0)},z=(e,t)=>{if(e?.errors){const s=Object.values(e.errors).flat().filter(Boolean);if(s.length)return s.join(" ")}return e?.message?e.message:t===401||t===403?"Akses ditolak. Pastikan kamu sudah login sebagai Admin.":t===419?"Sesi berakhir. Muat ulang halaman lalu coba lagi.":t>=500?"Terjadi gangguan pada server. Coba lagi beberapa saat.":"Terjadi kesalahan saat menghubungi server."},k=async(e,t={})=>{const s=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),n={Accept:"application/json",...t.body?{"Content-Type":"application/json"}:{},...s?{"X-CSRF-TOKEN":s}:{},...t.headers||{}};let i;const r=new AbortController,o=setTimeout(()=>r.abort(),3e4);try{i=await fetch(e,ca({...t,headers:n,credentials:"same-origin",signal:r.signal}))}catch(d){throw clearTimeout(o),d?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.")}clearTimeout(o);let l={};try{l=await i.json()}catch{}if(!i.ok)throw new Error(z(l,i.status));return l},V=e=>{const t=new URLSearchParams({serverSide:"1",page:String(e)}),s=a("cariSiswa")?.value.trim()||"",n=a("filterKelas")?.value||"semua",i=a("filterJk")?.value||"semua",r=a("filterIuran")?.value||"semua";return s&&t.set("q",s),n!=="semua"&&t.set("id_kelas",n),(i==="L"||i==="P")&&t.set("jenis_kelamin",i),["lunas","sebagian","belum"].includes(r)&&t.set("status_iuran",r),`${_}?${t.toString()}`},b=async(e=m)=>{const t=++P,s=a("isiTabelSiswa");s&&(s.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="6"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));try{const n=await k(V(e));if(t!==P)return;y=Array.isArray(n?.data)?n.data:[],v=Array.isArray(n?.kelas)?n.kelas:[],N(),J(y),O(n?.statistik),q(n?.pagination),ba(a("filterKelas")?.value,{halaman:m})}catch(n){if(t!==P)return;console.error("Gagal memuat data siswa:",n),y=[],J([]),O(null),q(null),p(n.message)}},N=()=>{const e=a("filterKelas"),t=a("inputKelas");if(fa(e,v),t){const s=t.value;t.innerHTML=`
                <option value="">- Pilih kelas -</option>
                ${v.length?v.map(n=>`
                        <option value="${u(n.id_kelas)}">
                            ${u(n.nama_kelas)}
                        </option>
                    `).join(""):'<option value="" disabled>Belum ada kelas tersedia</option>'}
            `,v.some(n=>String(n.id_kelas)===s)?t.value=s:t.value=""}},F=async()=>{try{const e=await k(T);w=Array.isArray(e.data)?e.data:[],M(w)}catch(e){console.error("Gagal memuat data kelas:",e),w=[],M([]),p(e.message)}},M=e=>{const t=a("isiTabelKelas"),s=a("emptyStateKelas"),n=a("tabelInfoKelas");t&&(t.innerHTML=e.map(i=>{const r=u(i.id_kelas),o=u(i.nama_kelas),l=u(i.tingkat||""),d=u(i.tahun_ajaran||""),f=u(i.jumlah_siswa??0);return`
                <tr>
                    <td>
                        <div class="siswa-cell">
                            <div class="siswa-cell__avatar">
                                ${u(i.nama_kelas.charAt(0))}
                            </div>
                            <div class="siswa-cell__info">
                                <span class="siswa-cell__nama">${o}</span>
                                <span class="siswa-cell__nis">ID ${r}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="cell-kelas">${l}</span>
                    </td>
                    <td>
                        <span>${d}</span>
                    </td>
                    <td>
                        <span class="badge badge--none">${f} siswa</span>
                    </td>
                    <td class="td-aksi">
                        <div class="aksi-grup">
                            <button
                                type="button"
                                class="btn-aksi"
                                data-aksi="ubah-kelas"
                                data-id="${r}"
                                aria-label="Ubah ${o}"
                                title="Ubah">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                type="button"
                                class="btn-aksi btn-aksi--hapus"
                                data-aksi="hapus-kelas"
                                data-id="${r}"
                                aria-label="Hapus ${o}"
                                title="Hapus">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join(""),s&&(s.hidden=e.length!==0),n&&(n.textContent=`${e.length} kelas ditampilkan`))},X=()=>{C="tambah",I=null,a("formKelas").reset(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="",a("modalFormKelasEyebrow").textContent="KELAS BARU",a("modalFormKelasTitle").textContent="Tambah Kelas",a("btnSimpanKelasText").textContent="Simpan Kelas",h("modalFormKelas"),setTimeout(()=>a("inputNamaKelas")?.focus(),120)},Q=e=>{const t=w.find(s=>String(s.id_kelas)===String(e));t&&(C="ubah",I=t.id_kelas,a("formKelas").reset(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="",a("modalFormKelasEyebrow").textContent="UBAH DATA KELAS",a("modalFormKelasTitle").textContent=`Ubah ${t.nama_kelas}`,a("btnSimpanKelasText").textContent="Simpan Perubahan",a("inputNamaKelas").value=t.nama_kelas,a("inputTingkat").value=t.tingkat||"",a("inputTahunAjaran").value=t.tahun_ajaran||"",h("modalFormKelas"),setTimeout(()=>a("inputNamaKelas")?.focus(),120))},Y=async e=>{e.preventDefault(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="";const t=a("inputNamaKelas").value.trim(),s=a("inputTingkat").value.trim()||null,n=a("inputTahunAjaran").value.trim()||null,i=[];if(t||i.push("Nama kelas wajib diisi."),t.length>50&&i.push("Nama kelas maksimal 50 karakter."),i.length){a("formErrorKelas").textContent=i.join(" "),a("formErrorKelas").hidden=!1;return}const r=a("formKelas").querySelector('[type="submit"]'),o=G(r);if(o)try{const l={nama_kelas:t,tingkat:s,tahun_ajaran:n},d=C==="ubah"?await k(`${T}/${encodeURIComponent(I)}`,{method:"PUT",body:JSON.stringify(l)}):await k(T,{method:"POST",body:JSON.stringify(l)});g("modalFormKelas"),p(d.message||(C==="ubah"?"Data kelas berhasil diperbarui.":"Data kelas berhasil ditambahkan.")),F()}catch(l){a("formErrorKelas").textContent=l.message,a("formErrorKelas").hidden=!1}finally{o.pulihkan()}},Z=e=>{const t=w.find(s=>String(s.id_kelas)===String(e));t&&(A=t.id_kelas,a("hapusKelasText").textContent=`Kelas ${t.nama_kelas} akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`,h("modalHapusKelas"))},aa=async()=>{if(A===null)return;const e=a("btnKonfirmasiHapusKelas");e&&(e.disabled=!0);try{const t=await k(`${T}/${encodeURIComponent(A)}`,{method:"DELETE"});g("modalHapusKelas"),A=null,p(t.message||"Data kelas berhasil dihapus."),F()}catch(t){p(t.message)}finally{e&&(e.disabled=!1)}},R=e=>{if(e===H)return;H=e;const t=a("panelSiswa"),s=a("panelKelas"),n=a("tabSiswa"),i=a("tabKelas"),r=a("btnTambahSiswa"),o=a("btnTambahKelas");e==="kelas"?(t&&(t.hidden=!0),s&&(s.hidden=!1),n&&(n.classList.remove("is-active"),n.classList.add("btn--ghost"),n.classList.remove("btn--primary"),n.setAttribute("aria-selected","false")),i&&(i.classList.remove("btn--ghost"),i.classList.add("btn--primary","is-active"),i.setAttribute("aria-selected","true")),r&&r.classList.add("hidden"),o&&o.classList.remove("hidden"),F()):(t&&(t.hidden=!1),s&&(s.hidden=!0),n&&(n.classList.remove("btn--ghost"),n.classList.add("btn--primary","is-active"),n.setAttribute("aria-selected","true")),i&&(i.classList.remove("btn--primary","is-active"),i.classList.add("btn--ghost"),i.setAttribute("aria-selected","false")),r&&r.classList.remove("hidden"),o&&o.classList.add("hidden"),b())},ta=e=>{const t=u(e.id_siswa),s=u(e.nis),n=u(e.nama),i=u(e.kelas||"Belum ditentukan");u(e.status||"Aktif");const r=e.jenis_kelamin==="Laki-Laki"?"Laki-laki":e.jenis_kelamin==="Perempuan"?"Perempuan":"-",o=e.no_hp?u(e.no_hp):"-",l=String(e.status_iuran??"").toLowerCase(),d=l==="lunas"?'<span class="badge badge--ok">Sudah Bayar</span>':l==="sebagian"?'<span class="badge badge--partial">Sebagian</span>':'<span class="badge badge--none">Belum Bayar</span>';return`
            <tr>
                <td>
                    <div class="siswa-cell">
                        <div class="siswa-cell__avatar">
                            ${u(U(e.nama))}
                        </div>
                        <div class="siswa-cell__info">
                            <span class="siswa-cell__nama">
                                ${n}
                            </span>
                            <span class="siswa-cell__nis">
                                NIS ${s}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="cell-kelas">${i}</span>
                </td>

                <td>
                    <span>${r}</span>
                </td>

                <td>
                    <span class="cell-kontak">${o}</span>
                </td>

                <td>
                    ${d}
                </td>

                <td class="td-aksi">
                    <div class="aksi-grup">
                        <button
                            type="button"
                            class="btn-aksi"
                            data-aksi="detail"
                            data-id="${t}"
                            aria-label="Detail ${n}"
                            title="Detail">
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        </button>

                        <button
                            type="button"
                            class="btn-aksi"
                            data-aksi="ubah"
                            data-id="${t}"
                            aria-label="Ubah ${n}"
                            title="Ubah">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="btn-aksi btn-aksi--hapus"
                            data-aksi="hapus"
                            data-id="${t}"
                            aria-label="Hapus ${n}"
                            title="Hapus">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        `},J=e=>{const t=a("isiTabelSiswa"),s=a("emptyState");t&&(t.innerHTML=e.map(ta).join(""),s&&(s.hidden=e.length!==0))},q=e=>{const t=e&&typeof e=="object"?e:{total:0,current_page:1,last_page:1,from:0,to:0};m=Number(t.current_page)||1,K=Math.max(1,Number(t.last_page)||1);const s=`Menampilkan ${t.from??0}-${t.to??0} dari ${t.total??0} siswa • Halaman ${m} dari ${K}`;a("tabelInfo")&&(a("tabelInfo").textContent=s),a("paginationInfo")&&(a("paginationInfo").textContent=s);const n=a("pageNumbers");if(n){n.innerHTML="";const i=5;let r=Math.max(1,m-Math.floor(i/2)),o=Math.min(K,r+i-1);r=Math.max(1,o-i+1);for(let l=r;l<=o;l++){const d=document.createElement("button");d.type="button",d.className="page-btn",d.dataset.halaman=String(l),d.textContent=String(l),l===m&&d.classList.add("is-active","active"),n.appendChild(d)}}a("prevPage")&&(a("prevPage").disabled=m<=1),a("nextPage")&&(a("nextPage").disabled=m>=K)},O=e=>{const t=e&&typeof e=="object"?e:{total:0,laki_laki:0,perempuan:0,belum_lunas:0};a("sumTotal")&&(a("sumTotal").textContent=t.total??0),a("sumLk")&&(a("sumLk").textContent=t.laki_laki??0),a("sumPr")&&(a("sumPr").textContent=t.perempuan??0),a("sumBelum")&&(a("sumBelum").textContent=t.belum_lunas??0),a("sumTotalNote")&&(a("sumTotalNote").textContent=Number(t.total)>0?"siswa terdaftar":"belum ada siswa"),a("sumLkNote")&&(a("sumLkNote").textContent="siswa laki-laki"),a("sumPrNote")&&(a("sumPrNote").textContent="siswa perempuan"),a("sumBelumNote")&&(a("sumBelumNote").textContent="belum bayar / sebagian")},L=()=>{m=1,b(1)},W=()=>{a("cariSiswa")&&(a("cariSiswa").value=""),a("filterKelas")&&(a("filterKelas").value="semua"),a("filterJk")&&(a("filterJk").value="semua"),a("filterIuran")&&(a("filterIuran").value="semua"),L()},h=e=>{const t=a(e);t&&(t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},g=e=>{const t=a(e);t&&(t.classList.remove("is-open"),t.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},ea=()=>{document.querySelectorAll(".modal-backdrop.is-open").forEach(e=>g(e.id))},na=()=>{if(E="tambah",j=null,a("formSiswa").reset(),v.length===0){b().then(()=>{N(),$(),a("modalFormEyebrow").textContent="SISWA BARU",a("modalFormTitle").textContent="Tambah Siswa",a("btnSimpanText").textContent="Simpan Siswa",h("modalForm"),setTimeout(()=>a("inputNis")?.focus(),120)});return}N(),$(),a("modalFormEyebrow").textContent="SISWA BARU",a("modalFormTitle").textContent="Tambah Siswa",a("btnSimpanText").textContent="Simpan Siswa",h("modalForm"),setTimeout(()=>a("inputNis")?.focus(),120)},sa=e=>{const t=y.find(i=>String(i.id_siswa)===String(e));if(!t)return;E="ubah",j=t.id_siswa,a("formSiswa").reset(),N(),$(),a("modalFormEyebrow").textContent="UBAH DATA SISWA",a("modalFormTitle").textContent=`Ubah ${t.nama}`,a("btnSimpanText").textContent="Simpan Perubahan",a("inputNis").value=t.nis,a("inputNama").value=t.nama,a("inputKelas").value=t.id_kelas??"",a("inputHp")&&(a("inputHp").value=t.no_hp??"");const s=document.querySelectorAll('input[name="jenisKelamin"]'),n=t.jenis_kelamin==="Laki-Laki"?"L":t.jenis_kelamin==="Perempuan"?"P":"L";s.forEach(i=>{i.checked=i.value===n}),h("modalForm"),setTimeout(()=>a("inputNama")?.focus(),120)},ia=async e=>{e.preventDefault(),$();const t=a("inputNis").value.trim(),s=a("inputNama").value.trim(),n=a("inputKelas").value,i=a("inputHp")?a("inputHp").value.trim():"",r=document.querySelector('input[name="jenisKelamin"]:checked'),o=r?r.value:null,l=[];if(t||l.push("NIS wajib diisi."),t.length>11&&l.push("NIS maksimal 11 karakter."),s.length<3&&l.push("Nama siswa minimal 3 karakter."),n||l.push("Jurusan wajib dipilih."),i&&!/^[0-9+\-\s]{8,20}$/.test(i)&&l.push("Nomor HP tidak valid."),l.length){B(l.join(" "));return}const d=a("formSiswa").querySelector('[type="submit"]'),f=G(d);if(f)try{const c={nis:t,nama:s,id_kelas:Number(n),jenis_kelamin:o,no_hp:i||null},D=E==="ubah"?await k(`${_}/${encodeURIComponent(j)}`,{method:"PUT",body:JSON.stringify(c)}):await k(_,{method:"POST",body:JSON.stringify(c)});g("modalForm"),p(D.message||(E==="ubah"?"Data siswa berhasil diperbarui.":"Data siswa berhasil ditambahkan.")),b()}catch(c){B(c.message)}finally{f.pulihkan()}},la=e=>{const t=y.find(c=>String(c.id_siswa)===String(e));if(!t)return;a("detailNama").textContent=t.nama,a("detailNamaKecil").textContent=t.nama,a("detailAvatar").textContent=U(t.nama),a("detailKelas").textContent=t.kelas||"Belum ditentukan",a("detailNis").textContent=t.nis,a("detailJk")&&(a("detailJk").textContent="-",a("detailJk").classList.remove("chip--lk","chip--pr"));const s=t.jenis_kelamin||"Belum tersedia";a("detailJkTeks").textContent=s,a("detailHp").textContent=t.no_hp?t.no_hp:"Belum diisi";const n=Array.isArray(t.riwayat)?t.riwayat:[],i=Number(t.total_dibayar)||0,r=String(t.status_iuran??"").toLowerCase(),o=Number(t.tagihan_iuran)||0,l=Number(t.terbayar_iuran)||0,d=a("detailStatus");d&&(r==="lunas"?(d.textContent=`Sudah bayar ${S(l)}`,d.className="badge badge--ok"):r==="sebagian"?(d.textContent=`Dibayar ${S(l)} dari ${S(o)}`,d.className="badge badge--partial"):(d.textContent=o>0?`Belum bayar • tagihan ${S(o)}`:"Belum ada tagihan iuran aktif",d.className="badge badge--none"));const f=a("riwayatIuran");f&&(n.length===0?f.innerHTML=`
                    <div class="riwayat-baris">
                        <span class="riwayat-baris__bulan">
                            Belum ada riwayat pembayaran
                        </span>
                        <span class="riwayat-baris__nominal">-</span>
                    </div>
                `:(f.innerHTML=n.map(c=>{const D=c.periode||(c.tanggal?String(c.tanggal).slice(0,10):"-"),ma=c.keterangan?` • ${u(c.keterangan)}`:"";return`
                            <div class="riwayat-baris">
                                <span class="riwayat-baris__bulan">
                                    ${u(D)}${ma}
                                </span>
                                <span class="riwayat-baris__nominal">
                                    ${S(c.nominal)}
                                </span>
                            </div>
                        `}).join(""),f.innerHTML+=`
                    <div class="riwayat-baris">
                        <span class="riwayat-baris__bulan">
                            <strong>Total dibayar</strong>
                        </span>
                        <span class="riwayat-baris__nominal">
                            <strong>${S(i)}</strong>
                        </span>
                    </div>
                `)),h("modalDetail")},ra=e=>{const t=y.find(s=>String(s.id_siswa)===String(e));t&&(x=t.id_siswa,a("hapusText").textContent=`Data siswa ${t.nama} (NIS ${t.nis}, ${t.kelas||"jurusan belum ditentukan"}) akan dihapus. Tindakan ini tidak dapat dibatalkan.`,h("modalHapus"))},oa=async()=>{if(x===null)return;const e=a("btnKonfirmasiHapus");e&&(e.disabled=!0);try{const t=await k(`${_}/${encodeURIComponent(x)}`,{method:"DELETE"});g("modalHapus"),x=null,p(t.message||"Data siswa berhasil dihapus."),b()}catch(t){p(t.message)}finally{e&&(e.disabled=!1)}},da=()=>{const e=a("sidebarToggle"),t=a("sidebarBackdrop"),s=()=>document.body.classList.remove("nav-open");e&&e.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),t&&t.addEventListener("click",s),window.addEventListener("resize",()=>{window.innerWidth>1024&&s()});const n=a("profileBtn"),i=a("profileMenu"),r=()=>{i?.classList.remove("is-open"),n?.setAttribute("aria-expanded","false")};n&&i&&(n.addEventListener("click",l=>{l.stopPropagation();const d=i.classList.toggle("is-open");n.setAttribute("aria-expanded",d?"true":"false")}),document.addEventListener("click",l=>{!i.contains(l.target)&&!n.contains(l.target)&&r()})),document.addEventListener("keydown",l=>{l.key==="Escape"&&(s(),r(),ea())});const o=a("topbarDate");o&&(o.textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))},ua=()=>{a("cariSiswa")?.addEventListener("input",L),a("filterKelas")?.addEventListener("change",L),a("filterJk")?.addEventListener("change",L),a("filterIuran")?.addEventListener("change",L),a("prevPage")?.addEventListener("click",()=>{m>1&&b(m-1)}),a("nextPage")?.addEventListener("click",()=>{m<K&&b(m+1)}),a("pageNumbers")?.addEventListener("click",e=>{const t=e.target.closest("button[data-halaman]");if(!t)return;const s=Number(t.dataset.halaman);Number.isFinite(s)&&b(s)}),a("btnResetFilter")?.addEventListener("click",W),a("btnKosongkanFilter")?.addEventListener("click",W),a("btnTambahSiswa")?.addEventListener("click",na),a("inputNis")?.addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,11)}),a("formSiswa")?.addEventListener("submit",ia),a("isiTabelSiswa")?.addEventListener("click",e=>{const t=e.target.closest("button[data-aksi]");if(!t)return;const{aksi:s,id:n}=t.dataset;s==="detail"&&la(n),s==="ubah"&&sa(n),s==="hapus"&&ra(n)}),a("btnKonfirmasiHapus")?.addEventListener("click",oa),a("tabSiswa")?.addEventListener("click",()=>R("siswa")),a("tabKelas")?.addEventListener("click",()=>R("kelas")),a("btnTambahKelas")?.addEventListener("click",X),a("formKelas")?.addEventListener("submit",Y),a("isiTabelKelas")?.addEventListener("click",e=>{const t=e.target.closest("button[data-aksi]");if(!t)return;const{aksi:s,id:n}=t.dataset;s==="ubah-kelas"&&Q(n),s==="hapus-kelas"&&Z(n)}),a("btnKonfirmasiHapusKelas")?.addEventListener("click",aa),document.querySelectorAll("[data-tutup-modal]").forEach(e=>{e.addEventListener("click",()=>{g(e.dataset.tutupModal)})}),document.querySelectorAll(".modal-backdrop").forEach(e=>{e.addEventListener("mousedown",t=>{t.target===e&&g(e.id)})})};da(),ua(),a("filterKelas")&&(a("filterKelas").value=pa()),b()})();
