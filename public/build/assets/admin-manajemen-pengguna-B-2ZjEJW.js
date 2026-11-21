import{k as Ie,b as We}from"./simpan-guard-D5jj-dSF.js";import{a as ha,n as Ea,s as Ia,i as _a}from"./admin-filter-kelas-BaTSLq81.js";document.addEventListener("DOMContentLoaded",()=>{const B="/admin/api/pengguna";let v=[];function _e(e,a){if(e?.errors){const t=Object.values(e.errors).flat().filter(Boolean);if(t.length)return t.join(" ")}return e?.message?e.message:a===401||a===403?"Akses ditolak. Pastikan kamu sudah login sebagai Admin.":a===419?"Sesi berakhir. Muat ulang halaman lalu coba lagi.":a>=500?"Terjadi gangguan pada server. Coba lagi beberapa saat.":"Terjadi kesalahan saat menghubungi server."}async function Be(){try{const e=await fetch("/admin/api/csrf-token",{headers:{Accept:"application/json"},credentials:"same-origin",cache:"no-store"});if(!e.ok)return null;const a=await e.json();return typeof a?.token=="string"&&a.token!==""?a.token:null}catch{return null}}async function C(e,a={}){const{csrfBaru:t=!1,...n}=a,i=(t?await Be():null)||document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),o={Accept:"application/json",...n.body?{"Content-Type":"application/json"}:{},...i?{"X-CSRF-TOKEN":i}:{},...n.headers||{}};let r;const d=new AbortController,P=setTimeout(()=>d.abort(),3e4);try{r=await fetch(e,We({...n,headers:o,credentials:"same-origin",signal:d.signal}))}catch(Je){throw clearTimeout(P),Je?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.")}clearTimeout(P);let w={};try{w=await r.json()}catch{}if(!r.ok)throw new Error(_e(w,r.status));return w}async function Xe(e,a,t={}){const n=(t.csrfBaru?await Be():null)||document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),i=We({method:"POST",body:a,headers:{Accept:"application/json",...n?{"X-CSRF-TOKEN":n}:{}},credentials:"same-origin"}),o=await fetch(e,i);let r={};try{r=await o.json()}catch{}if(!o.ok)throw new Error(_e(r,o.status));return r}function Le(e,a){if(!e)return;let t;try{t=atob(e)}catch{f("File akun tidak dapat dibuka.");return}const n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);const i=URL.createObjectURL(new Blob([n],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})),o=document.createElement("a");o.href=i,o.download=a,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(i),1500)}let de=!1;async function A(){if(!de){de=!0;try{const e=Ea(L),a=e?`${B}?id_kelas=${encodeURIComponent(e)}`:B;Ia(L?.value);const t=await C(a),n=Array.isArray(t.data)?t.data:[];N=Array.isArray(t.kelas)?t.kelas:[],sa(),Ve(),v=n.map(i=>({db_id:i.db_id,id:i.id,nama:i.nama,email:i.email,peran:String(i.peran||"").toLowerCase(),jenis_viewer:i.jenis_viewer??null,jenis_viewer_label:i.jenis_viewer_label??null,id_siswa:i.id_siswa??null,nis:i.nis??null,nama_siswa:i.nama_siswa??null,id_kelas:i.id_kelas??null,kelas:i.kelas??null,login:i.login||null,utama:!!i.utama})),Ne(),Y()}catch(e){console.error("Gagal memuat data pengguna:",e),v=[],Ve(),Ne(),Y(),f(e.message)}finally{de=!1}}}const ze=document.getElementById("sidebarToggle"),Qe=document.getElementById("sidebarBackdrop"),j=document.getElementById("profileBtn"),K=document.getElementById("profileMenu"),Se=document.getElementById("topbarDate"),q=document.getElementById("cariPengguna"),J=document.getElementById("filterPeran"),L=document.getElementById("filterKelas"),Ye=document.getElementById("btnResetFilter"),ee=document.getElementById("isiTabelPengguna"),Pe=document.getElementById("emptyState"),Ze=document.getElementById("btnKosongkanFilter"),Ae=document.getElementById("jumlahPengguna"),$e=document.getElementById("sumAdmin"),Te=document.getElementById("sumBendahara"),xe=document.getElementById("sumViewer"),ea=document.getElementById("btnTambahPengguna"),aa=document.getElementById("btnImportPengguna"),F=document.getElementById("modalForm"),D=document.getElementById("modalHapus"),ue=document.getElementById("modalImport"),ce=document.getElementById("modalAkun"),G=document.getElementById("importFile"),$=document.getElementById("importKelas"),Ce=document.getElementById("btnPreviewImport"),S=document.getElementById("btnKonfirmasiImport"),T=document.getElementById("btnUnduhAkunImport"),ae=document.getElementById("previewImport"),te=document.getElementById("isiPreviewImport"),je=document.getElementById("rekapPreview"),M=document.getElementById("hasilImport"),me=document.getElementById("rekapImport"),ne=document.getElementById("rincianImport"),Ke=document.getElementById("akunEmail"),Fe=document.getElementById("akunPassword"),De=document.getElementById("akunPeringatan"),pe=document.getElementById("btnUnduhAkunManual"),fe=document.getElementById("formPengguna"),ie=document.getElementById("modalFormTitle"),p=document.getElementById("inputNama"),W=document.getElementById("inputEmail"),c=document.getElementById("inputPeran"),s=document.getElementById("inputKelas"),se=document.getElementById("fieldKelas"),g=document.getElementById("inputJenisViewer"),ge=document.getElementById("fieldJenisViewer");document.getElementById("hintJenisViewer");const u=document.getElementById("inputSiswa"),b=document.getElementById("inputKelasSiswa"),U=document.getElementById("cariSiswaForm"),H=document.getElementById("infoSiswaKelas"),Me=document.getElementById("fieldDataSiswa"),le=document.getElementById("hintDataSiswa"),m=document.getElementById("inputPassword"),R=document.getElementById("togglePassword"),V=document.getElementById("formError"),Ue=document.getElementById("hapusNama"),ta=document.getElementById("btnKonfirmasiHapus"),be=document.getElementById("toast"),He=document.getElementById("toastText");let _=null,X=null,ke=[],z=null,O=null,N=[],y=[],Re=null,we=0;function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function na(e){return{admin:"Admin",bendahara:"Bendahara",viewer:"Viewer"}[e]||e}function ia(e){return{admin:"badge--primary",bendahara:"badge--success",viewer:"badge--neutral"}[e]||"badge--neutral"}function sa(){const e=N.map(a=>`
            <option value="${l(a.id_kelas)}">
                ${l(a.nama_kelas)}
            </option>
        `).join("");if(s){const a=s.value;s.innerHTML=`
                <option value="">- Semua Kelas (khusus Admin) -</option>
                ${e}
            `;const t=N.some(n=>String(n.id_kelas)===String(a));s.value=t?a:""}if(b){const a=b.value||s?.value||"";b.innerHTML=`
                <option value="">- Pilih kelas terlebih dahulu -</option>
                ${e}
            `;const t=N.some(n=>String(n.id_kelas)===String(a));b.value=t?a:""}}function Ve(){const e=N.map(a=>`
            <option value="${l(a.id_kelas)}">
                ${l(a.nama_kelas)}
            </option>
        `).join("");if(_a(L,N),$){const a=$.value||"";$.innerHTML=`
                <option value="">- Semua Kelas / ambil dari kolom Kelas -</option>
                ${e}
            `,$.value=a}}function Q(e=null){if(!u)return;const a=e!==null?String(e):u.value;u.innerHTML=`
            <option value="">- Pilih siswa -</option>
            ${y.map(n=>{const i=n.tertaut&&String(n.id_siswa)!==String(a);return`
                    <option
                        value="${l(n.id_siswa)}"
                        ${i?"disabled":""}
                    >
                        ${l(n.nama)}
                        • ${l(n.nis)}
                        • ${l(n.kelas||"Tanpa kelas")}
                        ${i?"(sudah memiliki akun)":""}
                    </option>
                `}).join("")}
        `;const t=y.some(n=>String(n.id_siswa)===String(a));u.value=t?a:""}function Oe(){return!u||!u.value?null:y.find(e=>String(e.id_siswa)===String(u.value))||null}async function x(e=null,a=null){if(!u)return;const t=b?.value||s?.value||"",n=++we;if(!t){y=[],Q(e),H&&(H.textContent="Pilih kelas untuk menampilkan siswa.");return}const i=(U?.value||"").trim(),o=new URLSearchParams({id_kelas:t});i&&o.set("q",i),a&&o.set("id_users",a);try{const r=await C(`${B}/siswa?${o.toString()}`);if(n!==we)return;if(y=Array.isArray(r.data)?r.data:[],Q(e),H){const d=r.nama_kelas||"kelas ini",P=r.total_kelas??y.length,w=r.total_tampil??y.length;H.textContent=i?`Ditemukan ${w} dari ${P} siswa di kelas ${d}.`:y.length?`${P} siswa di kelas ${d}.`:`Belum ada data siswa pada kelas ${d}.`}}catch(r){if(n!==we)return;y=[],Q(e),H&&(H.textContent=r.message||"Gagal memuat siswa.")}}function ve(){const e=c?.value,a=g?.value||"siswa";return e==="bendahara"||e==="viewer"&&a==="siswa"}function h(){if(!Me||!c)return;const e=ve();if(Me.style.display=e?"":"none",u&&(u.disabled=!e,u.required=e,e||(u.value="")),!e){p&&(p.readOnly=!1),s&&(s.disabled=c.value==="admin"),le&&(le.textContent="Data siswa hanya diperlukan untuk Bendahara dan Viewer Siswa.");return}le&&(le.textContent="Wajib dipilih. Nama serta kelas akun mengikuti data siswa agar tagihan pribadi tepat.");const a=Oe();a?(p&&(p.value=a.nama,p.readOnly=!0),s&&(s.value=a.id_kelas!==null&&a.id_kelas!==void 0?String(a.id_kelas):"",s.disabled=!0)):(p&&(p.readOnly=!1),s&&(s.disabled=!1))}function re(){if(!ge||!c)return;const e=c.value,a=document.getElementById("hintJenisViewer");if(e==="admin"){ge.style.display="none",g&&(g.value="siswa",g.disabled=!0),h();return}if(ge.style.display="",e==="bendahara"){g&&(g.value="siswa",g.disabled=!0),a&&(a.textContent="Bendahara kelas merupakan siswa yang mengelola keuangan kelas."),h();return}g&&(g.disabled=!1),a&&(a.textContent="Viewer dapat berupa siswa atau wali kelas; keduanya hanya melihat data."),h()}function la(e){return e.jenis_viewer_label?e.jenis_viewer_label:e.peran==="bendahara"?"Siswa":e.peran==="admin"?"-":"Siswa"}function ra(e){return e.peran==="admin"?"Semua Kelas":e.kelas||"Belum ditetapkan"}function ye(){if(!se||!c)return;const e=c.value,a=se.querySelector(".field__hint");e==="admin"?(se.style.display="",s&&(s.value="",s.disabled=!0),a&&(a.textContent="Admin selalu melihat semua kelas, jadi pilihan kelas tidak berlaku.")):(se.style.display="",s&&(s.disabled=!1),a&&(a.textContent="Bendahara & viewer hanya melihat kelas ini."))}function oa(e){const a=String(e).trim().split(/\s+/).filter(Boolean);return a.length?a.length===1?a[0].substring(0,2).toUpperCase():(a[0].charAt(0)+a[a.length-1].charAt(0)).toUpperCase():"U"}function da(e){if(!e)return"Belum pernah masuk";const a=e.split(" ");return a.length<2?e:`${a[0]} • ${a[1]}`}function f(e){!be||!He||(He.textContent=e,be.classList.add("is-muncul"),clearTimeout(f.timer),f.timer=setTimeout(()=>{be.classList.remove("is-muncul")},2600))}function ua(){if(!Se)return;const e=new Date;Se.textContent=e.toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}ua();function ca(){document.body.classList.add("nav-open")}function oe(){document.body.classList.remove("nav-open")}ze?.addEventListener("click",()=>{document.body.classList.contains("nav-open")?oe():ca()}),Qe?.addEventListener("click",oe),document.querySelectorAll(".side-link").forEach(e=>{e.addEventListener("click",()=>{oe()})}),j?.addEventListener("click",e=>{if(e.stopPropagation(),!K)return;const a=K.classList.toggle("is-open");j.setAttribute("aria-expanded",a?"true":"false")}),document.addEventListener("click",e=>{K&&j&&!K.contains(e.target)&&!j.contains(e.target)&&(K.classList.remove("is-open"),j.setAttribute("aria-expanded","false"))});function Ne(){const e=v.filter(n=>n.peran==="admin").length,a=v.filter(n=>n.peran==="bendahara").length,t=v.filter(n=>n.peran==="viewer").length;$e&&($e.textContent=e),Te&&(Te.textContent=a),xe&&(xe.textContent=t)}function ma(){const e=q?q.value.trim().toLowerCase():"",a=J?J.value:"semua";return v.filter(t=>{const n=!e||t.nama.toLowerCase().includes(e)||t.email.toLowerCase().includes(e),i=a==="semua"||t.peran===a;return n&&i})}function Y(){if(!ee)return;const e=ma();if(Ae&&(Ae.textContent=`${e.length} pengguna`),!e.length){ee.innerHTML="",Pe?.classList.add("is-visible");return}Pe?.classList.remove("is-visible"),ee.innerHTML=e.map(a=>`
                    <tr>

                        <td>
                            <div class="user-cell">

                                <div class="user-cell__avatar">
                                    ${l(oa(a.nama))}
                                </div>

                                <div class="user-cell__info">

                                    <div class="user-cell__name">
                                        ${l(a.nama)}
                                    </div>

                                    <div class="user-cell__email">
                                        ${l(a.email)}
                                    </div>

                                </div>

                            </div>
                        </td>


                        <td>
                            <span class="badge ${ia(a.peran)}">
                                ${l(na(a.peran))}
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(la(a))}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(a.nis||"-")}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(ra(a))}
                            </div>
                        </td>


                        <td>
                            <span class="badge badge--success">
                                <span class="status-dot"></span>
                                Aktif
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(da(a.login))}
                            </div>
                        </td>


                        <td class="th-c">

                            <div class="row-actions">

                                <button
                                    type="button"
                                    class="row-action"
                                    data-action="edit"
                                    data-id="${l(a.id)}"
                                    title="Edit pengguna"
                                    aria-label="Edit pengguna"
                                >
                                    <span class="material-symbols-outlined">
                                        edit
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    class="row-action row-action--danger"
                                    data-action="delete"
                                    data-id="${l(a.id)}"
                                    title="Hapus pengguna"
                                    aria-label="Hapus pengguna"
                                    ${a.utama?"disabled":""}
                                >
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>

                            </div>

                        </td>

                    </tr>
                `).join("")}q?.addEventListener("input",Y),J?.addEventListener("change",Y),L?.addEventListener("change",A);function qe(){q&&(q.value=""),J&&(J.value="semua"),L&&(L.value="semua"),Y(),A()}Ye?.addEventListener("click",qe),Ze?.addEventListener("click",qe);function Z(e){e&&(e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))}function k(e){e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.querySelector(".modal.is-open")||document.body.classList.remove("modal-open"))}document.querySelectorAll("[data-close-modal]").forEach(e=>{e.addEventListener("click",()=>{k(F),k(D),k(ue),k(ce)})});function he(){V&&(V.textContent="",V.classList.remove("is-visible"))}function E(e){V&&(V.textContent=e,V.classList.add("is-visible"))}function pa(){fe?.reset(),_=null,ie&&(ie.textContent="Tambah Pengguna"),m&&(m.value="",m.type="password",m.required=!1,m.placeholder="Kosongkan untuk password otomatis"),R&&(R.innerHTML=`
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `),he(),c&&(c.disabled=!1),s&&(s.value=""),b&&(b.value=""),u&&(u.value=""),U&&(U.value=""),p&&(p.readOnly=!1),y=[],Q(),x(),ye(),re(),h()}ea?.addEventListener("click",()=>{pa(),Z(F),setTimeout(()=>{p?.focus()},100)});async function fa(e){const a=v.find(n=>String(n.id)===String(e));if(!a)return;_=e,ie&&(ie.textContent="Edit Pengguna"),p.value=a.nama,W.value=a.email,c.value=a.peran;const t=a.id_kelas!==null&&a.id_kelas!==void 0?String(a.id_kelas):"";s&&(s.value=t),b&&(b.value=t),U&&(U.value=""),y=[],Q(a.id_siswa),await x(a.id_siswa,a.db_id),g&&(g.value=a.jenis_viewer||"siswa"),ye(),re(),h(),m.value="",m.type="password",m.required=!1,m.placeholder="Kosongkan jika tidak ingin mengubah",R&&(R.innerHTML=`
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `),c.disabled=!!a.utama,he(),Z(F),setTimeout(()=>{p?.focus()},100)}function ga(e){const a=v.find(t=>String(t.id)===String(e));!a||a.utama||(X=e,Ue&&(Ue.textContent=a.nama),Z(D))}ee?.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=a.dataset.action,n=a.dataset.id;t==="edit"&&fa(n),t==="delete"&&ga(n)}),c?.addEventListener("change",()=>{ye(),re(),h()}),c?.addEventListener("change",re),g?.addEventListener("change",h),u?.addEventListener("change",h),s?.addEventListener("change",()=>{b&&(b.value=s.value),x(),h()}),b?.addEventListener("change",()=>{s&&(s.value=b.value),x(),h()}),U?.addEventListener("input",()=>{window.clearTimeout(Re),Re=window.setTimeout(()=>x(),250)}),R?.addEventListener("click",()=>{if(!m)return;const e=m.type==="password";m.type=e?"text":"password",R.innerHTML=`
                <span class="material-symbols-outlined">
                    ${e?"visibility_off":"visibility"}
                </span>
            `}),fe?.addEventListener("submit",async e=>{e.preventDefault(),he();const a=fe.querySelector('button[type="submit"]'),t=Ie(a);if(t)try{const n=p.value.trim(),i=W.value.trim().toLowerCase(),o=c.value,r=o==="viewer"?g?.value||"siswa":o==="bendahara"?"siswa":null,d=ve()?Oe():null,P=d?d.id_siswa:null,w=m.value;if(!n){E("Nama pengguna wajib diisi."),p.focus();return}if(!i){E("Email wajib diisi."),W.focus();return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i)){E("Masukkan alamat email yang valid."),W.focus();return}if(!["admin","bendahara","viewer"].includes(o)){E("Pilih peran pengguna."),c.focus();return}if(ve()&&!d){E("Pilih Data Siswa untuk Bendahara atau Viewer Siswa."),u?.focus();return}if(v.some(I=>I.email.toLowerCase()===i&&I.id!==_)){E("Email tersebut sudah digunakan oleh pengguna lain."),W.focus();return}if(!_&&w&&w.length<8){E("Password awal minimal 8 karakter, atau kosongkan untuk dibuat otomatis."),m.focus();return}if(_&&w&&w.length<8){E("Password baru minimal 8 karakter."),m.focus();return}if(_){const I=v.find(Ee=>Ee.id===_);if(!I)return;const Ge={nama:d?d.nama:n,email:i,peran:o,jenis_viewer:r,id_siswa:P,id_kelas:d?d.id_kelas:o==="admin"?null:s?.value||null};w&&(Ge.password=w);try{await C(`${B}/${encodeURIComponent(I.db_id)}`,{method:"PUT",csrfBaru:!0,body:JSON.stringify(Ge)}),k(F),await A(),f("Data pengguna berhasil diperbarui."),_=null}catch(Ee){E(Ee.message)}return}try{const I=await C(B,{method:"POST",csrfBaru:!0,body:JSON.stringify({nama:d?d.nama:n,email:i,peran:o,jenis_viewer:r,id_siswa:P,id_kelas:d?d.id_kelas:o==="admin"?null:s?.value||null,password:w})});k(F),await A(),await x(),I?.password_awal?ba(I):f("Pengguna baru berhasil ditambahkan."),_=null}catch(I){E(I.message)}}finally{t.pulihkan()}}),ta?.addEventListener("click",async()=>{if(!X)return;const e=v.find(a=>a.id===X);if(e){if(e.utama){k(D),f("Akun utama Admin tidak dapat dihapus."),X=null;return}try{await C(`${B}/${encodeURIComponent(e.db_id)}`,{method:"DELETE",csrfBaru:!0}),X=null,k(D),await A(),f("Pengguna berhasil dihapus.")}catch(a){k(D),f(a.message)}}});function ba(e){z={base64:e.file_xlsx||null,nama:e.nama_file||"akun-pengguna-bbcashvia.xlsx"},Ke&&(Ke.textContent=e.data?.email||e.akun?.[0]?.email||"-"),Fe&&(Fe.textContent=e.password_awal||"-"),De&&(De.textContent=e.peringatan||"Simpan password ini di tempat aman."),pe&&(pe.hidden=!z.base64),Z(ce)}function ka(){ke=[],O=null,G&&(G.value=""),ae&&(ae.hidden=!0),M&&(M.hidden=!0),S&&(S.hidden=!0),T&&(T.hidden=!0),te&&(te.innerHTML=""),ne&&(ne.innerHTML="")}function wa(e){const a=Array.isArray(e.data)?e.data:[];je&&(je.textContent=`Total ${e.total??a.length} baris · ${e.berhasil??0} valid · ${e.gagal??0} tidak valid · ${e.duplikat??0} duplikat`),te&&(te.innerHTML=a.map(t=>{const n=t.status==="valid";return`
                    <tr style="border-bottom:1px solid #D4F1F9;">
                        <td style="padding:7px;">${l(t.baris)}</td>
                        <td style="padding:7px;">${l(t.nama)}</td>
                        <td style="padding:7px;">${l(t.email)}</td>
                        <td style="padding:7px;">${l(t.peran)}</td>
                        <td style="padding:7px;">${l(t.kelas||"-")}</td>
                        <td style="padding:7px;">
                            <span class="badge ${n?"badge--success":"badge--danger"}">
                                ${n?"Valid":"Tidak valid"}
                            </span>
                        </td>
                        <td style="padding:7px;color:#5C7A80;">
                            ${l((t.alasan||[]).join(" "))}
                        </td>
                    </tr>
                `}).join("")),ae&&(ae.hidden=!1),M&&(M.hidden=!0),S&&(S.hidden=(e.berhasil??0)===0),T&&(T.hidden=!0)}async function va(){if(!G?.files?.length){f("Pilih file Excel atau CSV terlebih dahulu.");return}const e=Ie(Ce);if(e)try{const a=new FormData;a.append("file",G.files[0]),$?.value&&a.append("id_kelas",$.value);const t=await Xe(`${B}/preview`,a);ke=Array.isArray(t.data)?t.data:[],wa(t)}catch(a){f(a.message)}finally{e.pulihkan()}}async function ya(){const e=ke.filter(t=>t.status==="valid").map(t=>({baris:t.baris,nama:t.nama,email:t.email,nis:t.nis,peran:t.peran,jenis_viewer:t.jenis_viewer||"",kelas:t.kelas,id_siswa:t.id_siswa,id_kelas:t.id_kelas,jenis_kelamin:t.jenis_kelamin||"",no_hp:t.no_hp||"",siswa_baru:!!t.siswa_baru}));if(!e.length){f("Tidak ada baris valid yang dapat disimpan.");return}const a=Ie(S);if(a)try{const t=await C(`${B}/import`,{method:"POST",csrfBaru:!0,body:JSON.stringify({id_kelas:$?.value||null,baris:e})});if(O=t.file_xlsx?{base64:t.file_xlsx,nama:t.nama_file||"akun-pengguna-bbcashvia.xlsx"}:null,me){me.textContent=`Import selesai · ${t.akun_berhasil??t.berhasil??0} akun dibuat · ${t.siswa_dibuat??0} siswa ditambahkan · ${t.siswa_terhubung??0} siswa ditautkan · ${t.duplikat??0} duplikat · ${t.gagal??0} gagal`;const n=(t.rincian||[]).flatMap(i=>i.alasan||[]).find(i=>!!i);n&&(me.textContent+=` · Alasan: ${n}`)}ne&&(ne.innerHTML=(t.rincian||[]).map(n=>`
                        <div>
                            Baris ${l(n.baris)}:
                            ${l((n.alasan||[]).join(" "))}
                        </div>
                    `).join("")),M&&(M.hidden=!1),S&&(S.hidden=!0),T&&(T.hidden=!O),await A(),await x(),f(t.message||"Import selesai.")}catch(t){f(t.message)}finally{a.pulihkan()}}aa?.addEventListener("click",()=>{ka(),Z(ue),setTimeout(()=>{G?.click()},120)}),Ce?.addEventListener("click",va),S?.addEventListener("click",ya),pe?.addEventListener("click",()=>{z&&Le(z.base64,z.nama)}),T?.addEventListener("click",()=>{O&&Le(O.base64,O.nama)}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(k(F),k(D),k(ue),k(ce),K?.classList.remove("is-open"),j?.setAttribute("aria-expanded","false"),oe())}),L&&(L.value=ha()),A()});
