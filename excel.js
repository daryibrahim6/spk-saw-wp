// --- FUNGSI EXCEL (Upload & Download) ---
function checkXLSX() {
    if (typeof XLSX === 'undefined') {
        alert('Library Excel belum dimuat. Pastikan Anda terkoneksi internet.');
        return false;
    }
    return true;
}

function downloadTemplate() {
    if(!checkXLSX()) return;
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_SPK");
    XLSX.writeFile(wb, "template_spk_saw.xlsx");
}

function uploadTemplate(event) {
    if(!checkXLSX()) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonArr = XLSX.utils.sheet_to_json(worksheet, {header: 1, defval: ""});
            renderTable(jsonArr);
            document.getElementById('fileUpload').value = '';
        } catch (error) {
            alert('Gagal membaca file Excel.');
        }
    };
    reader.readAsArrayBuffer(file);
}