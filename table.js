// --- FUNGSI RENDER TABEL HTML & MANIPULASI DOM ---
function renderTable(dataArray) {
    if (!dataArray || dataArray.length === 0) return;
    dataArray = dataArray.filter(row => row.some(cell => cell !== "" && cell !== null));

    const headerLen = dataArray[0].length;
    let html = '<table id="spkTable">';

    dataArray.forEach((row, index) => {
        while(row.length < headerLen) row.push("");
        html += '<tr>';

        row.forEach((col, colIndex) => {
            if(colIndex >= headerLen) return;

            if (index === 0) {
                if(colIndex === 0) {
                    html += `<th>${col}</th>`;
                } else {
                    html += `
                    <th>
                        <div class="th-content">
                            <span contenteditable="true" onblur="validateData()">${col}</span>
                            <button class="btn-delete-icon" onclick="deleteKriteria(this)" title="Hapus Kriteria">x</button>
                        </div>
                    </th>`;
                }
            } else if (index === 1) {
                if(colIndex === 0) html += `<td><strong>${col}</strong></td>`;
                else html += `<td contenteditable="true" onblur="formatCell(this)">${formatNumber(col)}</td>`;
            } else if (index === 2) {
                if(colIndex === 0) html += `<td><strong>${col}</strong></td>`;
                else {
                    let isCost = String(col).toLowerCase().trim() === 'cost';
                    html += `
                    <td>
                        <select onchange="validateData()">
                            <option value="benefit" ${!isCost ? 'selected' : ''}>benefit</option>
                            <option value="cost" ${isCost ? 'selected' : ''}>cost</option>
                        </select>
                    </td>`;
                }
            } else {
                if(colIndex === 0) html += `<td contenteditable="true" onblur="validateData()">${col}</td>`;
                else html += `<td contenteditable="true" onblur="formatCell(this)">${formatNumber(col)}</td>`;
            }
        });

        if (index === 0) {
            html += '<th>Aksi</th>';
        } else if (index === 1 || index === 2) {
            html += '<td>-</td>';
        } else {
            html += `
            <td>
                <button class="btn-delete-icon" onclick="deleteRow(this)" title="Hapus Alternatif" style="margin:auto;">x</button>
            </td>`;
        }
        html += '</tr>';
    });

    html += '</table>';
    document.getElementById('dataTableContainer').innerHTML = html;
    document.getElementById('resultContainer').innerHTML = '';
    document.getElementById('dynamicTools').style.display = 'flex';

    validateData();
}

function deleteKriteria(btn) {
    if (!confirm("Apakah Anda yakin ingin menghapus kriteria ini?")) return;
    const th = btn.closest('th');
    const colIndex = th.cellIndex;
    const table = document.getElementById('spkTable');
    for(let i = 0; i < table.rows.length; i++) {
        table.rows[i].deleteCell(colIndex);
    }
    validateData();
}

function deleteRow(btn) {
    if (!confirm("Apakah Anda yakin ingin menghapus alternatif ini?")) return;
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    validateData();
}

function tambahKriteria() {
    const table = document.getElementById('spkTable');
    if(!table) return;
    const rows = table.rows;
    for(let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let targetIndex = row.cells.length - 1;

        if(i === 0) {
            let th = document.createElement('th');
            th.innerHTML = `
                <div class="th-content">
                    <span contenteditable="true" onblur="validateData()">Baru</span>
                    <button class="btn-delete-icon" onclick="deleteKriteria(this)" title="Hapus Kriteria">x</button>
                </div>`;
            row.insertBefore(th, row.cells[targetIndex]);
        } else if(i === 1) {
            let td = document.createElement('td');
            td.contentEditable = "true"; td.innerText = "0";
            td.setAttribute('onblur', 'formatCell(this)');
            row.insertBefore(td, row.cells[targetIndex]);
        } else if(i === 2) {
            let td = document.createElement('td');
            td.innerHTML = `<select onchange="validateData()">
                            <option value="benefit">benefit</option><option value="cost">cost</option></select>`;
            row.insertBefore(td, row.cells[targetIndex]);
        } else {
            let td = document.createElement('td');
            td.contentEditable = "true"; td.innerText = "0";
            td.setAttribute('onblur', 'formatCell(this)');
            row.insertBefore(td, row.cells[targetIndex]);
        }
    }
    validateData();
}

function tambahAlternatif() {
    const table = document.getElementById('spkTable');
    if(!table) return;

    const rowCount = table.rows.length;
    const colCount = table.rows[0].cells.length;
    const newRow = table.insertRow(rowCount);

    for(let i = 0; i < colCount; i++) {
        let cell = newRow.insertCell(i);
        if(i === 0) {
            cell.contentEditable = "true";
            cell.innerText = "Alternatif Baru";
            cell.setAttribute('onblur', 'validateData()');
        } else if (i === colCount - 1) {
            cell.innerHTML =
                '<button class="btn-delete-icon" onclick="deleteRow(this)" title="Hapus Alternatif" style="margin:auto;">x</button>';
        } else {
            cell.contentEditable = "true";
            cell.innerText = "0";
            cell.setAttribute('onblur', 'formatCell(this)');
        }
    }
    validateData();
}

// --- PENAMBAHAN KONFIRMASI PADA RESET DATA ---
function resetData() {
    // Mencegah reset jika user menekan 'Cancel'
    if (!confirm("Apakah Anda yakin ingin mereset semua data? Semua data pada tabel dan hasil perhitungan akan hilang.")) {
        return;
    }

    document.getElementById('dataTableContainer').innerHTML =
        '<p class="placeholder-text">Silakan upload template Excel (.xlsx) atau download template terlebih dahulu.</p>';
    document.getElementById('resultContainer').innerHTML = '';
    document.getElementById('fileUpload').value = '';
    document.getElementById('dynamicTools').style.display = 'none';
    document.getElementById('btnHitung').disabled = true;
}