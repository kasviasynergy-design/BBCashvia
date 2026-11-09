const fs = require('fs');
let content = fs.readFileSync('D:\\bbcashvias\\resources\\js\\bendahara-transaksi.js', 'utf8');

// Now let's modify the tambahBarisTransaksi function
// We need to add the sisa tagihan update logic and the nominal input event listener

// First, let's find the tambahBarisTransaksi function and modify it
// The function starts around line 2899

// Let's find it
const lines = content.split('\n');
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const tambahBarisTransaksi = () =>')) {
        startIdx = i;
    }
    if (startIdx >= 0 && lines[i].includes('    };')) {
        // This is likely the end, but let's be more careful
        // Check if this is the right }}; (closing the function)
        if (lines[i-1] && lines[i-1].trim() === '') {
            endIdx = i;
            break;
        }
    }
}

if (startIdx >= 0 && endIdx >= 0) {
    console.log('Found function at', startIdx, 'to', endIdx);
    
    // Now let's modify the function
    // We need to:
    // 1. Add sisa tagihan field to the baris HTML
    // 2. Modify the event listeners
    // 3. Add the sisa tagihan update logic
    
    // Actually, let's take a different approach - let's just add the sisa tagihan update
    // after the existing nominal input listener
    
    // Find the nominal input listener and add sisa tagihan update after it
    const nominalListenerStart = -1;
    for (let i = startIdx; i < endIdx; i++) {
        if (lines[i].includes('nominal?.addEventListener') || lines[i].includes('.addEventListener("input"')) {
            nominalListenerStart = i;
            break;
        }
    }
    
    if (nominalListenerStart >= 0) {
        // Insert sisa tagihan update code after the nominal listener
        const sisaCode = `        // Update sisa tagihan ketika nominal berubah
        const sisaEl = baris.querySelector(".baris-sisa-tagihan");
        if (sisaEl) {
            sisaEl.dataset.tagihanAwal = tagihanAwal;
            sisaEl.value = new Intl.NumberFormat("id-ID").format(tagihanAwal);
        }
        
        const nominalInput = baris.querySelector(".baris-nominal");
        const sisaEl2 = baris.querySelector(".baris-sisa-tagihan");
        if (nominalInput && sisaEl2) {
            nominalInput.addEventListener("input", (e) => {
                const nominalBayar = parseAngka(nominalInput.value);
                const sisaBaru = Math.max(tagihanAwal - nominalBayar, 0);
                sisaEl2.value = new Intl.NumberFormat("id-ID").format(sisaBaru);
                hitungUangLiveBaris(baris);
            });
        }`;
        
        // Insert after the nominal listener
        const before = lines.slice(nominalListenerStart, endIdx);
        const after = lines.slice(nominalListenerStart + 1, endIdx);
        
        // This is getting complicated. Let's try a simpler approach.
        // Let's just replace the entire function with a modified version.
        
        console.log("Will take alternative approach");
    }
} else {
    console.log("Could not find function boundaries");
}