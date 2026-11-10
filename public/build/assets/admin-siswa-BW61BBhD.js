import{k as J,b as oa}from"./simpan-guard-D5jj-dSF.js";(function(){const K="/admin/api/siswa",_="/admin/api/kelas",a=e=>document.getElementById(e);let h=[],b=[],S=[],T="tambah",$=null,E=null,C="tambah",j=null,x=null,N=!1,H="siswa";const u=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t]),F=e=>String(e||"?").trim().split(/\s+/).slice(0,2).map(t=>t.charAt(0)).join("").toUpperCase(),v=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(e)||0),c=e=>{const t=a("toast"),s=a("toastText");if(!t||!s){alert(e);return}s.textContent=e,t.classList.add("is-muncul"),clearTimeout(t._timer),t._timer=setTimeout(()=>{t.classList.remove("is-muncul")},2800)},P=e=>{const t=a("formError");t?(t.textContent=e,t.hidden=!1):c(e)},A=()=>{const e=a("formError");e&&(e.textContent="",e.hidden=!0)},M=(e,t)=>{if(e?.errors){const s=Object.values(e.errors).flat().filter(Boolean);if(s.length)return s.join(" ")}return e?.message?e.message:t===401||t===403?"Akses ditolak. Pastikan kamu sudah login sebagai Admin.":t===419?"Sesi berakhir. Muat ulang halaman lalu coba lagi.":t>=500?"Terjadi gangguan pada server. Coba lagi beberapa saat.":"Terjadi kesalahan saat menghubungi server."},k=async(e,t={})=>{const s=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),n={Accept:"application/json",...t.body?{"Content-Type":"application/json"}:{},...s?{"X-CSRF-TOKEN":s}:{},...t.headers||{}};let i;const l=new AbortController,o=setTimeout(()=>l.abort(),3e4);try{i=await fetch(e,oa({...t,headers:n,credentials:"same-origin",signal:l.signal}))}catch(d){throw clearTimeout(o),d?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.")}clearTimeout(o);let r={};try{r=await i.json()}catch{}if(!i.ok)throw new Error(M(r,i.status));return r},w=async()=>{if(N)return;N=!0;const e=a("isiTabelSiswa");e&&(e.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="6"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));try{const t=await k(K);h=Array.isArray(t.data)?t.data:[],b=Array.isArray(t.kelas)?t.kelas:[],h.sort((s,n)=>String(s.nis).localeCompare(String(n.nis))),L(),g()}catch(t){console.error("Gagal memuat data siswa:",t),h=[],b=[],L(),g(),c(t.message)}finally{N=!1}},L=()=>{const e=a("filterKelas"),t=a("inputKelas");if(e){const s=e.value||"semua";e.innerHTML=`
                <option value="semua">Semua Kelas</option>
                ${b.map(n=>`
                    <option value="${u(n.id_kelas)}">
                        ${u(n.nama_kelas)}
                    </option>
                `).join("")}
            `,e.value=b.some(n=>String(n.id_kelas)===s)?s:"semua"}if(t){const s=t.value;t.innerHTML=`
                <option value="">- Pilih kelas -</option>
                ${b.length?b.map(n=>`
                        <option value="${u(n.id_kelas)}">
                            ${u(n.nama_kelas)}
                        </option>
                    `).join(""):'<option value="" disabled>Belum ada kelas tersedia</option>'}
            `,b.some(n=>String(n.id_kelas)===s)?t.value=s:t.value=""}},I=async()=>{try{const e=await k(_);S=Array.isArray(e.data)?e.data:[],B(S)}catch(e){console.error("Gagal memuat data kelas:",e),S=[],B([]),c(e.message)}},B=e=>{const t=a("isiTabelKelas"),s=a("emptyStateKelas"),n=a("tabelInfoKelas");t&&(t.innerHTML=e.map(i=>{const l=u(i.id_kelas),o=u(i.nama_kelas),r=u(i.tingkat||""),d=u(i.tahun_ajaran||""),p=u(i.jumlah_siswa??0);return`
                <tr>
                    <td>
                        <div class="siswa-cell">
                            <div class="siswa-cell__avatar">
                                ${u(i.nama_kelas.charAt(0))}
                            </div>
                            <div class="siswa-cell__info">
                                <span class="siswa-cell__nama">${o}</span>
                                <span class="siswa-cell__nis">ID ${l}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="cell-kelas">${r}</span>
                    </td>
                    <td>
                        <span>${d}</span>
                    </td>
                    <td>
                        <span class="badge badge--none">${p} siswa</span>
                    </td>
                    <td class="td-aksi">
                        <div class="aksi-grup">
                            <button
                                type="button"
                                class="btn-aksi"
                                data-aksi="ubah-kelas"
                                data-id="${l}"
                                aria-label="Ubah ${o}"
                                title="Ubah">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                type="button"
                                class="btn-aksi btn-aksi--hapus"
                                data-aksi="hapus-kelas"
                                data-id="${l}"
                                aria-label="Hapus ${o}"
                                title="Hapus">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join(""),s&&(s.hidden=e.length!==0),n&&(n.textContent=`${e.length} kelas ditampilkan`))},q=()=>{C="tambah",j=null,a("formKelas").reset(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="",a("modalFormKelasEyebrow").textContent="KELAS BARU",a("modalFormKelasTitle").textContent="Tambah Kelas",a("btnSimpanKelasText").textContent="Simpan Kelas",f("modalFormKelas"),setTimeout(()=>a("inputNamaKelas")?.focus(),120)},O=e=>{const t=S.find(s=>String(s.id_kelas)===String(e));t&&(C="ubah",j=t.id_kelas,a("formKelas").reset(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="",a("modalFormKelasEyebrow").textContent="UBAH DATA KELAS",a("modalFormKelasTitle").textContent=`Ubah ${t.nama_kelas}`,a("btnSimpanKelasText").textContent="Simpan Perubahan",a("inputNamaKelas").value=t.nama_kelas,a("inputTingkat").value=t.tingkat||"",a("inputTahunAjaran").value=t.tahun_ajaran||"",f("modalFormKelas"),setTimeout(()=>a("inputNamaKelas")?.focus(),120))},W=async e=>{e.preventDefault(),a("formErrorKelas").hidden=!0,a("formErrorKelas").textContent="";const t=a("inputNamaKelas").value.trim(),s=a("inputTingkat").value.trim()||null,n=a("inputTahunAjaran").value.trim()||null,i=[];if(t||i.push("Nama kelas wajib diisi."),t.length>50&&i.push("Nama kelas maksimal 50 karakter."),i.length){a("formErrorKelas").textContent=i.join(" "),a("formErrorKelas").hidden=!1;return}const l=a("formKelas").querySelector('[type="submit"]'),o=J(l);if(o)try{const r={nama_kelas:t,tingkat:s,tahun_ajaran:n},d=C==="ubah"?await k(`${_}/${encodeURIComponent(j)}`,{method:"PUT",body:JSON.stringify(r)}):await k(_,{method:"POST",body:JSON.stringify(r)});y("modalFormKelas"),c(d.message||(C==="ubah"?"Data kelas berhasil diperbarui.":"Data kelas berhasil ditambahkan.")),I()}catch(r){a("formErrorKelas").textContent=r.message,a("formErrorKelas").hidden=!1}finally{o.pulihkan()}},G=e=>{const t=S.find(s=>String(s.id_kelas)===String(e));t&&(x=t.id_kelas,a("hapusKelasText").textContent=`Kelas ${t.nama_kelas} akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`,f("modalHapusKelas"))},z=async()=>{if(x===null)return;const e=a("btnKonfirmasiHapusKelas");e&&(e.disabled=!0);try{const t=await k(`${_}/${encodeURIComponent(x)}`,{method:"DELETE"});y("modalHapusKelas"),x=null,c(t.message||"Data kelas berhasil dihapus."),I()}catch(t){c(t.message)}finally{e&&(e.disabled=!1)}},U=e=>{if(e===H)return;H=e;const t=a("panelSiswa"),s=a("panelKelas"),n=a("tabSiswa"),i=a("tabKelas"),l=a("btnTambahSiswa"),o=a("btnTambahKelas");e==="kelas"?(t&&(t.hidden=!0),s&&(s.hidden=!1),n&&(n.classList.remove("is-active"),n.classList.add("btn--ghost"),n.classList.remove("btn--primary"),n.setAttribute("aria-selected","false")),i&&(i.classList.remove("btn--ghost"),i.classList.add("btn--primary","is-active"),i.setAttribute("aria-selected","true")),l&&l.classList.add("hidden"),o&&o.classList.remove("hidden"),I()):(t&&(t.hidden=!1),s&&(s.hidden=!0),n&&(n.classList.remove("btn--ghost"),n.classList.add("btn--primary","is-active"),n.setAttribute("aria-selected","true")),i&&(i.classList.remove("btn--primary","is-active"),i.classList.add("btn--ghost"),i.setAttribute("aria-selected","false")),l&&l.classList.remove("hidden"),o&&o.classList.add("hidden"),w())},V=e=>{const t=u(e.id_siswa),s=u(e.nis),n=u(e.nama),i=u(e.kelas||"Belum ditentukan");u(e.status||"Aktif");const l=e.jenis_kelamin==="Laki-Laki"?"Laki-laki":e.jenis_kelamin==="Perempuan"?"Perempuan":"-",o=e.no_hp?u(e.no_hp):"-",r=String(e.status_iuran??"").toLowerCase(),d=r==="lunas"?'<span class="badge badge--ok">Sudah Bayar</span>':r==="sebagian"?'<span class="badge badge--partial">Sebagian</span>':'<span class="badge badge--none">Belum Bayar</span>';return`
            <tr>
                <td>
                    <div class="siswa-cell">
                        <div class="siswa-cell__avatar">
                            ${u(F(e.nama))}
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
                    <span>${l}</span>
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
        `},X=e=>{const t=a("isiTabelSiswa"),s=a("emptyState"),n=a("tabelInfo");t&&(t.innerHTML=e.map(V).join(""),s&&(s.hidden=e.length!==0),n&&(n.textContent=`${e.length} siswa ditampilkan`))},Q=e=>{a("sumTotal")&&(a("sumTotal").textContent=e.length);const t=e.filter(i=>i.jenis_kelamin==="Laki-Laki").length,s=e.filter(i=>i.jenis_kelamin==="Perempuan").length,n=e.filter(i=>i.status_iuran!=="lunas").length;a("sumLk")&&(a("sumLk").textContent=t),a("sumPr")&&(a("sumPr").textContent=s),a("sumBelum")&&(a("sumBelum").textContent=n),a("sumTotalNote")&&(a("sumTotalNote").textContent=e.length?"siswa terdaftar":"belum ada siswa"),a("sumLkNote")&&(a("sumLkNote").textContent="siswa laki-laki"),a("sumPrNote")&&(a("sumPrNote").textContent="siswa perempuan"),a("sumBelumNote")&&(a("sumBelumNote").textContent="belum bayar / sebagian")},g=()=>{const e=a("cariSiswa")?.value.trim().toLowerCase()||"",t=a("filterKelas")?.value||"semua",s=a("filterJk")?.value||"semua",n=a("filterIuran")?.value||"semua",i=h.filter(l=>!(t!=="semua"&&String(l.id_kelas)!==String(t)||s!=="semua"&&(/perempuan/i.test(String(l.jenis_kelamin??""))?"P":/laki/i.test(String(l.jenis_kelamin??""))?"L":"")!==s||n!=="semua"&&String(l.status_iuran??"").toLowerCase()!==n||e&&![l.nama,l.nis,l.kelas].join(" ").toLowerCase().includes(e)));X(i),Q(i)},R=()=>{a("cariSiswa")&&(a("cariSiswa").value=""),a("filterKelas")&&(a("filterKelas").value="semua"),a("filterJk")&&(a("filterJk").value="semua"),a("filterIuran")&&(a("filterIuran").value="semua"),g()},f=e=>{const t=a(e);t&&(t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))},y=e=>{const t=a(e);t&&(t.classList.remove("is-open"),t.setAttribute("aria-hidden","true"),document.querySelector(".modal-backdrop.is-open")||document.body.classList.remove("modal-open"))},Y=()=>{document.querySelectorAll(".modal-backdrop.is-open").forEach(e=>y(e.id))},Z=()=>{if(T="tambah",$=null,a("formSiswa").reset(),b.length===0){w().then(()=>{L(),A(),a("modalFormEyebrow").textContent="SISWA BARU",a("modalFormTitle").textContent="Tambah Siswa",a("btnSimpanText").textContent="Simpan Siswa",f("modalForm"),setTimeout(()=>a("inputNis")?.focus(),120)});return}L(),A(),a("modalFormEyebrow").textContent="SISWA BARU",a("modalFormTitle").textContent="Tambah Siswa",a("btnSimpanText").textContent="Simpan Siswa",f("modalForm"),setTimeout(()=>a("inputNis")?.focus(),120)},aa=e=>{const t=h.find(i=>String(i.id_siswa)===String(e));if(!t)return;T="ubah",$=t.id_siswa,a("formSiswa").reset(),L(),A(),a("modalFormEyebrow").textContent="UBAH DATA SISWA",a("modalFormTitle").textContent=`Ubah ${t.nama}`,a("btnSimpanText").textContent="Simpan Perubahan",a("inputNis").value=t.nis,a("inputNama").value=t.nama,a("inputKelas").value=t.id_kelas??"",a("inputHp")&&(a("inputHp").value=t.no_hp??"");const s=document.querySelectorAll('input[name="jenisKelamin"]'),n=t.jenis_kelamin==="Laki-Laki"?"L":t.jenis_kelamin==="Perempuan"?"P":"L";s.forEach(i=>{i.checked=i.value===n}),f("modalForm"),setTimeout(()=>a("inputNama")?.focus(),120)},ta=async e=>{e.preventDefault(),A();const t=a("inputNis").value.trim(),s=a("inputNama").value.trim(),n=a("inputKelas").value,i=a("inputHp")?a("inputHp").value.trim():"",l=document.querySelector('input[name="jenisKelamin"]:checked'),o=l?l.value:null,r=[];if(t||r.push("NIS wajib diisi."),t.length>11&&r.push("NIS maksimal 11 karakter."),s.length<3&&r.push("Nama siswa minimal 3 karakter."),n||r.push("Jurusan wajib dipilih."),i&&!/^[0-9+\-\s]{8,20}$/.test(i)&&r.push("Nomor HP tidak valid."),r.length){P(r.join(" "));return}const d=a("formSiswa").querySelector('[type="submit"]'),p=J(d);if(p)try{const m={nis:t,nama:s,id_kelas:Number(n),jenis_kelamin:o,no_hp:i||null},D=T==="ubah"?await k(`${K}/${encodeURIComponent($)}`,{method:"PUT",body:JSON.stringify(m)}):await k(K,{method:"POST",body:JSON.stringify(m)});y("modalForm"),c(D.message||(T==="ubah"?"Data siswa berhasil diperbarui.":"Data siswa berhasil ditambahkan.")),w()}catch(m){P(m.message)}finally{p.pulihkan()}},ea=e=>{const t=h.find(m=>String(m.id_siswa)===String(e));if(!t)return;a("detailNama").textContent=t.nama,a("detailNamaKecil").textContent=t.nama,a("detailAvatar").textContent=F(t.nama),a("detailKelas").textContent=t.kelas||"Belum ditentukan",a("detailNis").textContent=t.nis,a("detailJk")&&(a("detailJk").textContent="-",a("detailJk").classList.remove("chip--lk","chip--pr"));const s=t.jenis_kelamin||"Belum tersedia";a("detailJkTeks").textContent=s,a("detailHp").textContent=t.no_hp?t.no_hp:"Belum diisi";const n=Array.isArray(t.riwayat)?t.riwayat:[],i=Number(t.total_dibayar)||0,l=String(t.status_iuran??"").toLowerCase(),o=Number(t.tagihan_iuran)||0,r=Number(t.terbayar_iuran)||0,d=a("detailStatus");d&&(l==="lunas"?(d.textContent=`Sudah bayar ${v(r)}`,d.className="badge badge--ok"):l==="sebagian"?(d.textContent=`Dibayar ${v(r)} dari ${v(o)}`,d.className="badge badge--partial"):(d.textContent=o>0?`Belum bayar • tagihan ${v(o)}`:"Belum ada tagihan iuran aktif",d.className="badge badge--none"));const p=a("riwayatIuran");p&&(n.length===0?p.innerHTML=`
                    <div class="riwayat-baris">
                        <span class="riwayat-baris__bulan">
                            Belum ada riwayat pembayaran
                        </span>
                        <span class="riwayat-baris__nominal">-</span>
                    </div>
                `:(p.innerHTML=n.map(m=>{const D=m.periode||(m.tanggal?String(m.tanggal).slice(0,10):"-"),ra=m.keterangan?` • ${u(m.keterangan)}`:"";return`
                            <div class="riwayat-baris">
                                <span class="riwayat-baris__bulan">
                                    ${u(D)}${ra}
                                </span>
                                <span class="riwayat-baris__nominal">
                                    ${v(m.nominal)}
                                </span>
                            </div>
                        `}).join(""),p.innerHTML+=`
                    <div class="riwayat-baris">
                        <span class="riwayat-baris__bulan">
                            <strong>Total dibayar</strong>
                        </span>
                        <span class="riwayat-baris__nominal">
                            <strong>${v(i)}</strong>
                        </span>
                    </div>
                `)),f("modalDetail")},na=e=>{const t=h.find(s=>String(s.id_siswa)===String(e));t&&(E=t.id_siswa,a("hapusText").textContent=`Data siswa ${t.nama} (NIS ${t.nis}, ${t.kelas||"jurusan belum ditentukan"}) akan dihapus. Tindakan ini tidak dapat dibatalkan.`,f("modalHapus"))},sa=async()=>{if(E===null)return;const e=a("btnKonfirmasiHapus");e&&(e.disabled=!0);try{const t=await k(`${K}/${encodeURIComponent(E)}`,{method:"DELETE"});y("modalHapus"),E=null,c(t.message||"Data siswa berhasil dihapus."),w()}catch(t){c(t.message)}finally{e&&(e.disabled=!1)}},ia=()=>{const e=a("sidebarToggle"),t=a("sidebarBackdrop"),s=()=>document.body.classList.remove("nav-open");e&&e.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),t&&t.addEventListener("click",s),window.addEventListener("resize",()=>{window.innerWidth>1024&&s()});const n=a("profileBtn"),i=a("profileMenu"),l=()=>{i?.classList.remove("is-open"),n?.setAttribute("aria-expanded","false")};n&&i&&(n.addEventListener("click",r=>{r.stopPropagation();const d=i.classList.toggle("is-open");n.setAttribute("aria-expanded",d?"true":"false")}),document.addEventListener("click",r=>{!i.contains(r.target)&&!n.contains(r.target)&&l()})),document.addEventListener("keydown",r=>{r.key==="Escape"&&(s(),l(),Y())});const o=a("topbarDate");o&&(o.textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))},la=()=>{a("cariSiswa")?.addEventListener("input",g),a("filterKelas")?.addEventListener("change",g),a("filterJk")?.addEventListener("change",g),a("filterIuran")?.addEventListener("change",g),a("btnResetFilter")?.addEventListener("click",R),a("btnKosongkanFilter")?.addEventListener("click",R),a("btnTambahSiswa")?.addEventListener("click",Z),a("inputNis")?.addEventListener("input",e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,11)}),a("formSiswa")?.addEventListener("submit",ta),a("isiTabelSiswa")?.addEventListener("click",e=>{const t=e.target.closest("button[data-aksi]");if(!t)return;const{aksi:s,id:n}=t.dataset;s==="detail"&&ea(n),s==="ubah"&&aa(n),s==="hapus"&&na(n)}),a("btnKonfirmasiHapus")?.addEventListener("click",sa),a("tabSiswa")?.addEventListener("click",()=>U("siswa")),a("tabKelas")?.addEventListener("click",()=>U("kelas")),a("btnTambahKelas")?.addEventListener("click",q),a("formKelas")?.addEventListener("submit",W),a("isiTabelKelas")?.addEventListener("click",e=>{const t=e.target.closest("button[data-aksi]");if(!t)return;const{aksi:s,id:n}=t.dataset;s==="ubah-kelas"&&O(n),s==="hapus-kelas"&&G(n)}),a("btnKonfirmasiHapusKelas")?.addEventListener("click",z),document.querySelectorAll("[data-tutup-modal]").forEach(e=>{e.addEventListener("click",()=>{y(e.dataset.tutupModal)})}),document.querySelectorAll(".modal-backdrop").forEach(e=>{e.addEventListener("mousedown",t=>{t.target===e&&y(e.id)})})};ia(),la(),w()})();
