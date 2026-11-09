const fs = require('fs');
let content = fs.readFileSync('D:\\bbcashvias\\resources\\js\\bendahara-transaksi.js', 'utf8');

// The actual pattern: line 1242 is "    };" followed by 2 blank lines, then the comment on line 1245
// We want to insert after line 1242 (the }); line)

const insertion = `    /* =====================================================
       LIVE MONEY PER BARIS (BANYAK TRANSAKSI)
     ===================================================== */

    const hitungUangLiveBaris = (barisElement) => {

        const nominalInput =
            barisElement.querySelector(".baris-nominal");

        const sisaEl =
            barisElement.querySelector(".baris-sisa-tagihan");

        if (!nominalInput || !sisaEl) return;

        const nominalBayar = parseAngka(nominalInput.value);
        const tagihanAwal = parseAngka(sisaEl.dataset.tagihanAwal || "0");
        const sisaBaru = Math.max(tagihanAwal - nominalBayar, 0);
        const kembalian = Math.max(nominalBayar - tagihanAwal, 0);

        sisaEl.value = new Intl.NumberFormat("id-ID").format(sisaBaru);

        // Set tagihan awal jika belum diset (dari iuran pertama kali dipilih)
        if (!sisaEl.dataset.tagihanAwal) {
            sisaEl.dataset.tagihanAwal = tagihanAwal;
        }

        return {
            sisa: sisaBaru,
            kembalian
        };

    };
`;

// Insert after the first occurrence of "    };" that's followed by blank lines and the SESUAIKAN comment
// Let's find the position right after line 1242
const lines = content.split('\n');

// Find line 1242 (0-indexed: 1241)
let insertAfterIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '};' && i > 1240 && i < 1245) {
        insertAfterIndex = i;
        break;
    }
}

if (insertAfterIndex >= 0) {
    // Insert after this line
    newContent = lines.slice(0, insertAfterIndex + 1).join('\n') + '\n' + insertion + '\n' + lines.slice(insertAfterIndex + 1).join('\n');
    fs.writeFileSync('D:\\bbcashvias\\resources\\js\\bendahara-transaksi.js', newContent, 'utf8');
    console.log("Successfully inserted hitungUangLiveBaris function after line " + (insertAfterIndex + 1));
} else {
    console.log("Could not find insertion point");
    // Try alternative: find the SESUAIKAN comment and insert before it
    const sel = lines.findIndex(l => l.includes('SESUAIKAN JENIS FORM'));
    console.log('SESUAIKAN found at index:', sel, 'line:', sel >= 0 ? lines[sel] : 'N/A');
}