import{k as Ke,b as Me}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const D="/admin/api/pengguna";let f=[];function be(e,a){if(e?.errors){const t=Object.values(e.errors).flat().filter(Boolean);if(t.length)return t.join(" ")}return e?.message?e.message:a===401||a===403?"Akses ditolak. Pastikan kamu sudah login sebagai Admin.":a===419?"Sesi berakhir. Muat ulang halaman lalu coba lagi.":a>=500?"Terjadi gangguan pada server. Coba lagi beberapa saat.":"Terjadi kesalahan saat menghubungi server."}async function ve(){try{const e=await fetch("/admin/api/csrf-token",{headers:{Accept:"application/json"},credentials:"same-origin",cache:"no-store"});if(!e.ok)return null;const a=await e.json();return typeof a?.token=="string"&&a.token!==""?a.token:null}catch{return null}}async function F(e,a={}){const{csrfBaru:t=!1,...n}=a,m=(t?await ve():null)||document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),w={Accept:"application/json",...n.body?{"Content-Type":"application/json"}:{},...m?{"X-CSRF-TOKEN":m}:{},...n.headers||{}};let k;const u=new AbortController,x=setTimeout(()=>u.abort(),3e4);try{k=await fetch(e,Me({...n,headers:w,credentials:"same-origin",signal:u.signal}))}catch(ge){throw clearTimeout(x),ge?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server. Periksa koneksi Laravel.")}clearTimeout(x);let p={};try{p=await k.json()}catch{}if(!k.ok)throw new Error(be(p,k.status));return p}let R=!1;async function K(){if(!R){R=!0;try{const e=await F(D),a=Array.isArray(e.data)?e.data:[];X=Array.isArray(e.kelas)?e.kelas:[],O=Array.isArray(e.siswa)?e.siswa:[],Se(),z(),f=a.map(t=>({db_id:t.db_id,id:t.id,nama:t.nama,email:t.email,peran:String(t.peran||"").toLowerCase(),jenis_viewer:t.jenis_viewer??null,jenis_viewer_label:t.jenis_viewer_label??null,id_siswa:t.id_siswa??null,nis:t.nis??null,nama_siswa:t.nama_siswa??null,id_kelas:t.id_kelas??null,kelas:t.kelas??null,login:t.login||null,utama:!!t.utama})),me(),$()}catch(e){console.error("Gagal memuat data pengguna:",e),f=[],me(),$(),h(e.message)}finally{R=!1}}}const we=document.getElementById("sidebarToggle"),ye=document.getElementById("sidebarBackdrop"),B=document.getElementById("profileBtn"),L=document.getElementById("profileMenu"),te=document.getElementById("topbarDate"),P=document.getElementById("cariPengguna"),T=document.getElementById("filterPeran"),he=document.getElementById("btnResetFilter"),M=document.getElementById("isiTabelPengguna"),ne=document.getElementById("emptyState"),ke=document.getElementById("btnKosongkanFilter"),ie=document.getElementById("jumlahPengguna"),se=document.getElementById("sumAdmin"),le=document.getElementById("sumBendahara"),re=document.getElementById("sumViewer"),Ee=document.getElementById("btnTambahPengguna"),_=document.getElementById("modalForm"),S=document.getElementById("modalHapus"),U=document.getElementById("formPengguna"),V=document.getElementById("modalFormTitle"),d=document.getElementById("inputNama"),C=document.getElementById("inputEmail"),r=document.getElementById("inputPeran"),i=document.getElementById("inputKelas"),H=document.getElementById("fieldKelas"),c=document.getElementById("inputJenisViewer"),G=document.getElementById("fieldJenisViewer");document.getElementById("hintJenisViewer");const s=document.getElementById("inputSiswa"),oe=document.getElementById("fieldDataSiswa"),N=document.getElementById("hintDataSiswa"),o=document.getElementById("inputPassword"),I=document.getElementById("togglePassword"),A=document.getElementById("formError"),de=document.getElementById("hapusNama"),Be=document.getElementById("btnKonfirmasiHapus"),W=document.getElementById("toast"),ue=document.getElementById("toastText");let b=null,j=null,X=[],O=[];function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function Le(e){return{admin:"Admin",bendahara:"Bendahara",viewer:"Viewer"}[e]||e}function _e(e){return{admin:"badge--primary",bendahara:"badge--success",viewer:"badge--neutral"}[e]||"badge--neutral"}function Se(){if(!i)return;const e=i.value;i.innerHTML=`
            <option value="">- Semua Kelas (khusus Admin) -</option>
            ${X.map(t=>`
                <option value="${l(t.id_kelas)}">
                    ${l(t.nama_kelas)}
                </option>
            `).join("")}
        `;const a=X.some(t=>String(t.id_kelas)===String(e));i.value=a?e:""}function z(e=null){if(!s)return;const a=e!==null?String(e):s.value;s.innerHTML=`
            <option value="">- Pilih siswa -</option>
            ${O.map(n=>{const m=n.tertaut&&String(n.id_siswa)!==String(a);return`
                    <option
                        value="${l(n.id_siswa)}"
                        ${m?"disabled":""}
                    >
                        ${l(n.nama)}
                        • ${l(n.nis)}
                        • ${l(n.kelas||"Tanpa kelas")}
                        ${m?"(sudah tertaut)":""}
                    </option>
                `}).join("")}
        `;const t=O.some(n=>String(n.id_siswa)===String(a));s.value=t?a:""}function ce(){return!s||!s.value?null:O.find(e=>String(e.id_siswa)===String(s.value))||null}function Q(){const e=r?.value,a=c?.value||"siswa";return e==="bendahara"||e==="viewer"&&a==="siswa"}function y(){if(!oe||!r)return;const e=Q();if(oe.style.display=e?"":"none",s&&(s.disabled=!e,s.required=e,e||(s.value="")),!e){d&&(d.readOnly=!1),i&&(i.disabled=r.value==="admin"),N&&(N.textContent="Data siswa hanya diperlukan untuk Bendahara dan Viewer Siswa.");return}N&&(N.textContent="Wajib dipilih. Nama serta kelas akun mengikuti data siswa agar tagihan pribadi tepat.");const a=ce();a?(d&&(d.value=a.nama,d.readOnly=!0),i&&(i.value=a.id_kelas!==null&&a.id_kelas!==void 0?String(a.id_kelas):"",i.disabled=!0)):(d&&(d.readOnly=!1),i&&(i.disabled=!1))}function q(){if(!G||!r)return;const e=r.value,a=document.getElementById("hintJenisViewer");if(e==="admin"){G.style.display="none",c&&(c.value="siswa",c.disabled=!0),y();return}if(G.style.display="",e==="bendahara"){c&&(c.value="siswa",c.disabled=!0),a&&(a.textContent="Bendahara kelas merupakan siswa yang mengelola keuangan kelas."),y();return}c&&(c.disabled=!1),a&&(a.textContent="Viewer dapat berupa siswa atau wali kelas; keduanya hanya melihat data."),y()}function Ie(e){return e.jenis_viewer_label?e.jenis_viewer_label:e.peran==="bendahara"?"Siswa":e.peran==="admin"?"-":"Siswa"}function Ae(e){return e.peran==="admin"?"Semua Kelas":e.kelas||"Belum ditetapkan"}function Y(){if(!H||!r)return;const e=r.value,a=H.querySelector(".field__hint");e==="admin"?(H.style.display="",i&&(i.value="",i.disabled=!0),a&&(a.textContent="Admin selalu melihat semua kelas, jadi pilihan kelas tidak berlaku.")):(H.style.display="",i&&(i.disabled=!1),a&&(a.textContent="Bendahara & viewer hanya melihat kelas ini."))}function Pe(e){const a=String(e).trim().split(/\s+/).filter(Boolean);return a.length?a.length===1?a[0].substring(0,2).toUpperCase():(a[0].charAt(0)+a[a.length-1].charAt(0)).toUpperCase():"U"}function Te(e){if(!e)return"Belum pernah masuk";const a=e.split(" ");return a.length<2?e:`${a[0]} • ${a[1]}`}function h(e){!W||!ue||(ue.textContent=e,W.classList.add("is-muncul"),clearTimeout(h.timer),h.timer=setTimeout(()=>{W.classList.remove("is-muncul")},2600))}function Ce(){if(!te)return;const e=new Date;te.textContent=e.toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}Ce();function je(){document.body.classList.add("nav-open")}function J(){document.body.classList.remove("nav-open")}we?.addEventListener("click",()=>{document.body.classList.contains("nav-open")?J():je()}),ye?.addEventListener("click",J),document.querySelectorAll(".side-link").forEach(e=>{e.addEventListener("click",()=>{J()})}),B?.addEventListener("click",e=>{if(e.stopPropagation(),!L)return;const a=L.classList.toggle("is-open");B.setAttribute("aria-expanded",a?"true":"false")}),document.addEventListener("click",e=>{L&&B&&!L.contains(e.target)&&!B.contains(e.target)&&(L.classList.remove("is-open"),B.setAttribute("aria-expanded","false"))});function me(){const e=f.filter(n=>n.peran==="admin").length,a=f.filter(n=>n.peran==="bendahara").length,t=f.filter(n=>n.peran==="viewer").length;se&&(se.textContent=e),le&&(le.textContent=a),re&&(re.textContent=t)}function $e(){const e=P?P.value.trim().toLowerCase():"",a=T?T.value:"semua";return f.filter(t=>{const n=!e||t.nama.toLowerCase().includes(e)||t.email.toLowerCase().includes(e),m=a==="semua"||t.peran===a;return n&&m})}function $(){if(!M)return;const e=$e();if(ie&&(ie.textContent=`${e.length} pengguna`),!e.length){M.innerHTML="",ne?.classList.add("is-visible");return}ne?.classList.remove("is-visible"),M.innerHTML=e.map(a=>`
                    <tr>

                        <td>
                            <div class="user-cell">

                                <div class="user-cell__avatar">
                                    ${l(Pe(a.nama))}
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
                            <span class="badge ${_e(a.peran)}">
                                ${l(Le(a.peran))}
                            </span>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(Ie(a))}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(a.nis||"-")}
                            </div>
                        </td>


                        <td>
                            <div class="login-cell">
                                ${l(Ae(a))}
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
                                ${l(Te(a.login))}
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
                `).join("")}P?.addEventListener("input",$),T?.addEventListener("change",$);function fe(){P&&(P.value=""),T&&(T.value="semua"),$()}he?.addEventListener("click",fe),ke?.addEventListener("click",fe);function Z(e){e&&(e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"))}function v(e){e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.querySelector(".modal.is-open")||document.body.classList.remove("modal-open"))}document.querySelectorAll("[data-close-modal]").forEach(e=>{e.addEventListener("click",()=>{v(_),v(S)})});function ee(){A&&(A.textContent="",A.classList.remove("is-visible"))}function g(e){A&&(A.textContent=e,A.classList.add("is-visible"))}function xe(){U?.reset(),b=null,V&&(V.textContent="Tambah Pengguna"),o&&(o.value="",o.type="password",o.required=!0,o.placeholder="Minimal 8 karakter"),I&&(I.innerHTML=`
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `),ee(),r&&(r.disabled=!1),i&&(i.value=""),s&&(s.value=""),d&&(d.readOnly=!1),z(),Y(),q(),y()}Ee?.addEventListener("click",()=>{xe(),Z(_),setTimeout(()=>{d?.focus()},100)});function De(e){const a=f.find(t=>String(t.id)===String(e));a&&(b=e,V&&(V.textContent="Edit Pengguna"),d.value=a.nama,C.value=a.email,r.value=a.peran,z(a.id_siswa),s&&(s.value=a.id_siswa!==null&&a.id_siswa!==void 0?String(a.id_siswa):""),i&&(i.value=a.id_kelas!==null&&a.id_kelas!==void 0?String(a.id_kelas):""),c&&(c.value=a.jenis_viewer||"siswa"),Y(),q(),y(),o.value="",o.type="password",o.required=!1,o.placeholder="Kosongkan jika tidak ingin mengubah",I&&(I.innerHTML=`
                <span class="material-symbols-outlined">
                    visibility
                </span>
            `),r.disabled=!!a.utama,ee(),Z(_),setTimeout(()=>{d?.focus()},100))}function Fe(e){const a=f.find(t=>String(t.id)===String(e));!a||a.utama||(j=e,de&&(de.textContent=a.nama),Z(S))}M?.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=a.dataset.action,n=a.dataset.id;t==="edit"&&De(n),t==="delete"&&Fe(n)}),r?.addEventListener("change",()=>{Y(),q(),y()}),r?.addEventListener("change",q),c?.addEventListener("change",y),s?.addEventListener("change",y),I?.addEventListener("click",()=>{if(!o)return;const e=o.type==="password";o.type=e?"text":"password",I.innerHTML=`
                <span class="material-symbols-outlined">
                    ${e?"visibility_off":"visibility"}
                </span>
            `}),U?.addEventListener("submit",async e=>{e.preventDefault(),ee();const a=U.querySelector('button[type="submit"]'),t=Ke(a);if(t)try{const n=d.value.trim(),m=C.value.trim().toLowerCase(),w=r.value,k=w==="viewer"?c?.value||"siswa":w==="bendahara"?"siswa":null,u=Q()?ce():null,x=u?u.id_siswa:null,p=o.value;if(!n){g("Nama pengguna wajib diisi."),d.focus();return}if(!m){g("Email wajib diisi."),C.focus();return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){g("Masukkan alamat email yang valid."),C.focus();return}if(!["admin","bendahara","viewer"].includes(w)){g("Pilih peran pengguna."),r.focus();return}if(Q()&&!u){g("Pilih Data Siswa untuk Bendahara atau Viewer Siswa."),s?.focus();return}if(f.some(E=>E.email.toLowerCase()===m&&E.id!==b)){g("Email tersebut sudah digunakan oleh pengguna lain."),C.focus();return}if(!b&&p.length<8){g("Password awal minimal 8 karakter."),o.focus();return}if(b&&p&&p.length<8){g("Password baru minimal 8 karakter."),o.focus();return}if(b){const E=f.find(ae=>ae.id===b);if(!E)return;const pe={nama:u?u.nama:n,email:m,peran:w,jenis_viewer:k,id_siswa:x,id_kelas:u?u.id_kelas:w==="admin"?null:i?.value||null};p&&(pe.password=p);try{await F(`${D}/${encodeURIComponent(E.db_id)}`,{method:"PUT",csrfBaru:!0,body:JSON.stringify(pe)}),v(_),await K(),h("Data pengguna berhasil diperbarui."),b=null}catch(ae){g(ae.message)}return}try{await F(D,{method:"POST",csrfBaru:!0,body:JSON.stringify({nama:u?u.nama:n,email:m,peran:w,jenis_viewer:k,id_siswa:x,id_kelas:u?u.id_kelas:w==="admin"?null:i?.value||null,password:p})}),v(_),await K(),h("Pengguna baru berhasil ditambahkan."),b=null}catch(E){g(E.message)}}finally{t.pulihkan()}}),Be?.addEventListener("click",async()=>{if(!j)return;const e=f.find(a=>a.id===j);if(e){if(e.utama){v(S),h("Akun utama Admin tidak dapat dihapus."),j=null;return}try{await F(`${D}/${encodeURIComponent(e.db_id)}`,{method:"DELETE",csrfBaru:!0}),j=null,v(S),await K(),h("Pengguna berhasil dihapus.")}catch(a){v(S),h(a.message)}}}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(v(_),v(S),L?.classList.remove("is-open"),B?.setAttribute("aria-expanded","false"),J())}),K()});
