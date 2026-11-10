document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("panelTagihanPribadi");if(!e)return;const t=a=>document.getElementById(a),n=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(a)||0),c=a=>String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),o=a=>({lunas:"Lunas",sebagian:"Cicilan",belum:"Belum Lunas"})[a]||"Belum Lunas",d=a=>({lunas:"status status--success",sebagian:"status status--warning",belum:"status status--danger"})[a]||"status status--danger",h=a=>{e.hidden=!1;const s=t("tagihanPribadiIdentitas");s&&(s.textContent=`${a.nama||"Siswa"} • NIS ${a.nis||"-"} • ${a.kelas||"Tanpa kelas"}`);const r=t("tagihanPribadiStatus");r&&(r.className=d(a.status_iuran),r.textContent=o(a.status_iuran)),t("tagihanPribadiTotal")&&(t("tagihanPribadiTotal").textContent=n(a.tagihan_iuran)),t("tagihanPribadiTerbayar")&&(t("tagihanPribadiTerbayar").textContent=n(a.terbayar_iuran)),t("tagihanPribadiSisa")&&(t("tagihanPribadiSisa").textContent=n(a.sisa_iuran));const u=t("tagihanPribadiRincian"),g=t("tagihanPribadiKosong"),l=Array.isArray(a.rincian_iuran)?a.rincian_iuran:[];if(g&&(g.hidden=l.length>0),!!u){if(!l.length){u.innerHTML=`
                <tr>
                    <td colspan="5" class="table__empty">
                        Belum ada iuran aktif.
                    </td>
                </tr>
            `;return}u.innerHTML=l.map(i=>`
            <tr>
                <td>${c(i.nama_iuran)}</td>
                <td>${n(i.nominal)}</td>
                <td>${n(i.terbayar)}</td>
                <td>${n(i.sisa)}</td>
                <td>
                    <span class="${d(i.status)}">
                        ${c(o(i.status))}
                    </span>
                </td>
            </tr>
        `).join("")}};(async()=>{try{const a=await fetch("/data/tagihan-pribadi",{headers:{Accept:"application/json"},credentials:"same-origin",cache:"no-store"});if(!a.ok){e.hidden=!0;return}const s=await a.json();if(!s?.data){e.hidden=!0;return}h(s.data)}catch(a){console.error("Gagal memuat tagihan pribadi:",a),e.hidden=!0}})()});
