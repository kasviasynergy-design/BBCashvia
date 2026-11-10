document.addEventListener("DOMContentLoaded",()=>{const S={ringkasan:"/data/dashboard",chart:"/data/dashboard/chart",recent:"/data/dashboard/recent"};let s={totalPemasukan:0,totalPengeluaran:0,totalIuran:0,totalSiswa:0,siswaLunas:0,siswaBelumLunas:0,totalTransaksi:0,transaksiHariIni:0},p=[],f=[],I=[];const m=t=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0),M=t=>t>=1e6?"Rp"+(t/1e6).toFixed(t%1e6===0?0:1).replace(".",",")+" jt":t>=1e3?"Rp"+(t/1e3).toFixed(t%1e3===0?0:1).replace(".",",")+" rb":m(t),ot=()=>s.totalPemasukan-s.totalPengeluaran,C=async t=>{let a;try{a=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let n={};try{n=await a.json()}catch{}if(!a.ok)throw new Error(n?.message||"Gagal mengambil data dari server.");return n},k=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),A=document.getElementById("statSaldo"),N=document.getElementById("statPemasukan"),j=document.getElementById("statIuran"),R=document.getElementById("statIuranMeta"),W=document.getElementById("statBelumLunas"),_=document.getElementById("statTransaksi"),q=document.getElementById("statHariIni"),F=document.getElementById("kasPemasukan"),V=document.getElementById("kasPengeluaran"),X=document.getElementById("kasSaldoSaatIni"),Y=document.getElementById("iuranPercent"),G=document.getElementById("iuranLunas"),K=document.getElementById("iuranTotal"),O=document.getElementById("iuranProgress"),J=document.getElementById("iuranLunasDetail"),U=document.getElementById("iuranBelumLunasDetail"),it=()=>{const t=ot();A&&(A.textContent=m(t)),N&&(N.textContent=m(s.totalPemasukan)),j&&(j.textContent=m(s.totalIuran)),R&&(R.textContent=`${s.siswaLunas} dari ${s.totalSiswa} siswa lunas`),W&&(W.textContent=s.siswaBelumLunas),_&&(_.textContent=s.totalTransaksi),q&&(q.textContent=s.transaksiHariIni),F&&(F.textContent=m(s.totalPemasukan)),V&&(V.textContent=m(s.totalPengeluaran)),X&&(X.textContent=m(t));const a=s.totalSiswa>0?Math.round(s.siswaLunas/s.totalSiswa*100):0;Y&&(Y.textContent=`${a}%`),G&&(G.textContent=s.siswaLunas),K&&(K.textContent=s.totalSiswa),O&&(O.style.width=`${a}%`),J&&(J.textContent=s.siswaLunas),U&&(U.textContent=s.siswaBelumLunas)};function ct(t){return String(t||"-").split(" ").slice(0,2).map(a=>a.charAt(0)).join("").toUpperCase()}const T=document.getElementById("transactionTableBody"),lt=()=>{if(T){if(!I.length){T.innerHTML=`
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px; color:#64748b;">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;return}T.innerHTML=I.map(t=>`
                        <tr>

                            <td>
                                <span class="mono-text">
                                    ${k(t.bukti)}
                                </span>
                            </td>

                            <td>
                                <div class="table-person">
                                    <div class="table-avatar">
                                        ${ct(t.siswa)}
                                    </div>

                                    <span>
                                        ${k(t.siswa)}
                                    </span>
                                </div>
                            </td>

                            <td>
                                ${k(t.iuran)}
                            </td>

                            <td>
                                <strong class="nominal">
                                    ${m(t.nominal)}
                                </strong>
                            </td>

                            <td>
                                <span class="method-text">
                                    ${k(t.metode)}
                                </span>
                            </td>

                            <td>
                                ${k(t.tanggal)}
                            </td>

                            <td>
                                <span class="status-pill success">
                                    <span class="status-dot"></span>
                                    ${k(t.status)}
                                </span>
                            </td>

                        </tr>
                    `).join("")}},z=document.getElementById("currentDate");if(z){const t=new Date;z.textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(t)}const L=document.getElementById("barChart");function Q(){if(!L)return;if(!p.length){L.innerHTML='<p class="chart-empty">Belum ada data grafik.</p>';return}const t=Math.max(1,...p.flatMap(i=>[i.masuk,i.keluar])),a=240,n=620,e=52,d=20,y=20,H=42,x=n-e-d,u=a-y-H,v=x/p.length,b=18;let c=`

            <svg
                viewBox="0 0 ${n} ${a}"
                class="chart-svg"
                preserveAspectRatio="none"
            >

        `;for(let i=0;i<=4;i++){const r=y+u/4*i,o=t-t/4*i;c+=`

                <line
                    x1="${e}"
                    y1="${r}"
                    x2="${n-d}"
                    y2="${r}"
                    class="chart-grid-line"
                />

                <text
                    x="${e-10}"
                    y="${r+4}"
                    text-anchor="end"
                    class="chart-axis-label"
                >
                    ${M(o)}
                </text>

            `}p.forEach((i,r)=>{const o=e+v*r+v/2,g=i.masuk/t*u,P=i.keluar/t*u,kt=y+u-g,yt=y+u-P;c+=`

                <rect
                    x="${o-b-2}"
                    y="${kt}"
                    width="${b}"
                    height="${g}"
                    rx="5"
                    class="bar-income"
                />

                <rect
                    x="${o+2}"
                    y="${yt}"
                    width="${b}"
                    height="${P}"
                    rx="5"
                    class="bar-expense"
                />

                <text
                    x="${o}"
                    y="${a-16}"
                    text-anchor="middle"
                    class="chart-axis-label"
                >
                    ${i.bulan}
                </text>

            `}),c+="</svg>",L.innerHTML=c}const w=document.getElementById("lineChart");function Z(){if(!w)return;if(!f.length){w.innerHTML='<p class="chart-empty">Belum ada data saldo.</p>';return}const t=240,a=620,n=52,e=20,d=20,y=42,H=a-n-e,x=t-d-y,u=Math.max(1,...f),v=f.length>1?f.length-1:1,b=f.map((r,o)=>{const g=n+H/v*o,P=d+x-r/u*x;return{x:g,y:P,value:r}});let c=`

            <svg
                viewBox="0 0 ${a} ${t}"
                class="chart-svg"
                preserveAspectRatio="none"
            >

        `;for(let r=0;r<=4;r++){const o=d+x/4*r,g=u-u/4*r;c+=`

                <line
                    x1="${n}"
                    y1="${o}"
                    x2="${a-e}"
                    y2="${o}"
                    class="chart-grid-line"
                />

                <text
                    x="${n-10}"
                    y="${o+4}"
                    text-anchor="end"
                    class="chart-axis-label"
                >
                    ${M(g)}
                </text>

            `}const i=b.map((r,o)=>`${o===0?"M":"L"} ${r.x} ${r.y}`).join(" ");c+=`

            <path
                d="${i}"
                class="line-path"
            />

        `,b.forEach((r,o)=>{const g=p[o]?.bulan??"";c+=`

                <circle
                    cx="${r.x}"
                    cy="${r.y}"
                    r="4"
                    class="line-point"
                />

                <text
                    x="${r.x}"
                    y="${t-16}"
                    text-anchor="middle"
                    class="chart-axis-label"
                >
                    ${g}
                </text>

            `}),c+="</svg>",w.innerHTML=c}const tt=document.querySelectorAll(".chart-tab");tt.forEach(t=>{t.addEventListener("click",()=>{tt.forEach(n=>{n.classList.remove("active")}),t.classList.add("active");const a=t.dataset.chart;a==="bar"&&(L?.classList.add("active"),w?.classList.remove("active")),a==="line"&&(w?.classList.add("active"),L?.classList.remove("active"))})});const dt=async()=>{const t=await C(S.ringkasan),a=t?.data?.kpi??{};t?.data?.ringkasan;const n=Number(a.siswa_belum_lunas)||0;s={totalPemasukan:Number(a.total_pemasukan)||0,totalPengeluaran:Number(a.total_pengeluaran)||0,totalIuran:Number(a.total_iuran)||0,totalSiswa:Number(a.jumlah_siswa)||0,siswaLunas:Math.max(0,(Number(a.jumlah_siswa)||0)-n),siswaBelumLunas:n,totalTransaksi:Number(a.total_transaksi)||0,transaksiHariIni:0}},ut=async()=>{const t=await C(S.chart);p=(Array.isArray(t?.data)?t.data:[]).map(e=>({bulan:e.bulan??"-",masuk:Number(e.masuk)||0,keluar:Number(e.keluar)||0}));let n=0;f=p.map(e=>(n+=e.masuk-e.keluar,n))},mt=async()=>{const t=await C(S.recent);I=(Array.isArray(t?.data)?t.data:[]).map(e=>{const d=String(e.arah||"").toLowerCase();return{bukti:e.id??"-",siswa:e.unit??"-",iuran:e.ket??"-",nominal:Number(e.nominal)||0,metode:d==="pemasukan"?"Masuk":d==="pengeluaran"?"Keluar":"-",tanggal:e.tanggal??"-",tanggalIso:e.tanggal_iso??null,status:e.status??"-"}});const n=(()=>{const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`})();s.transaksiHariIni=I.filter(e=>e.tanggalIso===n).length},gt=async()=>{try{await Promise.all([dt(),ut(),mt()])}catch(t){console.error(t)}it(),lt(),Q(),Z()};Q(),Z(),gt();const at=document.getElementById("menuToggle"),D=document.getElementById("sidebar"),$=document.getElementById("sidebarBackdrop");function pt(){D?.classList.add("open"),$?.classList.add("show"),document.body.classList.add("nav-open")}function B(){D?.classList.remove("open"),$?.classList.remove("show"),document.body.classList.remove("nav-open")}at&&at.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),D?.classList.contains("open")?B():pt()}),$&&$.addEventListener("click",()=>{B()});const h=document.getElementById("profileButton"),l=document.querySelector(".profile-wrapper"),et=document.getElementById("profileDropdown");function ht(){l&&(l.classList.add("open"),h&&h.setAttribute("aria-expanded","true"))}function E(){l&&(l.classList.remove("open"),h&&h.setAttribute("aria-expanded","false"))}function ft(){l&&(l.classList.contains("open")?E():ht())}h&&l&&(h.setAttribute("aria-expanded","false"),h.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),ft()})),et&&et.addEventListener("click",t=>{t.stopPropagation()}),document.addEventListener("click",t=>{l&&!l.contains(t.target)&&E()});function nt(t){t&&(t.preventDefault(),t.stopPropagation()),window.confirm("Apakah kamu yakin ingin keluar dari akun Viewer?")&&(window.location.href="/logout")}const st=document.getElementById("logoutButton");st&&st.addEventListener("click",nt);const rt=document.getElementById("dropdownLogout");rt&&rt.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),E(),nt(t)}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(B(),E())}),document.querySelectorAll(".sidebar .nav-link").forEach(t=>{t.addEventListener("click",()=>{window.innerWidth<=1024&&B()})})});
