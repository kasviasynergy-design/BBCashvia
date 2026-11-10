document.addEventListener("DOMContentLoaded",()=>{const L={ringkasan:"/bendahara/api/dashboard",chart:"/bendahara/api/dashboard/chart",recent:"/bendahara/api/dashboard/recent"};let r={totalPemasukan:0,totalPengeluaran:0,totalIuran:0,totalSiswa:0,siswaLunas:0,siswaBelumLunas:0,totalTransaksi:0,transaksiHariIni:0},g=[],p=[],f=[];const i=t=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(t)||0),u=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),B=async t=>{let a;try{a=await fetch(t,{headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},credentials:"same-origin"})}catch{throw new Error("Tidak dapat terhubung ke server.")}let e={};try{e=await a.json()}catch{}if(!a.ok)throw new Error(e?.message||"Gagal mengambil data dari server.");return e},S=t=>t>=1e6?`Rp ${(t/1e6).toFixed(1)} jt`:t>=1e3?`Rp ${(t/1e3).toFixed(0)} rb`:i(t),C=()=>r.totalPemasukan-r.totalPengeluaran,M=document.getElementById("statSaldo"),P=document.getElementById("statPemasukan"),T=document.getElementById("statIuran"),H=document.getElementById("statBelumLunas"),j=document.getElementById("statTransaksi"),D=document.getElementById("statHariIni"),N=document.getElementById("statIuranMeta"),Y=()=>{const t=C();if(M&&(M.textContent=i(t)),P&&(P.textContent=i(r.totalPemasukan)),T&&(T.textContent=i(r.totalIuran)),H&&(H.textContent=`${r.siswaBelumLunas} siswa`),j&&(j.textContent=`${r.totalTransaksi} transaksi`),D&&(D.textContent=`${r.transaksiHariIni} transaksi`),N){const a=r.totalSiswa>0?Math.round(r.siswaLunas/r.totalSiswa*100):0;N.textContent=`${a}% siswa sudah lunas`}},A=document.getElementById("rumusPemasukan"),R=document.getElementById("rumusPengeluaran"),F=document.getElementById("rumusSaldo"),Q=()=>{A&&(A.textContent=i(r.totalPemasukan)),R&&(R.textContent=i(r.totalPengeluaran)),F&&(F.textContent=i(C()))},V=document.getElementById("iuranLunas"),q=document.getElementById("iuranBelumLunas"),K=document.getElementById("iuranProgress"),O=document.getElementById("iuranProgressText"),U=()=>{const t=r.totalSiswa>0?Math.round(r.siswaLunas/r.totalSiswa*100):0;V&&(V.textContent=`${r.siswaLunas} siswa`),q&&(q.textContent=`${r.siswaBelumLunas} siswa`),K&&(K.style.width=`${t}%`),O&&(O.textContent=`${t}%`)},I=document.getElementById("transactionTable"),Z=t=>t==="Lunas"||t==="Terverifikasi"?"status status--success":t==="Menunggu"?"status status--warning":"status status--danger",tt=()=>{if(I){if(!f.length){I.innerHTML=`
                <tr>
                    <td colspan="7" style="text-align:center; padding:24px; color:#64748b;">
                        Belum ada transaksi.
                    </td>
                </tr>
            `;return}I.innerHTML=f.map(t=>`
                    <tr>

                        <td>
                            <strong class="table__code">
                                ${u(t.noBukti)}
                            </strong>
                        </td>

                        <td>
                            ${u(t.siswa)}
                        </td>

                        <td>
                            ${u(t.iuran)}
                        </td>

                        <td>
                            <strong class="table__amount">
                                ${i(t.nominal)}
                            </strong>
                        </td>

                        <td>
                            ${u(t.metode)}
                        </td>

                        <td>
                            ${u(t.tanggal)}
                        </td>

                        <td>
                            <span class="${Z(t.status)}">
                                ${u(t.status)}
                            </span>
                        </td>

                    </tr>
                `).join("")}},G=document.getElementById("currentDate");if(G){const t=new Date;G.textContent=t.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}const w=document.getElementById("barChart"),z=()=>{if(!w)return;if(!g.length){w.innerHTML='<p class="chart-empty">Belum ada data grafik.</p>';return}const t=Math.max(1,...g.flatMap(o=>[o.masuk,o.keluar])),a=Math.max(1,Math.ceil(t/1e6)*1e6),e=[a,a*.75,a*.5,a*.25,0],n=e.map(o=>o===0?"0":S(o)),l=g.map(o=>{const d=Math.max(3,o.masuk/a*100),y=Math.max(3,o.keluar/a*100);return`
                    <div class="barchart__col">

                        <div class="barchart__pair">

                            <div
                                class="barchart__bar barchart__bar--in"
                                style="height:${d}%"
                            >
                                <span class="barchart__tip">
                                    Masuk: ${i(o.masuk)}
                                </span>
                            </div>

                            <div
                                class="barchart__bar barchart__bar--out"
                                style="height:${y}%"
                            >
                                <span class="barchart__tip">
                                    Keluar: ${i(o.keluar)}
                                </span>
                            </div>

                        </div>

                        <span class="barchart__mon">
                            ${o.bulan}
                        </span>

                    </div>
                `}).join(""),k=e.map((o,d)=>`
                    <div
                        class="barchart__gl"
                        style="bottom:${d*25}%"
                    ></div>
                `).join("");w.innerHTML=`

            <div class="barchart">

                <div class="barchart__ylabs">

                    ${n.map(o=>`
                        <span>
                            ${o}
                        </span>
                    `).join("")}

                </div>


                <div class="barchart__plot">

                    ${k}

                    <div class="barchart__cols">

                        ${l}

                    </div>

                </div>

            </div>

        `};z();const x=document.getElementById("lineChart"),W=()=>{if(!x)return;if(!p.length){x.innerHTML='<p class="chart-empty">Belum ada data saldo.</p>';return}const t=620,a=210,e=35,n=20,l=20,k=32,o=t-e-n,d=a-l-k,y=p.map(s=>s.saldo),J=Math.min(...y),ot=Math.max(...y)-J||1,c=p.map((s,m)=>{const $=e+m/(p.length-1)*o,dt=l+(1-(s.saldo-J)/ot)*d;return{x:$,y:dt,value:s.saldo,bulan:s.bulan}}),it=c.map(s=>`${s.x},${s.y}`).join(" "),lt=[`${c[0].x},${a-k}`,...c.map(s=>`${s.x},${s.y}`),`${c[c.length-1].x},${a-k}`].join(" "),ct=[0,.25,.5,.75,1].map(s=>{const m=l+s*d;return`
                        <line
                            class="lc-grid"
                            x1="${e}"
                            y1="${m}"
                            x2="${t-n}"
                            y2="${m}"
                        />
                    `}).join(""),ut=c.map((s,m)=>{const $=m===c.length-1;return`
                    <circle
                        class="${$?"lc-dot lc-dot--last":"lc-dot"}"
                        cx="${s.x}"
                        cy="${s.y}"
                        r="${$?5:4}"
                    />

                    <text
                        class="lc-val"
                        x="${s.x}"
                        y="${s.y-12}"
                    >
                        ${S(s.value)}
                    </text>

                    <text
                        x="${s.x}"
                        y="${a-8}"
                        text-anchor="middle"
                        fill="#64748b"
                        font-size="9"
                        font-weight="600"
                    >
                        ${s.bulan}
                    </text>
                `}).join("");x.innerHTML=`

            <div class="linechart">

                <svg
                    viewBox="0 0 ${t} ${a}"
                    preserveAspectRatio="none"
                    aria-label="Grafik perkembangan saldo"
                >

                    ${ct}

                    <polygon
                        class="lc-area"
                        points="${lt}"
                    />

                    <polyline
                        class="lc-line"
                        points="${it}"
                    />

                    ${ut}

                </svg>

            </div>

        `};W();const at=async()=>{const t=await B(L.ringkasan),a=t?.data?.kpi??{};t?.data?.ringkasan;const e=Number(a.siswa_belum_lunas)||0;r={totalPemasukan:Number(a.total_pemasukan)||0,totalPengeluaran:Number(a.total_pengeluaran)||0,totalIuran:Number(a.total_iuran)||0,totalSiswa:Number(a.jumlah_siswa)||0,siswaLunas:Math.max(0,(Number(a.jumlah_siswa)||0)-e),siswaBelumLunas:e,totalTransaksi:Number(a.total_transaksi)||0,transaksiHariIni:0}},nt=async()=>{const t=await B(L.chart);g=(Array.isArray(t?.data)?t.data:[]).map(n=>({bulan:n.bulan??"-",masuk:Number(n.masuk)||0,keluar:Number(n.keluar)||0}));let e=0;p=g.map(n=>(e+=n.masuk-n.keluar,{bulan:n.bulan,saldo:e}))},et=async()=>{const t=await B(L.recent);f=(Array.isArray(t?.data)?t.data:[]).map(n=>{const l=String(n.arah||"").toLowerCase();return{noBukti:n.id??"-",siswa:n.unit??"-",iuran:n.ket??"-",nominal:Number(n.nominal)||0,metode:l==="pemasukan"?"Masuk":l==="pengeluaran"?"Keluar":"-",tanggal:n.tanggal??"-",tanggalIso:n.tanggal_iso??null,status:n.status??"-"}});const e=(()=>{const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`})();r.transaksiHariIni=f.filter(n=>n.tanggalIso===e).length};(async()=>{try{await Promise.all([at(),nt(),et()])}catch(t){console.error(t)}Y(),Q(),U(),tt(),z(),W()})();const X=document.querySelectorAll(".chart-tab");X.forEach(t=>{t.addEventListener("click",()=>{X.forEach(l=>{l.classList.remove("is-active")}),t.classList.add("is-active");const a=t.dataset.chart,e=document.getElementById("barChart"),n=document.getElementById("lineChart");a==="bar"&&(e?.classList.remove("is-hidden"),n?.classList.add("is-hidden")),a==="line"&&(e?.classList.add("is-hidden"),n?.classList.remove("is-hidden"))})});const v=document.getElementById("sidebarToggle"),st=document.getElementById("sidebarBackdrop"),rt=()=>{document.body.classList.add("nav-open"),v?.setAttribute("aria-expanded","true")},E=()=>{document.body.classList.remove("nav-open"),v?.setAttribute("aria-expanded","false")};v?.addEventListener("click",()=>{document.body.classList.contains("nav-open")?E():rt()}),st?.addEventListener("click",E);const h=document.getElementById("profileButton"),b=document.getElementById("profileDropdown"),_=()=>{b?.classList.remove("is-open"),h?.setAttribute("aria-expanded","false")};h?.addEventListener("click",t=>{t.stopPropagation(),b?.classList.contains("is-open")?_():(b?.classList.add("is-open"),h.setAttribute("aria-expanded","true"))}),document.addEventListener("click",t=>{!b||!h||!b.contains(t.target)&&!h.contains(t.target)&&_()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(_(),E())}),[document.getElementById("sidebarLogout"),document.getElementById("dropdownLogout")].filter(Boolean).forEach(t=>{t.addEventListener("click",()=>{window.location.href="/logout"})})});
