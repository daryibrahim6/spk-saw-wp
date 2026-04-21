// --- FUNGSI ANIMASI LOADING & LOGIKA UTAMA SAW ---
function processSAW() {
    const btn = document.getElementById('btnHitung');
    if(btn.disabled) return;
    btn.disabled = true;

    const loadingUI = document.getElementById('loadingBarContainer');
    const progressBar = document.getElementById('progressBar');

    document.getElementById('resultContainer').innerHTML = '';
    loadingUI.style.display = 'block';

    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.transition = 'width 1s linear';
        progressBar.style.width = '100%';
    }, 10);

    setTimeout(() => {
        loadingUI.style.display = 'none';
        hitungSAW();
        btn.disabled = false;
    }, 1000);
}

function hitungSAW() {
    const table = document.getElementById('spkTable');
    const rows = table.rows;

    let kriteria = [], bobot = [], tipe = [], alternatif = [], nilai = [];

    for (let i = 1; i < rows[0].cells.length - 1; i++) {
        let span = rows[0].cells[i].querySelector('span[contenteditable="true"]');
        let text = span ? span.innerText.trim() : "";
        kriteria.push(text);
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

    let resultHTML = '<h2 class="hasil-heading">Hasil Perhitungan SAW</h2>';

    resultHTML += `
    <div class="step-card">
        <h3>Langkah 1 & 2: Data Alternatif, Kriteria, Bobot, Cost/Benefit</h3>
        <p>Data berhasil diekstrak dari tabel di atas.</p>
    </div>`;

    let maxMinVals = [];
    for (let c = 0; c < kriteria.length; c++) {
        let colVals = nilai.map(row => row[c]);
        if (tipe[c] === 'benefit') maxMinVals.push(Math.max(...colVals));
        else maxMinVals.push(Math.min(...colVals));
    }

    // --- PERUBAHAN LANGKAH 3 MENJADI TABEL ---
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 3: Nilai Max/Min Berdasarkan Tipe</h3>
        <table>
            <tr>
                <th>Kriteria</th>
                <th>Benefit / Cost</th>
                <th>Nilai (Max/Min)</th>
            </tr>`;

    for(let c=0; c < kriteria.length; c++){
        let jns = tipe[c] === 'benefit' ? 'Max' : 'Min';
        resultHTML += `
            <tr>
                <td>${kriteria[c]}</td>
                <td>${tipe[c]}</td>
                <td><strong style="color: var(--accent-color);">${jns} = ${formatNumber(maxMinVals[c])}</strong></td>
            </tr>`;
    }
    resultHTML += '</table></div>';
    // --- AKHIR PERUBAHAN LANGKAH 3 ---

    let normalisasi = [];
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 4: Matriks Normalisasi</h3>
        <table>
            <tr><th>Alternatif</th>`;
    kriteria.forEach(k => resultHTML += `<th>${k}</th>`);
    resultHTML += '</tr>';

    for (let r = 0; r < alternatif.length; r++) {
        let normRow = [];
        resultHTML += `<tr><td>${alternatif[r]}</td>`;
        for (let c = 0; c < kriteria.length; c++) {
            let nVal = 0;
            let maxMin = maxMinVals[c];
            let actualVal = nilai[r][c];

            if (tipe[c] === 'benefit') {
                nVal = (maxMin === 0) ? 0 : actualVal / maxMin;
            } else {
                nVal = (actualVal === 0) ? 0 : maxMin / actualVal;
            }

            nVal = parseFloat(nVal.toFixed(3));
            normRow.push(nVal);
            resultHTML += `<td>${formatNumber(nVal)}</td>`;
        }
        normalisasi.push(normRow);
        resultHTML += '</tr>';
    }
    resultHTML += '</table></div>';

    let skorAkhir = [];
    resultHTML += `
    <div class="step-card">
        <h3>Langkah 5: Perkalian Bobot dan Normalisasi (Nilai V)</h3>
        <table>
            <tr>
                <th>Alternatif</th>
                <th>Perhitungan (Normalisasi × Bobot)</th>
                <th>Total Skor</th>
            </tr>`;

    for (let r = 0; r < alternatif.length; r++) {
        let total = 0;
        let pStr = [];
        for (let c = 0; c < kriteria.length; c++) {
            let val = normalisasi[r][c] * bobot[c];
            total += val;
            pStr.push(`(${formatNumber(normalisasi[r][c])} × ${formatNumber(bobot[c])})`);
        }
        total = parseFloat(total.toFixed(3));
        skorAkhir.push({ nama: alternatif[r], skor: total });

        resultHTML += `
            <tr>
                <td>${alternatif[r]}</td>
                <td style="font-size:12px;">${pStr.join(' + ')}</td>
                <td><strong style="color: var(--accent-color);">${formatNumber(total)}</strong></td>
            </tr>`;
    }
    resultHTML += '</table></div>';

    skorAkhir.sort((a, b) => b.skor - a.skor);

    resultHTML += `
    <div class="step-card">
        <h3>Langkah 6: Perangkingan</h3>
        <table>
            <tr>
                <th>Peringkat</th>
                <th>Alternatif</th>
                <th>Total Skor</th>
            </tr>`;

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