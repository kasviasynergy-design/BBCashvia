import{k as Rt,a as qt}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const M="/bendahara/api/siswa";let u=[],W=[],U="";const At=()=>{const t=document.querySelector('meta[name="csrf-token"]');return t?t.getAttribute("content"):""},_t=async t=>{let e;const a=new AbortController,n=setTimeout(()=>a.abort(),3e4);try{e=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin",signal:a.signal})}catch(r){throw clearTimeout(n),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(n);let i={};try{i=await e.json()}catch{}if(!e.ok)throw e.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):e.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):e.status===401||e.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(i?.message||"Gagal mengambil data dari server.");return i},Z=async(t,e,a)=>{let n;const i=new AbortController,r=setTimeout(()=>i.abort(),3e4);try{n=await fetch(t,{method:e,headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":U,...String(e).toUpperCase()==="POST"?{"X-Idempotency-Key":qt()}:{}},credentials:"same-origin",body:JSON.stringify(a),signal:i.signal})}catch(s){throw clearTimeout(r),s?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(r);let l={};try{l=await n.json()}catch{}if(!n.ok){if(n.status>=500)throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");if(n.status===419)throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");if(n.status===401||n.status===403)throw new Error("Akses ditolak. Pastikan kamu sudah login.");if(l?.errors){const s=Object.values(l.errors).flat().filter(Boolean);if(s.length)throw new Error(s.join(" "))}throw new Error(l?.message||"Terjadi kesalahan saat menyimpan.")}return l},Dt=async t=>{let e;const a=new AbortController,n=setTimeout(()=>a.abort(),3e4);try{e=await fetch(t,{method:"DELETE",headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":U},credentials:"same-origin",signal:a.signal})}catch(r){throw clearTimeout(n),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(n);let i={};try{i=await e.json()}catch{}if(!e.ok)throw e.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):e.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):e.status===401||e.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(i?.message||"Gagal menghapus data.");return i},L=document.getElementById("studentTableBody"),A=document.getElementById("emptyState"),_=document.getElementById("studentSearch"),D=document.getElementById("statusFilter"),tt=document.getElementById("totalStudents"),et=document.getElementById("paidStudents"),at=document.getElementById("unpaidStudents"),nt=document.getElementById("classStudentCount"),P=document.getElementById("paginationInfo"),G=document.getElementById("pageNumbers"),C=document.getElementById("prevPage"),T=document.getElementById("nextPage"),st=document.getElementById("currentDate"),g=document.getElementById("studentModal"),N=document.getElementById("studentForm"),it=document.getElementById("addStudentButton"),ot=document.getElementById("cancelStudentButton"),rt=document.getElementById("modalClose"),f=document.getElementById("editingNis"),p=document.getElementById("studentNis"),$=document.getElementById("studentName"),d=document.getElementById("studentClass"),lt=document.getElementById("studentStatus"),E=document.getElementById("studentStatusAktif"),k=document.getElementById("studentJenisKelamin"),v=document.getElementById("studentNoHp"),j=document.getElementById("studentBill"),F=document.getElementById("studentPaid"),B=document.getElementById("nisError"),H=document.getElementById("nameError"),b=document.getElementById("detailModal"),dt=document.getElementById("detailModalClose"),ct=document.getElementById("detailCloseButton"),ut=document.getElementById("detailAvatar"),mt=document.getElementById("modalStudentName"),gt=document.getElementById("modalNis"),ft=document.getElementById("detailNis"),pt=document.getElementById("modalClass"),z=document.getElementById("modalStatus"),bt=document.getElementById("modalTagihan"),yt=document.getElementById("modalDibayar"),ht=document.getElementById("modalSisa"),wt=document.getElementById("detailMessage"),R=document.getElementById("profileButton"),y=document.getElementById("profileDropdown"),Et=document.getElementById("dropdownLogout");document.getElementById("sidebar");const kt=document.getElementById("sidebarToggle"),vt=document.getElementById("sidebarBackdrop"),Bt=document.getElementById("sidebarLogout"),q=document.getElementById("toast"),Q=8;let o=1;function I(t){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0)}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function It(t){return String(t||"").trim().split(/\s+/).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join("")}function h(t){q&&(q.textContent=t,q.classList.add("show"),clearTimeout(h.timer),h.timer=setTimeout(()=>{q.classList.remove("show")},2500))}function Pt(){if(!st)return;const t=new Date;st.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(t)}function $t(){const t=u.length,e=u.filter(n=>n.status==="lunas").length,a=u.filter(n=>n.status!=="lunas").length;tt&&(tt.textContent=t),et&&(et.textContent=e),at&&(at.textContent=a),nt&&(nt.textContent=t)}function jt(){const t=_?_.value.trim().toLowerCase():"",e=D?D.value:"all";return u.filter(a=>{const n=!t||a.name.toLowerCase().includes(t)||a.nis.toLowerCase().includes(t),i=e==="all"||a.status===e;return n&&i})}function w(){if(!L){console.error("BBCashvia: #studentTableBody tidak ditemukan.");return}const t=jt(),e=t.length,a=Math.max(1,Math.ceil(e/Q));o>a&&(o=a);const n=(o-1)*Q,i=Math.min(n+Q,e),r=t.slice(n,i);if(L.innerHTML="",r.length===0){A&&A.classList.add("show"),P&&(P.textContent="Tidak ada data siswa"),St(0);return}A&&A.classList.remove("show");const l=document.createDocumentFragment();r.forEach(s=>{const S=document.createElement("tr"),Y=s.status==="lunas"?"status-badge status-badge--success":s.status==="sebagian"?"status-badge status-badge--warning":"status-badge status-badge--danger",X=s.status==="lunas"?"Sudah Bayar":s.status==="sebagian"?"Sebagian":"Belum Bayar",J=Math.max(Number(s.bill)-Number(s.paid),0);S.innerHTML=`
                <td>
                    <div class="student-name">
                        <div class="student-avatar">
                            ${c(It(s.name))}
                        </div>

                        <div class="student-name__text">
                            <strong>
                                ${c(s.name)}
                            </strong>

                            <span class="student-nis">
                                NIS ${c(s.nis)}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    ${c(s.className)}
                </td>

                <td>
                    <span class="money">
                        ${I(s.bill)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${I(s.paid)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${I(J)}
                    </span>
                </td>

                <td>
                    <span class="${Y}">
                        ${X}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn action-btn--view"
                            data-action="detail"
                            data-nis="${c(s.nis)}"
                            title="Lihat detail"
                        >
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        </button>

                        <button
                            type="button"
                            class="action-btn action-btn--edit"
                            data-action="edit"
                            data-nis="${c(s.nis)}"
                            title="Edit siswa"
                        >
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>

                        <button
                            type="button"
                            class="action-btn action-btn--delete"
                            data-action="delete"
                            data-nis="${c(s.nis)}"
                            title="Hapus siswa"
                        >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>

                    </div>
                </td>
            `,l.appendChild(S)}),L.appendChild(l),P&&(P.textContent=`Menampilkan ${n+1}–${i} dari ${e} siswa`),St(a)}function St(t){if(G){if(G.innerHTML="",t<=0){C&&(C.disabled=!0),T&&(T.disabled=!0);return}for(let e=1;e<=t;e++){const a=document.createElement("button");a.type="button",a.className="page-btn",e===o&&a.classList.add("active"),a.textContent=e,a.addEventListener("click",()=>{o=e,w()}),G.appendChild(a)}C&&(C.disabled=o<=1,C.onclick=()=>{o<=1||(o--,w())}),T&&(T.disabled=o>=t,T.onclick=()=>{o>=t||(o++,w())})}}_&&_.addEventListener("input",()=>{o=1,w()}),D&&D.addEventListener("change",()=>{o=1,w()});function Lt(t=null){g&&(g.classList.add("is-open"),document.body.classList.add("modal-open"),t?(f&&(f.value=t.id_siswa),p&&(p.value=t.nis,p.disabled=!0),$&&($.value=t.name),d&&(d.value=t.className),lt&&(lt.value=t.status==="lunas"?"lunas":"belum"),E&&(E.value=t.status_aktif||"Aktif"),k&&(k.value=t.jenis_kelamin||""),v&&(v.value=t.no_hp||""),j&&(j.value=t.bill||0),F&&(F.value=t.paid||0)):(N&&N.reset(),f&&(f.value=""),p&&(p.disabled=!1),d&&(xt(),d.value=""),E&&(E.value="Aktif"),k&&(k.value=""),v&&(v.value=""),j&&(j.value=0),F&&(F.value=0)),Ct())}function x(){g&&(g.classList.remove("is-open"),document.body.classList.remove("modal-open"))}function Ct(){B&&(B.textContent="",B.classList.remove("show")),H&&(H.textContent="",H.classList.remove("show"))}function K(t,e){t&&(t.textContent=e,t.classList.add("show"))}it&&it.addEventListener("click",()=>{Lt()}),ot&&ot.addEventListener("click",x),rt&&rt.addEventListener("click",x),N&&N.addEventListener("submit",async t=>{t.preventDefault(),Ct();const e=N.querySelector('button[type="submit"]'),a=Rt(e);if(a)try{const n=p?p.value.trim():"",i=$?$.value.trim():"",r=d?d.value.trim():"",l=E?E.value:"Aktif";let s=!0;const S=f&&f.value?f.value.trim():"",Y=u.some(m=>m.nis===n&&String(m.id_siswa)!==S);if(n?Y&&(K(B,"NIS sudah digunakan."),s=!1):(K(B,"NIS wajib diisi."),s=!1),i||(K(H,"Nama siswa wajib diisi."),s=!1),!s)return;const X=W.find(m=>String(m.nama_kelas).toLowerCase()===r.toLowerCase()),J={nis:n,nama:i,id_kelas:X?Number(X.id_kelas):null,jenis_kelamin:k?k.value:"",no_hp:v?v.value.trim():"",status:l},Mt=S?u.find(m=>String(m.id_siswa)===String(S)):null;try{Mt?(await Z(`${M}/${Mt.id_siswa}`,"PUT",J),h("Data siswa berhasil diperbarui.")):(await Z(M,"POST",J),h("Siswa berhasil ditambahkan."))}catch(m){K(B,m.message);return}await V(),x()}finally{a.pulihkan()}});function Ft(t){if(!b||!t)return;const e=Math.max(Number(t.bill)-Number(t.paid),0);ut&&(ut.textContent=It(t.name)),mt&&(mt.textContent=t.name),gt&&(gt.textContent=`NIS ${t.nis}`),ft&&(ft.textContent=t.nis),pt&&(pt.textContent=t.className),z&&(z.textContent=t.status==="lunas"?"Sudah Bayar":t.status==="sebagian"?"Sebagian":"Belum Bayar",z.className=t.status==="lunas"?"status-badge status-badge--success":t.status==="sebagian"?"status-badge status-badge--warning":"status-badge status-badge--danger"),bt&&(bt.textContent=I(t.bill)),yt&&(yt.textContent=I(t.paid)),ht&&(ht.textContent=I(e)),wt&&(wt.textContent=t.status==="lunas"?"Iuran siswa sudah lunas.":t.status==="sebagian"?"Siswa sudah membayar sebagian, tetapi masih memiliki sisa tagihan.":"Siswa masih memiliki tagihan yang belum dibayar."),b.classList.add("is-open"),document.body.classList.add("modal-open")}function O(){b&&(b.classList.remove("is-open"),document.body.classList.remove("modal-open"))}dt&&dt.addEventListener("click",O),ct&&ct.addEventListener("click",O),L&&L.addEventListener("click",async t=>{const e=t.target.closest("[data-action]");if(!e)return;const a=e.dataset.action,n=e.dataset.nis,i=u.find(r=>r.nis===n);if(i){if(a==="detail"){Ft(i);return}if(a==="edit"){Lt(i);return}if(a==="delete"){if(!window.confirm(`Hapus data siswa "${i.name}"?`))return;try{await Dt(`${M}/${i.id_siswa}`)}catch(l){h(l.message);return}await V(),h("Data siswa berhasil dihapus.")}}}),R&&y&&R.addEventListener("click",t=>{t.stopPropagation(),y.classList.toggle("is-open")}),document.addEventListener("click",t=>{y&&R&&!R.contains(t.target)&&!y.contains(t.target)&&y.classList.remove("is-open")});function Ht(){document.body.classList.add("nav-open")}function Tt(){document.body.classList.remove("nav-open")}kt&&kt.addEventListener("click",Ht),vt&&vt.addEventListener("click",Tt);function Nt(){window.location.href="/logout"}Et&&Et.addEventListener("click",Nt),Bt&&Bt.addEventListener("click",Nt),document.addEventListener("keydown",t=>{t.key==="Escape"&&(x(),O(),Tt(),y&&y.classList.remove("is-open"))}),g&&g.addEventListener("click",t=>{t.target===g&&x()}),b&&b.addEventListener("click",t=>{t.target===b&&O()});const V=async()=>{const t=document.getElementById("studentTableBody");t&&(t.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="7"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));let e={data:[],kelas:[]};try{e=await _t(M)}catch(a){console.error(a),h(a.message)}W=Array.isArray(e?.kelas)?e.kelas:[],xt(),u=(Array.isArray(e?.data)?e.data:[]).map(a=>{const n=["lunas","sebagian","belum"].includes(a.status_iuran)?a.status_iuran:"belum";return{id_siswa:a.id_siswa,nis:a.nis??"-",name:a.nama??"-",className:a.kelas||"-",status:n,status_aktif:a.status??"Aktif",jenis_kelamin:a.jenis_kelamin??"",no_hp:a.no_hp??"",bill:Number(a.tagihan_iuran)||0,paid:Number(a.terbayar_iuran)||0,sisa:Number(a.sisa_iuran)||0}}),o=1,$t(),w()},xt=()=>{if(!d||d.tagName!=="SELECT")return;const t=d.value;d.innerHTML='<option value="">- Pilih Kelas -</option>'+W.map(e=>`<option value="${c(e.nama_kelas)}">${c(e.nama_kelas)}</option>`).join(""),d.value=t};U=At(),Pt(),w(),V()});
