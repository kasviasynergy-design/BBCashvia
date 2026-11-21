document.addEventListener("DOMContentLoaded",async()=>{const I="/admin/api/dashboard",i=a=>"Rp "+new Intl.NumberFormat("id-ID").format(a||0),v=a=>{const e=Number(a)||0;if(e>=1e6){const t=e/1e6;return(t%1===0?t.toFixed(0):t.toFixed(2).replace(/0$/,"")).replace(".",",")+"jt"}return e>=1e3?(e/1e3).toFixed(0)+"rb":String(e)},b=a=>document.querySelector(a),O=a=>String(a??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),J={iuran:"Iuran",kas:"Kas","kebutuhan kelas":"Kebutuhan Kelas","perlengkapan kelas":"Perlengkapan Kelas","kegiatan kelas":"Kegiatan Kelas","pemasukan lainnya":"Pemasukan Lainnya","pengeluaran lainnya":"Pengeluaran Lainnya"},W=a=>J[String(a??"").toLowerCase()]||String(a??""),L=async a=>{const e=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),t=await fetch(a,{headers:{Accept:"application/json",...e?{"X-CSRF-TOKEN":e}:{}},credentials:"same-origin"});if(!t.ok)throw new Error("Gagal memuat data dari server.");return await t.json()};let f={},m=[],$=[];try{const[a,e,t]=await Promise.all([L(I+"/"),L(I+"/chart"),L(I+"/recent")]);f=a.data||a,m=e.data||e,$=t.data||t}catch(a){console.error("Gagal memuat dashboard:",a)}const d=f.kpi||{},E=f.ringkasan||{},g=f.rekap||{},x=Number(d.total_kas)||0,X=()=>{[["#kpiTotalKas",i(x)],["#kpiPemasukan",i(d.total_pemasukan)],["#kpiPengeluaran",i(d.total_pengeluaran)],["#kpiIuran",i(d.total_iuran)],["#kpiSiswa",d.jumlah_siswa+" siswa"],["#kpiTransaksi",d.total_transaksi+" transaksi"]].forEach(([l,o])=>{const u=b(l);u&&(u.textContent=o)});const e=b("#kpiIuranBar");if(e){const l=d.iuran_target?Math.round(Number(d.total_iuran)/Number(d.iuran_target)*100):0;e.style.width=Math.min(l,100)+"%"}const t=b("#kpiIuranMeta");t&&d.iuran_target&&(t.textContent=i(d.total_iuran)+" dari target "+i(d.iuran_target));const n=b("#kpiSiswaMeta");n&&(n.textContent=d.siswa_belum_lunas+" siswa belum lunas iuran bulan ini");const c=b("#kpiTrxMeta");c&&(c.textContent="Seluruh transaksi tercatat")},Y=()=>{[["#rumusMasuk","+ "+i(E.total_masuk)],["#rumusKeluar","− "+i(E.total_keluar)],["#rumusSekarang",i(E.saldo_sekarang)]].forEach(([e,t])=>{const n=b(e);n&&(n.textContent=t)})},z=()=>{const a=document.getElementById("barChart");if(!a)return;if(!m||m.length===0){a.innerHTML='<div class="kosong">Data grafik tidak tersedia.</div>';return}const e=m.flatMap(r=>[Number(r.masuk)||0,Number(r.keluar)||0]),t=Math.max(...e),n=Math.ceil(t*1.15/5e5)*5e5||5e5,c=300,l=[0,.25,.5,.75,1],o=l.map(r=>{const p=n*r;return`<span>${v(p)}</span>`}).join(""),u=l.map((r,p)=>`<i class="${p===0?"barchart__gl barchart__gl--base":"barchart__gl"}" style="bottom:${r*100}%"></i>`).join(""),k=m.map(r=>{const p=Math.max(2,Math.round((Number(r.masuk)||0)/n*100)),B=Math.max(2,Math.round((Number(r.keluar)||0)/n*100));return`
                    <div class="barchart__col">
                        <div class="barchart__pair">
                            <div
                                class="barchart__bar barchart__bar--in"
                                style="height:${p}%"
                                title="Pemasukan ${r.bulan}: ${i(r.masuk)}"
                                aria-label="Pemasukan ${r.bulan}: ${i(r.masuk)}"
                            >
                                <i class="barchart__tip">${v(r.masuk)}</i>
                            </div>
                            <div
                                class="barchart__bar barchart__bar--out"
                                style="height:${B}%"
                                title="Pengeluaran ${r.bulan}: ${i(r.keluar)}"
                                aria-label="Pengeluaran ${r.bulan}: ${i(r.keluar)}"
                            >
                                <i class="barchart__tip">${v(r.keluar)}</i>
                            </div>
                        </div>
                        <span class="barchart__mon">${r.bulan}</span>
                    </div>
                `}).join("");a.innerHTML=`
            <div class="barchart">
                <div class="barchart__ylabs">${o}</div>
                <div class="barchart__plot" style="height:${c}px">
                    ${u}
                    <div class="barchart__cols">${k}</div>
                </div>
            </div>
        `},Q=()=>{const a=document.getElementById("lineChart");if(!a)return;if(!m||m.length===0){a.innerHTML='<div class="kosong">Data grafik tidak tersedia.</div>';return}let e=x;const t=m.slice().reverse().map(s=>{const _={bulan:s.bulan,saldo:e};return e-=(Number(s.masuk)||0)-(Number(s.keluar)||0),_}).reverse(),n=Math.max(...t.map(s=>s.saldo)),c=Math.min(...t.map(s=>s.saldo)),l=n-c;let o,u;if(l>=1e6)o=Math.ceil((n+l*.15)/5e5)*5e5,u=Math.floor((c-l*.15)/5e5)*5e5;else{const s=(n+c)/2;u=Math.floor((s-5e5)/5e5)*5e5,o=u+1e6}const k=o-u,r=[0,.25,.5,.75,1],p=r.map(s=>`<span>${v(o-k*s)}</span>`).join(""),B=r.map((s,_)=>`<i class="${_===0?"barchart__gl barchart__gl--base":"barchart__gl"}" style="bottom:${s*100}%"></i>`).join(""),ta=700,S=300,w=s=>ta*(s+.5)/t.length,ea=s=>(1-(s-u)/k)*S,q=t.map((s,_)=>`${Math.round(w(_))},${Math.round(ea(s.saldo))}`).join(" "),na=Math.round(w(0)),sa=Math.round(w(t.length-1)),ra=q+` ${sa},${S} ${na},${S}`,ia=t.map(s=>`
                    <div class="linechart__col">
                        <i
                            class="linechart__point"
                            style="top:${Math.max(2,Math.min(98,Math.round((1-(s.saldo-u)/k)*100)))}%"
                            title="Saldo akhir ${s.bulan}: ${i(s.saldo)}"
                            aria-label="Saldo akhir ${s.bulan}: ${i(s.saldo)}"
                        >
                        </i>
                        <span class="barchart__mon">${s.bulan}</span>
                    </div>
                `).join("");a.innerHTML=`
            <div class="linechart">
                <div class="linechart__ylabs">${p}</div>
                <div class="linechart__plot" style="height:300px">
                    ${B}
                    <svg
                        class="linechart__svg"
                        viewBox="0 0 700 300"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon
                            class="linechart__area"
                            points="${ra}"
                        ></polygon>
                        <polyline
                            class="linechart__line"
                            points="${q}"
                        ></polyline>
                    </svg>
                    <div class="linechart__cols">${ia}</div>
                </div>
            </div>
        `},U=()=>{const a=(e,t,n)=>{const c=document.getElementById(e);if(!c)return;const l=Array.isArray(t)?t:[];if(l.length===0){c.innerHTML=`
                    <tr>
                        <td colspan="${n?3:2}" class="table__empty">Belum ada data.</td>
                    </tr>`;return}c.innerHTML=l.map(o=>{const u=O(o.label||"-"),k=Number(o.total_data)||0;return`
                        <tr>
                            <td><span class="table__primary">${u}</span></td>
                            <td>${k}</td>
                            ${n?`<td>${i(o.total_nominal)}</td>`:""}
                        </tr>`}).join("")};a("rekapKategoriBody",g.kategori,!0),a("rekapKelasBody",g.kelas,!0),a("rekapStatusBody",g.status_siswa,!1)},K=(a,e)=>(Array.isArray(a)?a:[]).reduce((t,n)=>t+(Number(n[e])||0),0),V=()=>{const a=K(g.kategori,"total_data"),e=K(g.kategori,"total_nominal"),t=Array.isArray(g.kelas)?g.kelas.length:0,n=(c,l)=>{const o=document.getElementById(c);o&&(o.textContent=l)};n("rekapTotalTransaksi",new Intl.NumberFormat("id-ID").format(a)),n("rekapTotalNominal",i(e)),n("rekapJumlahKelas",new Intl.NumberFormat("id-ID").format(t))},Z=()=>{const a=document.getElementById("recentTxBody");if(!a)return;if(!$||$.length===0){a.innerHTML=`
                <tr>
                    <td colspan="6" class="table__empty">Belum ada transaksi.</td>
                </tr>`;return}const e=$.map(t=>{const n=t.arah==="pemasukan"?"+":"−",c=t.arah==="pemasukan"?"table__nominal--in":"table__nominal--out",l="table__cat--"+(t.tipe||t.arah||""),o=t.statusTipe==="ok"?"badge--ok":"badge--warn";return`
                    <tr>
                        <td>
                            <div class="table__primary">${t.id}</div>
                            <div class="table__secondary">${t.tanggal} • ${t.jam}</div>
                        </td>
                        <td>
                            <div class="table__primary">${t.ket}</div>
                            <div class="table__secondary">${t.unit}</div>
                        </td>
                        <td>
                            <span class="table__cat ${l}">${W(t.kategori)}</span>
                        </td>
                        <td>
                            <div class="table__primary">${t.tanggal}</div>
                            <div class="table__secondary">${t.jam} WIB</div>
                        </td>
                        <td>
                            <span class="table__nominal ${c}">${n}${i(t.nominal)}</span>
                        </td>
                        <td>
                            <span class="badge ${o}">${t.status}</span>
                        </td>
                    </tr>`}).join("");a.innerHTML=e},N=document.getElementById("sidebarToggle"),j=document.getElementById("sidebarBackdrop"),C=()=>{document.body.classList.remove("nav-open")};N&&N.addEventListener("click",()=>{document.body.classList.toggle("nav-open")}),j&&j.addEventListener("click",C);const h=document.getElementById("profileBtn"),y=document.getElementById("profileMenu"),A=()=>{y&&y.classList.remove("is-open"),h&&h.setAttribute("aria-expanded","false")};h&&y&&(h.addEventListener("click",a=>{a.stopPropagation();const e=y.classList.toggle("is-open");h.setAttribute("aria-expanded",e?"true":"false")}),document.addEventListener("click",a=>{!y.contains(a.target)&&a.target!==h&&A()})),document.addEventListener("keydown",a=>{a.key==="Escape"&&(C(),A())});const M=document.getElementById("tabBar"),T=document.getElementById("tabLine"),P=document.getElementById("barChart"),D=document.getElementById("lineChart"),R=document.getElementById("legendBar1"),H=document.getElementById("legendBar2"),F=document.getElementById("legendLine"),G=a=>{const e=a==="bar";[M,T].forEach(t=>{if(!t)return;const n=t===M===e;t.classList.toggle("is-active",n),t.setAttribute("aria-selected",n?"true":"false")}),P&&P.classList.toggle("is-hidden",!e),D&&D.classList.toggle("is-hidden",e),R&&R.classList.toggle("is-hidden",!e),H&&H.classList.toggle("is-hidden",!e),F&&F.classList.toggle("is-hidden",e)};M&&M.addEventListener("click",()=>G("bar")),T&&T.addEventListener("click",()=>G("line"));const aa=()=>{const a=document.getElementById("greeting");a&&(a.textContent="Selamat datang");const e=document.getElementById("topbarDate");e&&(e.textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))};X(),Y(),V(),U(),z(),Q(),Z(),aa()});
