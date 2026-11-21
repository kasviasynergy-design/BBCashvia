import{k as Ot,a as Xt}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const M="/bendahara/api/siswa";let C=[],K=[],J="";const $t=()=>{const t=document.querySelector('meta[name="csrf-token"]');return t?t.getAttribute("content"):""},Pt=async t=>{let e;const a=new AbortController,n=setTimeout(()=>a.abort(),3e4);try{e=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin",signal:a.signal})}catch(r){throw clearTimeout(n),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(n);let s={};try{s=await e.json()}catch{}if(!e.ok)throw e.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):e.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):e.status===401||e.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(s?.message||"Gagal mengambil data dari server.");return s},V=async(t,e,a)=>{let n;const s=new AbortController,r=setTimeout(()=>s.abort(),3e4);try{n=await fetch(t,{method:e,headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":J,...String(e).toUpperCase()==="POST"?{"X-Idempotency-Key":Xt()}:{}},credentials:"same-origin",body:JSON.stringify(a),signal:s.signal})}catch(i){throw clearTimeout(r),i?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(r);let o={};try{o=await n.json()}catch{}if(!n.ok){if(n.status>=500)throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");if(n.status===419)throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");if(n.status===401||n.status===403)throw new Error("Akses ditolak. Pastikan kamu sudah login.");if(o?.errors){const i=Object.values(o.errors).flat().filter(Boolean);if(i.length)throw new Error(i.join(" "))}throw new Error(o?.message||"Terjadi kesalahan saat menyimpan.")}return o},jt=async t=>{let e;const a=new AbortController,n=setTimeout(()=>a.abort(),3e4);try{e=await fetch(t,{method:"DELETE",headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":J},credentials:"same-origin",signal:a.signal})}catch(r){throw clearTimeout(n),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(n);let s={};try{s=await e.json()}catch{}if(!e.ok)throw e.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):e.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):e.status===401||e.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(s?.message||"Gagal menghapus data.");return s},N=document.getElementById("studentTableBody"),x=document.getElementById("emptyState"),A=document.getElementById("studentSearch"),$=document.getElementById("statusFilter"),Y=document.getElementById("totalStudents"),Z=document.getElementById("paidStudents"),tt=document.getElementById("unpaidStudents"),et=document.getElementById("classStudentCount"),at=document.getElementById("paginationInfo"),U=document.getElementById("pageNumbers"),W=document.getElementById("prevPage"),G=document.getElementById("nextPage"),nt=document.getElementById("currentDate"),p=document.getElementById("studentModal"),T=document.getElementById("studentForm"),st=document.getElementById("addStudentButton"),it=document.getElementById("cancelStudentButton"),ot=document.getElementById("modalClose"),b=document.getElementById("editingNis"),y=document.getElementById("studentNis"),P=document.getElementById("studentName"),u=document.getElementById("studentClass"),rt=document.getElementById("studentStatus"),k=document.getElementById("studentStatusAktif"),v=document.getElementById("studentJenisKelamin"),B=document.getElementById("studentNoHp"),j=document.getElementById("studentBill"),D=document.getElementById("studentPaid"),I=document.getElementById("nisError"),H=document.getElementById("nameError"),h=document.getElementById("detailModal"),lt=document.getElementById("detailModalClose"),dt=document.getElementById("detailCloseButton"),ut=document.getElementById("detailAvatar"),ct=document.getElementById("modalStudentName"),mt=document.getElementById("modalNis"),gt=document.getElementById("detailNis"),ft=document.getElementById("modalClass"),z=document.getElementById("modalStatus"),pt=document.getElementById("modalTagihan"),bt=document.getElementById("modalDibayar"),yt=document.getElementById("modalSisa"),ht=document.getElementById("detailMessage"),F=document.getElementById("profileButton"),w=document.getElementById("profileDropdown"),wt=document.getElementById("dropdownLogout");document.getElementById("sidebar");const Et=document.getElementById("sidebarToggle"),kt=document.getElementById("sidebarBackdrop"),vt=document.getElementById("sidebarLogout"),R=document.getElementById("toast");let l=1,q=1,S={total:0,current_page:1,last_page:1,from:0,to:0},Q=0;function L(t){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0)}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Bt(t){return String(t||"").trim().split(/\s+/).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join("")}function E(t){R&&(R.textContent=t,R.classList.add("show"),clearTimeout(E.timer),E.timer=setTimeout(()=>{R.classList.remove("show")},2500))}function Dt(){if(!nt)return;const t=new Date;nt.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(t)}function Ht(t){const e=t&&typeof t=="object"?t:{total:0,belum_lunas:0},a=Number(e.total)||0,n=Number(e.belum_lunas)||0,s=Math.max(a-n,0);Y&&(Y.textContent=a),Z&&(Z.textContent=s),tt&&(tt.textContent=n),et&&(et.textContent=a)}function Ft(){return C}function It(){if(!N){console.error("BBCashvia: #studentTableBody tidak ditemukan.");return}const t=Ft();if(N.innerHTML="",t.length===0){x&&x.classList.add("show"),St();return}x&&x.classList.remove("show");const e=document.createDocumentFragment();t.forEach(a=>{const n=document.createElement("tr"),s=a.status==="lunas"?"status-badge status-badge--success":a.status==="sebagian"?"status-badge status-badge--warning":"status-badge status-badge--danger",r=a.status==="lunas"?"Sudah Bayar":a.status==="sebagian"?"Sebagian":"Belum Bayar",o=Math.max(Number(a.bill)-Number(a.paid),0);n.innerHTML=`
                <td>
                    <div class="student-name">
                        <div class="student-avatar">
                            ${c(Bt(a.name))}
                        </div>

                        <div class="student-name__text">
                            <strong>
                                ${c(a.name)}
                            </strong>

                            <span class="student-nis">
                                NIS ${c(a.nis)}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    ${c(a.className)}
                </td>

                <td>
                    <span class="money">
                        ${L(a.bill)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${L(a.paid)}
                    </span>
                </td>

                <td>
                    <span class="money">
                        ${L(o)}
                    </span>
                </td>

                <td>
                    <span class="${s}">
                        ${r}
                    </span>
                </td>

                <td>
                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn action-btn--view"
                            data-action="detail"
                            data-nis="${c(a.nis)}"
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
                            data-nis="${c(a.nis)}"
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
                            data-nis="${c(a.nis)}"
                            title="Hapus siswa"
                        >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>

                    </div>
                </td>
            `,e.appendChild(n)}),N.appendChild(e),St()}function St(){const t=Number(S.from)||0,e=Number(S.to)||0,a=Number(S.total)||0,n=Number(S.current_page)||1,s=Math.max(1,Number(S.last_page)||1);if(l=n,q=s,at&&(at.textContent=`Menampilkan ${t}-${e} dari ${a} siswa • Halaman ${n} dari ${s}`),U){U.innerHTML="";const r=5;let o=Math.max(1,l-Math.floor(r/2)),i=Math.min(q,o+r-1);o=Math.max(1,i-r+1);for(let d=o;d<=i;d++){const m=document.createElement("button");m.type="button",m.className="page-btn",m.dataset.page=String(d),m.textContent=String(d),d===l&&m.classList.add("is-active","active"),m.addEventListener("click",()=>g(d)),U.appendChild(m)}}W&&(W.disabled=l<=1,W.onclick=()=>{l>1&&g(l-1)}),G&&(G.disabled=l>=q,G.onclick=()=>{l<q&&g(l+1)})}A&&A.addEventListener("input",()=>{l=1,g(1)}),$&&$.addEventListener("change",()=>{l=1,g(1)});function Lt(t=null){p&&(p.classList.add("is-open"),document.body.classList.add("modal-open"),t?(b&&(b.value=t.id_siswa),y&&(y.value=t.nis,y.disabled=!0),P&&(P.value=t.name),u&&(u.value=t.className),rt&&(rt.value=t.status==="lunas"?"lunas":"belum"),k&&(k.value=t.status_aktif||"Aktif"),v&&(v.value=t.jenis_kelamin||""),B&&(B.value=t.no_hp||""),j&&(j.value=t.bill||0),D&&(D.value=t.paid||0)):(T&&T.reset(),b&&(b.value=""),y&&(y.disabled=!1),u&&(_t(),u.value=""),k&&(k.value="Aktif"),v&&(v.value=""),B&&(B.value=""),j&&(j.value=0),D&&(D.value=0)),Ct())}function _(){p&&(p.classList.remove("is-open"),document.body.classList.remove("modal-open"))}function Ct(){I&&(I.textContent="",I.classList.remove("show")),H&&(H.textContent="",H.classList.remove("show"))}function O(t,e){t&&(t.textContent=e,t.classList.add("show"))}st&&st.addEventListener("click",()=>{Lt()}),it&&it.addEventListener("click",_),ot&&ot.addEventListener("click",_),T&&T.addEventListener("submit",async t=>{t.preventDefault(),Ct();const e=T.querySelector('button[type="submit"]'),a=Ot(e);if(a)try{const n=y?y.value.trim():"",s=P?P.value.trim():"",r=u?u.value.trim():"",o=k?k.value:"Aktif";let i=!0;const d=b&&b.value?b.value.trim():"",m=C.some(f=>f.nis===n&&String(f.id_siswa)!==d);if(n?m&&(O(I,"NIS sudah digunakan."),i=!1):(O(I,"NIS wajib diisi."),i=!1),s||(O(H,"Nama siswa wajib diisi."),i=!1),!i)return;const Mt=K.find(f=>String(f.nama_kelas).toLowerCase()===r.toLowerCase()),xt={nis:n,nama:s,id_kelas:Mt?Number(Mt.id_kelas):null,jenis_kelamin:v?v.value:"",no_hp:B?B.value.trim():"",status:o},At=d?C.find(f=>String(f.id_siswa)===String(d)):null;try{At?(await V(`${M}/${At.id_siswa}`,"PUT",xt),E("Data siswa berhasil diperbarui.")):(await V(M,"POST",xt),E("Siswa berhasil ditambahkan."))}catch(f){O(I,f.message);return}await g(),_()}finally{a.pulihkan()}});function Rt(t){if(!h||!t)return;const e=Math.max(Number(t.bill)-Number(t.paid),0);ut&&(ut.textContent=Bt(t.name)),ct&&(ct.textContent=t.name),mt&&(mt.textContent=`NIS ${t.nis}`),gt&&(gt.textContent=t.nis),ft&&(ft.textContent=t.className),z&&(z.textContent=t.status==="lunas"?"Sudah Bayar":t.status==="sebagian"?"Sebagian":"Belum Bayar",z.className=t.status==="lunas"?"status-badge status-badge--success":t.status==="sebagian"?"status-badge status-badge--warning":"status-badge status-badge--danger"),pt&&(pt.textContent=L(t.bill)),bt&&(bt.textContent=L(t.paid)),yt&&(yt.textContent=L(e)),ht&&(ht.textContent=t.status==="lunas"?"Iuran siswa sudah lunas.":t.status==="sebagian"?"Siswa sudah membayar sebagian, tetapi masih memiliki sisa tagihan.":"Siswa masih memiliki tagihan yang belum dibayar."),h.classList.add("is-open"),document.body.classList.add("modal-open")}function X(){h&&(h.classList.remove("is-open"),document.body.classList.remove("modal-open"))}lt&&lt.addEventListener("click",X),dt&&dt.addEventListener("click",X),N&&N.addEventListener("click",async t=>{const e=t.target.closest("[data-action]");if(!e)return;const a=e.dataset.action,n=e.dataset.nis,s=C.find(r=>r.nis===n);if(s){if(a==="detail"){Rt(s);return}if(a==="edit"){Lt(s);return}if(a==="delete"){if(!window.confirm(`Hapus data siswa "${s.name}"?`))return;try{await jt(`${M}/${s.id_siswa}`)}catch(o){E(o.message);return}await g(),E("Data siswa berhasil dihapus.")}}}),F&&w&&F.addEventListener("click",t=>{t.stopPropagation(),w.classList.toggle("is-open")}),document.addEventListener("click",t=>{w&&F&&!F.contains(t.target)&&!w.contains(t.target)&&w.classList.remove("is-open")});function qt(){document.body.classList.add("nav-open")}function Nt(){document.body.classList.remove("nav-open")}Et&&Et.addEventListener("click",qt),kt&&kt.addEventListener("click",Nt);function Tt(){window.location.href="/logout"}wt&&wt.addEventListener("click",Tt),vt&&vt.addEventListener("click",Tt),document.addEventListener("keydown",t=>{t.key==="Escape"&&(_(),X(),Nt(),w&&w.classList.remove("is-open"))}),p&&p.addEventListener("click",t=>{t.target===p&&_()}),h&&h.addEventListener("click",t=>{t.target===h&&X()});const g=async(t=l)=>{const e=++Q,a=document.getElementById("studentTableBody");a&&(a.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="7"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));const n=new URLSearchParams({serverSide:"1",page:String(t)}),s=A?A.value.trim():"",r=$?$.value:"all";s&&n.set("q",s),["lunas","sebagian","belum"].includes(r)&&n.set("status_iuran",r);let o={data:[],kelas:[]};try{o=await Pt(`${M}?${n.toString()}`)}catch(i){if(e!==Q)return;console.error(i),E(i.message)}e===Q&&(K=Array.isArray(o?.kelas)?o.kelas:[],_t(),C=(Array.isArray(o?.data)?o.data:[]).map(i=>{const d=["lunas","sebagian","belum"].includes(i.status_iuran)?i.status_iuran:"belum";return{id_siswa:i.id_siswa,nis:i.nis??"-",name:i.nama??"-",className:i.kelas||"-",status:d,status_aktif:i.status??"Aktif",jenis_kelamin:i.jenis_kelamin??"",no_hp:i.no_hp??"",bill:Number(i.tagihan_iuran)||0,paid:Number(i.terbayar_iuran)||0,sisa:Number(i.sisa_iuran)||0}}),S=o?.pagination&&typeof o.pagination=="object"?o.pagination:{total:0,current_page:1,last_page:1,from:0,to:0},Ht(o?.statistik),It())},_t=()=>{if(!u||u.tagName!=="SELECT")return;const t=u.value;u.innerHTML='<option value="">- Pilih Kelas -</option>'+K.map(e=>`<option value="${c(e.nama_kelas)}">${c(e.nama_kelas)}</option>`).join(""),u.value=t};J=$t(),Dt(),It(),g()});
