// --- FUNGSI ANIMASI LOADING & LOGIKA UTAMA METODE WP ---

function processWP() {
    const btn = document.getElementById('btnHitung');
    if(btn.disabled) return;
    btn.disabled = true;

    const loadingUI = document.getElementById('loadingBarContainer');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');

    document.getElementById('resultContainer').innerHTML = '';
    loadingUI.style.display = 'block';
    if(loadingText) loadingText.textContent = 'Memproses Perhitungan WP...';

    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.transition = 'width 1s linear';
        progressBar.style.width = '100%';
    }, 10);

    setTimeout(() => {
        loadingUI.style.display = 'none';
        hitungWP();
        btn.disabled = false;
    }, 1000);
}

function hitungWP() {
    const table = document.getElementById('spkTable');
    const rows = table.rows;
    let kriteria = [], bobot = [], tipe = [], alternatif = [], nilai = [];

    // Ekstraksi dari tabel HTML (sama persis dengan saw.js)
    for (let i = 1; i < rows[0].cells.length - 1; i++) {
        let span = rows[0].cells[i].querySelector('span[contenteditable="true"]');
        kriteria.push(span ? span.innerText.trim() : "");
    }
    for (let i = 1; i < rows[1].cells.length - 1; i++) {
        let bVal = unformatNumber(rows[1].cells[i].innerText.trim());
        bobot.push(isNaN(bVal) ? 0 : bVal);
        let selectEl = rows[2].cells[i].querySelector('select');
        tipe.push(selectEl ? selectEl.value : 'benefit');
    }
    for (let r = 3; r < rows.length; r++) {
        alternatif.push(rows[r].cells[0].innerText.trim());
        let rowData = [];
        for (let c = 1; c < rows[r].cells.length - 1; c++) {
            let nVal = unformatNumber(rows[r].cells[c].innerText.trim());
            rowData.push(isNaN(nVal) ? 0 : nVal);
        }
        nilai.push(rowData);
    }

    let resultHTML = '<h2 class="hasil-heading">Hasil Perhitungan WP</h2>';

    // LANGKAH 1-2: Data
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 1 & 2: Data Alternatif, Kriteria, Bobot, Tipe (Cost/Benefit)</h3>
        <p>Data berhasil diekstrak dari tabel di atas.</p>
    </div>`;

    // LANGKAH 3: Normalisasi Bobot
    let totalBobot = bobot.reduce((a, b) => a + b, 0);
    let bobotNorm = bobot.map(b => totalBobot === 0 ? 0 : b / totalBobot);

    resultHTML += `
    <div class="step-card">
        <h3>Langkah 3: Normalisasi Bobot (W)</h3>
        <p>Total Bobot Awal = <strong>${formatNumber(totalBobot)}</strong> — Formula: W<sub>j</sub> = W<sub>j</sub> / ΣW<sub>j</sub></p>
        <table>
            <tr>
                <th>Kriteria</th><th>Bobot Awal</th><th>Perhitungan</th>
                <th>Bobot Ternormalisasi (W)</th><th>Tipe Pangkat</th>
            </tr>`;

    for(let c = 0; c < kriteria.length; c++) {
        let tipePangkat = tipe[c] === 'benefit' ? 'Positif (+)' : 'Negatif (-)';
        resultHTML += `
            <tr>
                <td>${kriteria[c]}</td>
                <td>${formatNumber(bobot[c])}</td>
                <td style="font-size:13px;">${formatNumber(bobot[c])} / ${formatNumber(totalBobot)}</td>
                <td><strong style="color: var(--accent-color);">${formatNumber(bobotNorm[c])}</strong></td>
                <td>${tipePangkat}</td>
            </tr>`;
    }
    resultHTML += '</table></div>';

    // LANGKAH 4: Vektor S
    let vektorS = [];
    let totalS = 0;

    resultHTML += `
    <div class="step-card">
        <h3>Langkah 4: Menghitung Nilai Vektor S</h3>
        <p>Formula: S<sub>i</sub> = ∏ x<sub>ij</sub><sup>w<sub>j</sub></sup></p>
        <table>
            <tr><th>Alternatif</th><th>Perhitungan (Nilai ^ Pangkat)</th><th>Nilai S</th></tr>`;

    for (let r = 0; r < alternatif.length; r++) {
        let nilaiS = 1;
        let teksKalkulasi = [];
        for (let c = 0; c < kriteria.length; c++) {
            let w = tipe[c] === 'benefit' ? bobotNorm[c] : -bobotNorm[c];
            nilaiS *= Math.pow(nilai[r][c], w);
            let wStr = formatNumber(parseFloat(w.toFixed(3)));
            teksKalkulasi.push(`(${formatNumber(nilai[r][c])}<sup>${wStr}</sup>)`);
        }
        vektorS.push(nilaiS);
        totalS += nilaiS;
        resultHTML += `
            <tr>
                <td>${alternatif[r]}</td>
                <td style="font-size:13px; line-height:2;">${teksKalkulasi.join(' × ')}</td>
                <td><strong>${formatNumber(nilaiS)}</strong></td>
            </tr>`;
    }
    resultHTML += `</table>
        <p style="margin-top:15px;">Total Seluruh Nilai S (ΣS) = 
        <strong style="color: var(--danger);">${formatNumber(totalS)}</strong></p>
    </div>`;

    // LANGKAH 5: Vektor V
    let skorAkhir = [];
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 5: Menghitung Nilai Vektor V</h3>
        <p>Formula: V<sub>i</sub> = S<sub>i</sub> / ΣS<sub>i</sub></p>
        <table>
            <tr><th>Alternatif</th><th>Perhitungan (S / ΣS)</th><th>Nilai Preferensi (V)</th></tr>`;

    for (let r = 0; r < alternatif.length; r++) {
        let v = totalS === 0 ? 0 : vektorS[r] / totalS;
        skorAkhir.push({ nama: alternatif[r], skor: v });
        resultHTML += `
            <tr>
                <td><strong>${alternatif[r]}</strong></td>
                <td style="font-size:13px;">${formatNumber(vektorS[r])} / ${formatNumber(totalS)}</td>
                <td><strong>${formatNumber(v)}</strong></td>
            </tr>`;
    }
    resultHTML += '</table></div>';

    // LANGKAH 6: Perangkingan
    skorAkhir.sort((a, b) => b.skor - a.skor);
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 6: Perangkingan</h3>
        <table>
            <tr><th>Peringkat</th><th>Alternatif</th><th>Nilai Akhir (V)</th></tr>`;

    skorAkhir.forEach((item, index) => {
        resultHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.nama}</td>
                <td><strong style="color: var(--accent-color); font-size:18px;">${formatNumber(item.skor)}</strong></td>
            </tr>`;
    });
    resultHTML += '</table></div>';

    document.getElementById('resultContainer').innerHTML = resultHTML;
}
