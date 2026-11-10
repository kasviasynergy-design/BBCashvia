document.addEventListener("DOMContentLoaded",async()=>{const M="/admin/api/dashboard",i=t=>"Rp "+new Intl.NumberFormat("id-ID").format(t||0),v=t=>{const e=Number(t)||0;if(e>=1e6){const a=e/1e6;return(a%1===0?a.toFixed(0):a.toFixed(2).replace(/0$/,"")).replace(".",",")+"jt"}return e>=1e3?(e/1e3).toFixed(0)+"rb":String(e)},k=t=>document.querySelector(t),F={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"},O=t=>F[String(t??"").toLowerCase()]||String(t??""),L=async t=>{const e=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),a=await fetch(t,{headers:{Accept:"application/json",...e?{"X-CSRF-TOKEN":e}:{}},credentials:"same-origin"});if(!a.ok)throw new Error("Gagal memuat data dari server.");return await a.json()};let B={},m=[],y=[];try{const[t,e,a]=await Promise.all([L(M+"/"),L(M+"/chart"),L(M+"/recent")]);B=t.data||t,m=e.data||e,y=a.data||a}catch(t){console.error("Gagal memuat dashboard:",t)}const l=B.kpi||{},E=B.ringkasan||{},T=Number(l.total_kas)||0,q=()=>{[["#kpiTotalKas",i(T)],["#kpiPemasukan",i(l.total_pemasukan)],["#kpiPengeluaran",i(l.total_pengeluaran)],["#kpiIuran",i(l.total_iuran)],["#kpiSiswa",l.jumlah_siswa+" siswa"],["#kpiTransaksi",l.total_transaksi+" transaksi"]].forEach(([o,u])=>{const c=k(o);c&&(c.textContent=u)});const e=k("#kpiIuranBar");if(e){const o=l.iuran_target?Math.round(Number(l.total_iuran)/Number(l.iuran_target)*100):0;e.style.width=Math.min(o,100)+"%"}const a=k("#kpiIuranMeta");a&&l.iuran_target&&(a.textContent=i(l.total_iuran)+" dari target "+i(l.iuran_target));const r=k("#kpiSiswaMeta");r&&(r.textContent=l.siswa_belum_lunas+" siswa belum lunas iuran bulan ini");const d=k("#kpiTrxMeta");d&&(d.textContent="Seluruh transaksi tercatat")},W=()=>{[["#rumusMasuk","+ "+i(E.total_masuk)],["#rumusKeluar","− "+i(E.total_keluar)],["#rumusSekarang",i(E.saldo_sekarang)]].forEach(([e,a])=>{const r=k(e);r&&(r.textContent=a)})},X=()=>{const t=document.getElementById("barChart");if(!t)return;if(!m||m.length===0){t.innerHTML='<div class="kosong">Data grafik tidak tersedia.</div>';return}const e=m.flatMap(s=>[Number(s.masuk)||0,Number(s.keluar)||0]),a=Math.max(...e),r=Math.ceil(a*1.15/5e5)*5e5||5e5,d=300,o=[0,.25,.5,.75,1],u=o.map(s=>{const g=r*s;return`<span>${v(g)}</span>`}).join(""),c=o.map((s,g)=>`<i class="${g===0?"barchart__gl barchart__gl--base":"barchart__gl"}" style="bottom:${s*100}%"></i>`).join(""),_=m.map(s=>{const g=Math.max(2,Math.round((Number(s.masuk)||0)/r*100)),$=Math.max(2,Math.round((Number(s.keluar)||0)/r*100));return`
                    <div class="barchart__col">
                        <div class="barchart__pair">
                            <div
                                class="barchart__bar barchart__bar--in"
                                style="height:${g}%"
                                title="Pemasukan ${s.bulan}: ${i(s.masuk)}"
                                aria-label="Pemasukan ${s.bulan}: ${i(s.masuk)}"
                            >
                                <i class="barchart__tip">${v(s.masuk)}</i>
                            </div>
                            <div
                                class="barchart__bar barchart__bar--out"
                                style="height:${$}%"
                                title="Pengeluaran ${s.bulan}: ${i(s.keluar)}"
                                aria-label="Pengeluaran ${s.bulan}: ${i(s.keluar)}"
                            >
                                <i class="barchart__tip">${v(s.keluar)}</i>
                            </div>
                        </div>
                        <span class="barchart__mon">${s.bulan}</span>
                    </div>
                `}).join("");t.innerHTML=`
            <div class="barchart">
                <div class="barchart__ylabs">${u}</div>
                <div class="barchart__plot" style="height:${d}px">
                    ${c}
                    <div class="barchart__cols">${_}</div>
                </div>
            </div>
        `},Y=()=>{const t=document.getElementById("lineChart");if(!t)return;if(!m||m.length===0){t.innerHTML='<div class="kosong">Data grafik tidak tersedia.</div>';return}let e=T;const a=m.slice().reverse().map(n=>{const b={bulan:n.bulan,saldo:e};return e-=(Number(n.masuk)||0)-(Number(n.keluar)||0),b}).reverse(),r=Math.max(...a.map(n=>n.saldo)),d=Math.min(...a.map(n=>n.saldo)),o=r-d;let u,c;if(o>=1e6)u=Math.ceil((r+o*.15)/5e5)*5e5,c=Math.floor((d-o*.15)/5e5)*5e5;else{const n=(r+d)/2;c=Math.floor((n-5e5)/5e5)*5e5,u=c+1e6}const _=u-c,s=[0,.25,.5,.75,1],g=s.map(n=>`<span>${v(u-_*n)}</span>`).join(""),$=s.map((n,b)=>`<i class="${b===0?"barchart__gl barchart__gl--base":"barchart__gl"}" style="bottom:${n*100}%"></i>`).join(""),Q=700,S=300,x=n=>Q*(n+.5)/a.length,U=n=>(1-(n-c)/_)*S,H=a.map((n,b)=>`${Math.round(x(b))},${Math.round(U(n.saldo))}`).join(" "),V=Math.round(x(0)),Z=Math.round(x(a.length-1)),aa=H+` ${Z},${S} ${V},${S}`,ta=a.map(n=>`
                    <div class="linechart__col">
                        <i
                            class="linechart__point"
                            style="top:${Math.max(2,Math.min(98,Math.round((1-(n.saldo-c)/_)*100)))}%"
                            title="Saldo akhir ${n.bulan}: ${i(n.saldo)}"
                            aria-label="Saldo akhir ${n.bulan}: ${i(n.saldo)}"
                        >
                        </i>
                        <span class="barchart__mon">${n.bulan}</span>
                    </div>
                `).join("");t.innerHTML=`
            <div class="linechart">
                <div class="linechart__ylabs">${g}</div>
                <div class="linechart__plot" style="height:300px">
                    ${$}
                    <svg
                        class="linechart__svg"
                        viewBox="0 0 700 300"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon
                            class="linechart__area"
                            points="${aa}"
                        ></polygon>
                        <polyline
                            class="linechart__line"
                            points="${H}"
                        ></polyline>
                    </svg>
                    <div class="linechart__cols">${ta}</div>
                </div>
            </div>
        `},z=()=>{const t=document.getElementById("recentTxBody");if(!t)return;if(!y||y.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" class="table__empty">Belum ada transaksi.</td>
                </tr>`;return}const e=y.map(a=>{const r=a.arah==="pemasukan"?"+":"−",d=a.arah==="pemasukan"?"table__nominal--in":"table__nominal--out",o="table__cat--"+(a.tipe||a.arah||""),u=a.statusTipe==="ok"?"badge--ok":"badge--warn";return`
                    <tr>
                        <td>
                            <div class="table__primary">${a.id}</div>
                            <div class="table__secondary">${a.tanggal} • ${a.jam}</div>
                        </td>
                        <td>
                            <div class="table__primary">${a.ket}</div>
                            <div class="table__secondary">${a.unit}</div>
                        </td>
                        <td>
                            <span class="table__cat ${o}">${O(a.kategori)}</span>
                        </td>
                        <td>
                            <div class="table__primary">${a.tanggal}</div>
                            <div class="table__secondary">${a.jam} WIB</div>
                        </td>
                        <td>
                            <span class="table__nominal ${d}">${r}${i(a.nominal)}</span>
                        </td>
                        <td>
                            <span class="badge ${u}">${a.status}</span>
                        </td>
                    </tr>`}).join("");t.innerHTML=e},w=document.getElementById("sidebarToggle"),C=document.getElementById("sidebarBackdrop"),P=()=>{document.body.classList.remove("nav-open")};w&&w.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),C&&C.addEventListener("click",P);const p=document.getElementById("profileBtn"),h=document.getElementById("profileMenu"),j=()=>{h&&h.classList.remove("is-open"),p&&p.setAttribute("aria-expanded","false")};p&&h&&(p.addEventListener("click",t=>{t.stopPropagation();const e=h.classList.toggle("is-open");p.setAttribute("aria-expanded",e?"true":"false")}),document.addEventListener("click",t=>{!h.contains(t.target)&&t.target!==p&&j()})),document.addEventListener("keydown",t=>{t.key==="Escape"&&(P(),j())});const f=document.getElementById("tabBar"),I=document.getElementById("tabLine"),K=document.getElementById("barChart"),N=document.getElementById("lineChart"),A=document.getElementById("legendBar1"),R=document.getElementById("legendBar2"),D=document.getElementById("legendLine"),G=t=>{const e=t==="bar";[f,I].forEach(a=>{if(!a)return;const r=a===f===e;a.classList.toggle("is-active",r),a.setAttribute("aria-selected",r?"true":"false")}),K&&K.classList.toggle("is-hidden",!e),N&&N.classList.toggle("is-hidden",e),A&&A.classList.toggle("is-hidden",!e),R&&R.classList.toggle("is-hidden",!e),D&&D.classList.toggle("is-hidden",e)};f&&f.addEventListener("click",()=>G("bar")),I&&I.addEventListener("click",()=>G("line"));const J=()=>{const t=document.getElementById("greeting");t&&(t.textContent="Selamat datang");const e=document.getElementById("topbarDate");e&&(e.textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))};q(),W(),X(),Y(),z(),J()});
