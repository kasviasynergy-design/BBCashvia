import{k as zt,a as Qt}from"./simpan-guard-D5jj-dSF.js";document.addEventListener("DOMContentLoaded",()=>{const D="/bendahara/api/iuran",$t="/bendahara/api/siswa",Nt="/bendahara/api/transaksi";let $=[],N=[],_=[],tt="";const _t=()=>{const t=document.querySelector('meta[name="csrf-token"]');return t?t.getAttribute("content"):""},G=async t=>{let e;const a=new AbortController,n=setTimeout(()=>a.abort(),3e4);try{e=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin",signal:a.signal})}catch(r){throw clearTimeout(n),r?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(n);let i={};try{i=await e.json()}catch{}if(!e.ok)throw e.status>=500?new Error("Terjadi gangguan pada server. Coba lagi beberapa saat."):e.status===419?new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi."):e.status===401||e.status===403?new Error("Akses ditolak. Pastikan kamu sudah login."):new Error(i?.message||"Gagal mengambil data dari server.");return i},V=async(t,e,a)=>{let n;const i=new AbortController,r=setTimeout(()=>i.abort(),3e4);try{n=await fetch(t,{method:e,headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":tt,...String(e).toUpperCase()==="POST"?{"X-Idempotency-Key":Qt()}:{}},credentials:"same-origin",body:JSON.stringify(a),signal:i.signal})}catch(u){throw clearTimeout(r),u?.name==="AbortError"?new Error("Permintaan melebihi waktu tunggu (timeout). Periksa koneksi, lalu coba lagi."):new Error("Tidak dapat terhubung ke server.")}clearTimeout(r);let o={};try{o=await n.json()}catch{}if(!n.ok){if(n.status>=500)throw new Error("Terjadi gangguan pada server. Coba lagi beberapa saat.");if(n.status===419)throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");if(n.status===401||n.status===403)throw new Error("Akses ditolak. Pastikan kamu sudah login.");if(o?.errors){const u=Object.values(o.errors).flat().filter(Boolean);if(u.length)throw new Error(u.join(" "))}throw new Error(o?.message||"Terjadi kesalahan saat menyimpan.")}return o};let j=null,et=null,at=null;document.getElementById("sidebar");const f=document.getElementById("sidebarToggle"),nt=document.getElementById("sidebarBackdrop"),c=document.getElementById("profileButton"),m=document.getElementById("profileDropdown"),it=document.getElementById("sidebarLogout"),rt=document.getElementById("dropdownLogout"),ot=document.getElementById("currentDate"),st=document.getElementById("btnTambahIuran"),p=document.getElementById("cariIuran"),h=document.getElementById("filterKategori"),I=document.getElementById("filterStatusIuran"),ut=document.getElementById("btnResetFilter"),S=document.getElementById("isiTabelIuran"),s=document.getElementById("emptyState"),lt=document.getElementById("jumlahIuranFoot"),dt=document.getElementById("sumTotalIuran"),ct=document.getElementById("sumTagihan"),mt=document.getElementById("sumTerkumpul"),x=document.getElementById("modalIuran"),K=document.getElementById("modalIuranTitle"),M=document.getElementById("modalIuranSub"),L=document.getElementById("formIuran"),b=document.getElementById("inputNamaIuran"),y=document.getElementById("inputKategori"),P=document.getElementById("inputJatuhTempo"),H=document.getElementById("inputNominalIuran"),k=document.getElementById("inputStatusIuran"),q=document.getElementById("inputKeteranganIuran"),l=document.getElementById("formErrorIuran"),jt=document.getElementById("modalDetailIuran"),gt=document.getElementById("detailIuranTitle"),ft=document.getElementById("detailIuranSub"),pt=document.getElementById("detailKategori"),ht=document.getElementById("detailJatuhTempo"),It=document.getElementById("detailNominal"),bt=document.getElementById("detailTerkumpul"),E=document.getElementById("cariDetailSiswa"),w=document.getElementById("filterDetailStatus"),z=document.getElementById("isiTabelDetail"),yt=document.getElementById("emptyDetail"),F=document.getElementById("toast"),kt=document.getElementById("toastTitle"),Et=document.getElementById("toastMessage"),wt=document.getElementById("toastIcon"),Tt=document.getElementById("toastClose");function g(t){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0)}function vt(t){if(!t)return"-";const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"short",year:"numeric"}).format(e)}function xt(t){return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(t)}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function St(t){return{harian:"Harian",mingguan:"Mingguan",bulanan:"Bulanan",tahunan:"Tahunan",insidental:"Insidental","sekali bayar":"Sekali Bayar"}[t]||t}function Lt(t){return _.filter(e=>String(e.jenis||"").toUpperCase()==="PEMASUKAN"&&String(e.id_iuran)===String(t.id_iuran)).length}function Q(){return $.length?$.length:0}function Kt(t){return Number(t.nominal)*Q()}function Y(t){return _.filter(e=>String(e.jenis||"").toUpperCase()==="PEMASUKAN"&&String(e.id_iuran)===String(t.id_iuran)).reduce((e,a)=>e+(Number(a.nominal)||0),0)}function Mt(t){const e=Q();return e?Math.round(Lt(t)/e*100):0}function O(t){return N.find(e=>String(e.id_iuran)===String(t))}function Bt(t,e){const a=Wt(e.id_siswa,t.id_iuran),n=Number(t.nominal)||0;return n>0&&a>=n}const Pt=t=>({id_siswa:t.id_siswa,nama:t.nama??"-",nisn:t.nis??"-",kelas:t.kelas||"-"}),Ht=t=>({id_iuran:t.id_iuran,nama:t.nama_iuran??"-",kategori:String(t.kategori??"").toLowerCase(),jatuhTempo:t.jatuh_tempo?String(t.jatuh_tempo).slice(0,10):"",nominal:Number(t.nominal)||0,status:String(t.status||"aktif").toLowerCase(),keterangan:t.keterangan||""});function qt(t){return String(t).trim().split(/\s+/).slice(0,2).map(e=>e.charAt(0)).join("").toUpperCase()}function Ft(){ot&&(ot.textContent=xt(new Date))}Ft();function Ot(){document.body.classList.add("nav-open"),f&&f.setAttribute("aria-expanded","true")}function B(){document.body.classList.remove("nav-open"),f&&f.setAttribute("aria-expanded","false")}f&&f.addEventListener("click",()=>{document.body.classList.contains("nav-open")?B():Ot()}),nt&&nt.addEventListener("click",B),document.querySelectorAll(".side-link").forEach(t=>{t.addEventListener("click",()=>{B()})});function R(){m&&(m.classList.remove("is-open"),c&&c.setAttribute("aria-expanded","false"))}function Rt(){if(!m)return;if(m.classList.contains("is-open")){R();return}m.classList.add("is-open"),c&&c.setAttribute("aria-expanded","true")}c&&c.addEventListener("click",t=>{t.stopPropagation(),Rt()}),document.addEventListener("click",t=>{m&&c&&!m.contains(t.target)&&!c.contains(t.target)&&R()});function Ct(){R(),B(),A("Keluar","Anda akan diarahkan ke halaman login.","logout"),setTimeout(()=>{window.location.href="/logout"},900)}it&&it.addEventListener("click",Ct),rt&&rt.addEventListener("click",Ct);function U(t){t&&(t.hidden=!1,requestAnimationFrame(()=>{t.classList.add("is-open")}),document.body.classList.add("modal-open"))}function C(t){t&&(t.classList.remove("is-open"),setTimeout(()=>{t.hidden=!0},180),setTimeout(()=>{document.querySelector(".modal.is-open")||document.body.classList.remove("modal-open")},190))}document.querySelectorAll("[data-close-modal]").forEach(t=>{t.addEventListener("click",()=>{const e=t.closest(".modal");C(e)})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(document.querySelectorAll(".modal.is-open").forEach(e=>{C(e)}),R(),B())});function At(){const t=N.filter(n=>n.status==="aktif"),e=t.reduce((n,i)=>n+Kt(i),0),a=t.reduce((n,i)=>n+Y(i),0);dt&&(dt.textContent=t.length),ct&&(ct.textContent=g(e)),mt&&(mt.textContent=g(a))}function Dt(){const t=p?p.value.trim().toLowerCase():"",e=h?h.value.trim().toLowerCase():"semua",a=I?I.value.trim().toLowerCase():"semua";return N.filter(n=>{const i=String(n.nama||"").toLowerCase(),r=String(n.keterangan||"").toLowerCase(),o=String(n.kategori||"").toLowerCase(),u=String(n.status||"").toLowerCase();return(!t||i.includes(t)||r.includes(t))&&(e==="semua"||e===""||o===e)&&(a==="semua"||a===""||u===a)})}function T(){if(!S)return;const t=Dt();S.innerHTML="",s&&(t.length>0?(s.hidden=!0,s.classList.remove("show")):(s.hidden=!1,s.classList.add("show"))),lt&&(lt.textContent=`${t.length} iuran`),t.length&&t.forEach(e=>{const a=Lt(e),n=Q(),i=Y(e),r=Mt(e),o=document.createElement("tr");o.innerHTML=`
                    <td>
                        <div class="table-primary">
                            ${d(e.nama)}
                        </div>

                        <div class="table-secondary">
                            ${d(e.keterangan||"Tidak ada keterangan")}
                        </div>
                    </td>

                    <td>
                        <span class="frequency-badge">
                            ${d(St(e.kategori))}
                        </span>
                    </td>

                    <td>
                        ${vt(e.jatuhTempo)}
                    </td>

                    <td>
                        <strong>
                            ${g(e.nominal)}
                        </strong>
                    </td>

                    <td>
                        ${g(i)}
                    </td>

                    <td>
                        <div class="progress-cell">

                            <div class="progress-top">

                                <span>
                                    ${a}/${n} siswa
                                </span>

                                <strong>
                                    ${r}%
                                </strong>

                            </div>

                            <div class="progress-bar">
                                <span
                                    style="width:${r}%"
                                ></span>
                            </div>

                        </div>
                    </td>

                    <td>
                        <span
                            class="status-badge status-badge--${e.status==="aktif"?"aktif":"selesai"}"
                        >
                            <span class="status-dot"></span>

                            ${e.status==="aktif"?"Aktif":"Selesai"}
                        </span>
                    </td>

                    <td class="text-right">

                        <div class="action-group">

                            <button
                                type="button"
                                class="icon-btn"
                                title="Detail"
                                data-action="detail"
                                data-id="${e.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    visibility
                                </span>
                            </button>

                            <button
                                type="button"
                                class="icon-btn"
                                title="Edit"
                                data-action="edit"
                                data-id="${e.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </button>

                            <button
                                type="button"
                                class="icon-btn icon-btn--danger"
                                title="Hapus"
                                data-action="delete"
                                data-id="${e.id_iuran}"
                            >
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </button>

                        </div>

                    </td>
                `,S.appendChild(o)})}function v(){if(!s)return;Dt().length>0?(s.hidden=!0,s.style.display="",s.classList.remove("show")):(s.hidden=!1,s.style.display="",s.classList.add("show"))}function Ut(){L&&(L.reset(),y&&(y.value="mingguan"),k&&(k.value="aktif"),l&&(l.hidden=!0,l.textContent=""),j=null)}function Jt(){Ut(),K&&(K.textContent="Tambah Iuran"),M&&(M.textContent="Tambahkan iuran baru untuk kelas ini."),U(x),setTimeout(()=>{b&&b.focus()},200)}st&&st.addEventListener("click",Jt);function Xt(t){const e=O(t);e&&(j=e.id_iuran,K&&(K.textContent="Edit Iuran"),M&&(M.textContent="Perbarui data iuran kelas ini."),b&&(b.value=e.nama),y&&(y.value=e.kategori),P&&(P.value=e.jatuhTempo),H&&(H.value=e.nominal),k&&(k.value=e.status),q&&(q.value=e.keterangan||""),l&&(l.hidden=!0,l.textContent=""),U(x))}const Wt=(t,e)=>_.filter(a=>{const n=String(a.jenis||"").toUpperCase();return(n==="PEMASUKAN"||n==="M")&&String(a.id_siswa??"")===String(t)&&String(a.id_iuran??"")===String(e)}).reduce((a,n)=>a+(Number(n.nominal)||0),0);L&&L.addEventListener("submit",async t=>{t.preventDefault();const e=L.querySelector('button[type="submit"]'),a=zt(e);if(a)try{const n=b?b.value.trim():"",i=H?Number(H.value):0,r=P?P.value:"";if(!n){J(l,"Nama iuran wajib diisi.");return}if(!i||i<=0){J(l,"Nominal iuran harus lebih dari Rp0.");return}if(!r){J(l,"Jatuh tempo wajib diisi.");return}const o={nama_iuran:n,kategori:y?y.value:"sekali bayar",jatuh_tempo:r,nominal:i,status:k?k.value:"aktif",keterangan:q?q.value.trim():""};try{j?(await V(`${D}/${j}`,"PUT",o),C(x),await W(),A("Iuran diperbarui","Data iuran berhasil diperbarui.","check")):(await V(D,"POST",o),C(x),await W(),A("Iuran ditambahkan","Iuran baru berhasil ditambahkan.","check"))}catch(u){J(l,u.message)}}finally{a.pulihkan()}});function J(t,e){t&&(t.textContent=e,t.hidden=!1)}function Gt(t){const e=O(t);e&&(et=e.id_iuran,gt&&(gt.textContent=e.nama),ft&&(ft.textContent=e.keterangan||"Detail status pembayaran siswa kelas ini."),pt&&(pt.textContent=St(e.kategori)),ht&&(ht.textContent=vt(e.jatuhTempo)),It&&(It.textContent=g(e.nominal)),bt&&(bt.textContent=g(Y(e))),E&&(E.value=""),w&&(w.value="semua"),Z(),U(jt))}function Z(){if(!z)return;const t=O(et);if(!t)return;const e=E?E.value.trim().toLowerCase():"",a=w?w.value:"semua",n=$.filter(i=>{const r=Bt(t,i);return(!e||String(i.nama).toLowerCase().includes(e)||String(i.nisn).toLowerCase().includes(e))&&(a==="semua"||a===""||a==="lunas"&&r||a==="belum"&&!r)});z.innerHTML="",yt&&(yt.hidden=n.length>0),n.length&&n.forEach((i,r)=>{const o=Bt(t,i),u=document.createElement("tr");u.innerHTML=`
                    <td>
                        ${r+1}
                    </td>

                    <td>
                        <div class="student-cell">

                            <div class="student-cell__avatar">
                                ${d(qt(i.nama))}
                            </div>

                            <div>

                                <strong>
                                    ${d(i.nama)}
                                </strong>

                                <span>
                                    ${d(i.kelas||"Siswa")}
                                </span>

                            </div>

                        </div>
                    </td>

                    <td>
                        <span class="mono">
                            ${d(i.nisn)}
                        </span>
                    </td>

                    <td>
                        ${d(i.kelas)}
                    </td>

                    <td>
                        ${g(t.nominal)}
                    </td>

                    <td>

                        <span class="status-badge ${o?"status-badge--lunas":"status-badge--belum"}">

                            <span class="status-dot"></span>

                            ${o?"Lunas":"Belum Lunas"}

                        </span>

                    </td>

                `,z.appendChild(u)})}E&&E.addEventListener("input",Z),w&&w.addEventListener("change",Z),S&&S.addEventListener("click",t=>{const e=t.target.closest("[data-action]");if(!e)return;const a=e.dataset.action,n=Number(e.dataset.id);a==="detail"&&Gt(n),a==="edit"&&Xt(n),a==="delete"&&Vt(n)});let X=null;function Vt(t){const e=O(t);if(!e)return;const a=document.getElementById("modalHapusIuran");a&&(X=e.id_iuran,document.getElementById("hapusIuranNama").textContent=e.nama,U(a))}document.getElementById("btnKonfirmasiHapus")?.addEventListener("click",async()=>{if(X===null)return;const t=X,e=document.getElementById("btnKonfirmasiHapus");e&&(e.disabled=!0);try{await V(`${D}/${t}`,"DELETE",null),X=null,C(document.getElementById("modalHapusIuran")),A("Iuran dihapus","Iuran berhasil dihapus.","check"),await W()}catch(a){A("Gagal menghapus",a.message,"close")}finally{e&&(e.disabled=!1)}}),p&&p.addEventListener("input",()=>{T(),v()}),h&&h.addEventListener("change",()=>{T(),v()}),I&&I.addEventListener("change",()=>{T(),v()}),ut&&ut.addEventListener("click",()=>{p&&(p.value=""),h&&(h.value="semua"),I&&(I.value="semua"),T(),v()});function A(t,e,a="check"){F&&(clearTimeout(at),kt&&(kt.textContent=t),Et&&(Et.textContent=e),wt&&(wt.innerHTML=`
                <span class="material-symbols-outlined">
                    ${d(a)}
                </span>
            `),F.classList.add("is-show"),at=setTimeout(()=>{F.classList.remove("is-show")},3500))}Tt&&Tt.addEventListener("click",()=>{F.classList.remove("is-show")});const W=async()=>{const t=document.getElementById("isiTabelIuran");t&&(t.innerHTML=Array.from({length:5}).map(()=>'<tr class="skeleton-row"><td colspan="8"><div class="skeleton skeleton-text--lg"></div></td></tr>').join(""));let e={data:[]},a={data:[]},n={data:[]};try{[e,a,n]=await Promise.all([G(D),G($t),G(Nt)])}catch(i){console.error(i)}$=(Array.isArray(a?.data)?a.data:[]).map(Pt),_=Array.isArray(n?.data)?n.data:[],N=(Array.isArray(e?.data)?e.data:[]).map(Ht),At(),T(),v()};tt=_t(),At(),T(),v(),W()});
