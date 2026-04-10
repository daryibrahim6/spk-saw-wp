// --- FUNGSI UTILITIES (Angka & Validasi) ---
function formatNumber(num) {
    if (num === null || num === undefined || num === "") return "";
    let parsed = parseFloat(num);
    if (isNaN(parsed)) return num;
    return parsed.toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

function unformatNumber(str) {
    if (str === null || str === undefined || str === "") return NaN;
    str = str.toString().trim();

    if (str.includes(',')) {
        str = str.replace(/\./g, '').replace(',', '.');
    } else {
        let dots = (str.match(/\./g) || []).length;
        if (dots > 1) {
            str = str.replace(/\./g, '');
        } else if (dots === 1) {
            let parts = str.split('.');
            if (parts[1].length === 3 && parts[0] !== '0') {
                str = str.replace(/\./g, '');
            }
        }
    }
    return parseFloat(str);
}

function formatCell(cell) {
    let text = cell.innerText.trim();
    let unformatted = unformatNumber(text);
    if (!isNaN(unformatted) && text !== "") {
        cell.innerText = formatNumber(unformatted);
    }
    validateData();
}

function validateData() {
    const btn = document.getElementById('btnHitung');
    const table = document.getElementById('spkTable');

    if (!table || table.rows.length <= 3) {
        if(btn) btn.disabled = true;
        return;
    }

    let isComplete = true;
    for (let r = 1; r < table.rows.length; r++) {
        if (r === 2) continue;

        let cols = table.rows[r].cells.length;
        for (let c = 1; c < cols - 1; c++) {
            let textValue = table.rows[r].cells[c].innerText.trim();
            let numValue = unformatNumber(textValue);

            if (textValue === "" || isNaN(numValue)) {
                isComplete = false;
                break;
            }
        }
        if (!isComplete) break;
    }
    if(btn) btn.disabled = !isComplete;
}

document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('contenteditable')) validateData();
});