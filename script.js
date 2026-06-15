/* =============================
PLACEHOLDER
=============================*/
const placeholder = {
gauss: `2 4 -2 2
4 9 -3 8
-2 -3 7 10`,

gaussSeidel: `4 -1 1 7
4 -8 1 -21
-2 1 5 15`,

bisection:`Contoh:
fungsi: x^3-4*x-9
a: 2
b: 3
iterasi: 10`,

secant:`Contoh:
fungsi: x^3-4*x-9
x0: 2
x1: 3
iterasi: 10`,

newton:`Contoh:
x: 1 2 3
y: 2 3 5`,

trapesium:`Contoh:
fungsi: x^2
a: 0
b: 4
n: 4`,

runge:`Contoh:
fungsi: x+y
x0: 0
y0: 1
h: 0.1
iterasi: 5`
}


/* =============================
UBAH PLACEHOLDER
=============================*/
function ubahPlaceholder(){
const metode = document.getElementById("metode").value
// sembunyikan semua blok, tampilkan hanya yang sesuai
document.querySelectorAll('.method-block').forEach(b=>b.style.display='none')
const block = document.getElementById('block-'+metode)
if(block) block.style.display = 'block'

// tampilkan helper singkat sesuai metode
const helpMap = {
	gauss: 'Masukkan matriks augmented: tiap baris newline, tiap kolom spasi. Contoh ada di sebelah.',
	gaussSeidel: 'Masukkan matriks augmented seperti Gauss (baris newline, kolom spasi).',
	bisection: 'Isi fungsi, interval a dan b, serta jumlah iterasi.',
	secant: 'Isi fungsi, titik awal x0 & x1, serta iterasi.',
	newton: 'Masukkan daftar x dan y berpasangan, pisah dengan spasi.',
	trapesium: 'Isi fungsi, batas a dan b, dan jumlah subinterval n.',
	runge: 'Isi f(x,y), x0, y0, langkah h, dan jumlah iterasi.'
}
document.getElementById("helper").innerText = helpMap[metode] || 'Gunakan format seperti contoh di atas'
}

ubahPlaceholder()

/* =============================
MATRIX GRID UI: create, fill example, transfer
=============================*/
function populateSizeSelectors(){
    const gaussSel = document.getElementById('gauss-size')
    const gsSel = document.getElementById('gs-size')

    if(!gaussSel || !gsSel) return

    // 🔥 PENTING: reset dulu biar tidak double
    gaussSel.innerHTML = ''
    gsSel.innerHTML = ''

    for(let i=2;i<=10;i++){
        let opt1 = document.createElement('option')
        opt1.value = i
        opt1.text = `${i} Variabel`
        gaussSel.appendChild(opt1)

        let opt2 = document.createElement('option')
        opt2.value = i
        opt2.text = `${i} Variabel`
        gsSel.appendChild(opt2)
    }

    gaussSel.value = 3
    gsSel.value = 3
}

let matrixCreated = false;

function createMatrixGrid(method){
    matrixCreated = true;
    const isGauss = method === 'gauss'
    const size = parseInt(document.getElementById(isGauss? 'gauss-size' : 'gs-size').value)
    const container = document.getElementById(isGauss? 'gauss-grid-container' : 'gs-grid-container')
    container.innerHTML = ''

    const table = document.createElement('table')
    table.className = 'matrix-grid'
    const caption = document.createElement('caption')
caption.innerText = `Sistem Persamaan Linear (${size} Variabel)`
    table.appendChild(caption)
    const info = document.createElement('div')

info.className = 'matrix-info'

info.innerHTML = `
Jumlah Variabel : <b>${size}</b><br>
Ukuran Matriks Augmented : <b>${size} × ${size}</b>
`

container.appendChild(info)

    for(let i=0;i<size;i++){
        const tr = document.createElement('tr')
        for(let j=0;j<=size;j++){
            const td = document.createElement('td')
            const inp = document.createElement('input')
            inp.type = 'text'
            inp.className = `${method}-cell`
            inp.dataset.row = i
            inp.dataset.col = j
            inp.placeholder = (j===size)? 'b' : `a${i+1}${j+1}`
            td.appendChild(inp)
            tr.appendChild(td)
            if(j===size-1){
                const sep = document.createElement('td')
                sep.innerText = '|'
                sep.className = 'sep'
                tr.appendChild(sep)
            }
        }
        table.appendChild(tr)
    }

    container.appendChild(table)
}

function clearAllInputs(){
matrixCreated = false;
    document.querySelectorAll("input").forEach(el=>{
        if(el.type !== "button" &&
           el.type !== "submit"){
            el.value = "";
        }
    });

    document.querySelectorAll("textarea")
        .forEach(el=>el.value="");

    // reset dropdown metode
    document.getElementById("metode").value = "gauss";

    // reset ukuran matriks
    document.getElementById("gauss-size").value = "3";
    document.getElementById("gs-size").value = "3";

    // HAPUS GRID MATRKS
    document.getElementById("gauss-grid-container").innerHTML = "";
    document.getElementById("gs-grid-container").innerHTML = "";

    // reset helper
    ubahPlaceholder();

    // reset output
    document.getElementById("output").innerHTML =
        "Hasil akan muncul disini...";

    // reset loading
    document.getElementById("loading").style.display = "none";

    // hapus history
    document.getElementById("history-list").innerHTML = `
        <div id="history-empty" class="history-empty">
            <i class="ti ti-history-off"></i>
            <p>Riwayat perhitungan belum tersedia</p>
            <small>Lakukan perhitungan terlebih dahulu</small>
        </div>
    `;

    cekHistoryKosong();
}

function copyResult(){

    const text = document.getElementById("output").innerText;

    if(!text || text.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk di-copy");
        return;
    }

    const now = new Date();

    const tanggal = now.toLocaleDateString("id-ID");
    const waktu = now.toLocaleTimeString("id-ID");

    const footer = `
──────────────────────────
KALKULATOR METODE NUMERIK
           Kelompok 1 R4U
© ${now.getFullYear()} All Rights Reserved
Generated on ${tanggal} • ${waktu} WIB
──────────────────────────
`;

    const finalText = text + footer;

    navigator.clipboard.writeText(finalText)
        .then(() => alert("Hasil berhasil di-copy (format profesional)"))
        .catch(() => alert("Gagal copy"));
}
function exportPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const hasil =
        document.getElementById("output").innerText;

    if(!hasil || hasil.includes("Hasil akan muncul")){
        alert("Tidak ada hasil untuk diexport");
        return;
    }

    // =========================
    // IDENTITAS LAPORAN
    // =========================
    const metode =
        document.getElementById("metode")
        .options[
            document.getElementById("metode").selectedIndex
        ].text;

    const now = new Date();

    const tanggal =
        now.toLocaleDateString("id-ID");

    const waktu =
        now.toLocaleTimeString("id-ID");

    // =========================
    // SETUP HALAMAN
    // =========================
    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    let y = 20;

    // =========================
    // HEADER
    // =========================
    doc.setFont("helvetica","bold");
    doc.setFontSize(18);

    doc.text(
        "KALKULATOR METODE NUMERIK",
        pageWidth/2,
        y,
        {align:"center"}
    );

    y += 8;

    doc.setFontSize(15);

    doc.text(
        "Kelompok 1 R4U",
        pageWidth/2,
        y,
        {align:"center"}
    );

    y += 12;

    doc.line(20,y,pageWidth-20,y);

    y += 10;

    // =========================
    // INFORMASI
    // =========================
    doc.setFont("helvetica","normal");
    doc.setFontSize(11);

    doc.text(`Metode : ${metode}`,20,y);
    y += 7;

    doc.text(`Tanggal : ${tanggal}`,20,y);
    y += 7;

    doc.text(`Waktu : ${waktu}`,20,y);
    y += 12;

    // =========================
    // HASIL
    // =========================
    doc.setFont("helvetica","bold");
    doc.text("HASIL PERHITUNGAN",20,y);

    y += 7;

    doc.line(20,y,pageWidth-20,y);

    y += 10;

    doc.setFont("courier","normal");
    doc.setFontSize(10);

    const lines =
        doc.splitTextToSize(
            hasil,
            pageWidth - 40
        );

    lines.forEach(line=>{

        if(y > pageHeight - 20){

            addFooter(doc);

            doc.addPage();

            y = 20;
        }

        doc.text(line,20,y);

        y += 6;
    });

    // =========================
    // FOOTER HALAMAN TERAKHIR
    // =========================
    addFooter(doc);

    doc.save(
        `hasil-${metode
            .toLowerCase()
            .replace(/\s+/g,'-')}.pdf`
    );
}

/* =========================
FOOTER PDF
========================= */
function addFooter(doc){

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const pageNumber =
        doc.internal.getNumberOfPages();

    doc.setFontSize(9);

    doc.setFont("helvetica","italic");

    doc.text(
        "Generated by Kalkulator Numerik Kelompok 1 R4U",
        pageWidth/2,
        pageHeight-10,
        {align:"center"}
    );

    doc.text(
        `Halaman ${pageNumber}`,
        pageWidth-20,
        pageHeight-10,
        {align:"right"}
    );
}

function addHistory(text, metode){

    const container = document.getElementById("history-list");
    const emptyState = document.getElementById("history-empty");

    if(emptyState){
        emptyState.style.display = "none";
    }

    const item = document.createElement("div");
    item.className = "history-item";

    const info = document.createElement("div");
    info.className = "history-info";

    const methodEl = document.createElement("div");
    methodEl.className = "history-method";

    const methodNameMap = {
        gauss:"Eliminasi Gauss",
        gaussSeidel:"Gauss-Seidel",
        bisection:"Metode Bagi Dua",
        secant:"Metode Secant",
        newton:"Interpolasi Newton",
        trapesium:"Integrasi Trapesium",
        runge:"Runge Kutta Orde 4"
    };

    methodEl.textContent =
        methodNameMap[metode] || metode;

    const dateEl = document.createElement("div");
    dateEl.className = "history-date";

    const now = new Date();

    dateEl.textContent =
        now.toLocaleDateString("id-ID") +
        " • " +
        now.toLocaleTimeString("id-ID");

    const previewEl = document.createElement("div");
    previewEl.className = "history-preview";

    previewEl.textContent =
        text.split("\n")[0].substring(0,60);

    info.appendChild(methodEl);
    info.appendChild(dateEl);
    info.appendChild(previewEl);

    info.onclick = () => {
        document.getElementById("output").innerText = text;
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "history-delete";
    deleteBtn.innerHTML =
        '<i class="ti ti-trash"></i>';

    deleteBtn.onclick = (e)=>{
        e.stopPropagation();
        item.remove();
        cekHistoryKosong();
    };

    item.appendChild(info);
    item.appendChild(deleteBtn);

    container.prepend(item);

    while(
        container.querySelectorAll(".history-item").length > 10
    ){
        container.lastElementChild.remove();
    }
}

function cekHistoryKosong(){

    const historyItems =
        document.querySelectorAll(".history-item");

    const emptyState =
        document.getElementById("history-empty");

    if(historyItems.length === 0){
        emptyState.style.display = "block";
    }else{
        emptyState.style.display = "none";
    }
}

function toggleHistory() {
  const historyBox = document.getElementById("history-list");
  if (historyBox.style.display === "none" || historyBox.style.display === "") {
    historyBox.style.display = "block";
  } else {
    historyBox.style.display = "none";
  }
}

function buildMatrixDataFromGrid(method){

    const cells =
        Array.from(
            document.querySelectorAll(`.${method}-cell`)
        )

    if(cells.length === 0){
        return ''
    }

    const rows =
        Math.max(...cells.map(c=>parseInt(c.dataset.row))) + 1

    const cols =
        Math.max(...cells.map(c=>parseInt(c.dataset.col))) + 1

    let lines = []
    let hasInput = false

    for(let i=0;i<rows;i++){

        let vals = []

        for(let j=0;j<cols;j++){

            const el = cells.find(
                c =>
                parseInt(c.dataset.row)===i &&
                parseInt(c.dataset.col)===j
            )

            let v = '0'

            if(el && el.value.trim()){

                v = el.value.trim()

                hasInput = true
            }

            vals.push(v)
        }

        lines.push(vals.join(' '))
    }

    if(!hasInput){
        return ''
    }

    return lines.join('\n')
}

function fillExample(type, exampleText, sizeId, cellClass) {
    const rows = exampleText.trim().split('\n');

    // Paksa ukuran matriks 3x3
    document.getElementById(sizeId).value = 3;

    // Generate grid
    createMatrixGrid(type);

    // Ambil semua cell
    const cells = document.querySelectorAll(`.${cellClass}`);

    rows.forEach((row, r) => {
        const values = row.trim().split(/\s+/);

        values.forEach((value, c) => {
            const cell = [...cells].find(
                el =>
                    Number(el.dataset.row) === r &&
                    Number(el.dataset.col) === c
            );

            if (cell) cell.value = value;
        });
    });
}

function fillGaussExample() {
    fillExample(
        'gauss',
        placeholder.gauss,
        'gauss-size',
        'gauss-cell'
    );
}

function fillGaussSeidelExample() {
    fillExample(
        'gaussSeidel',
        placeholder.gaussSeidel,
        'gs-size',
        'gaussSeidel-cell'
    );
}

function closeGuide(){
    document.getElementById("tutorialGuide").style.display = "none";
}

// Initialize selectors on DOM ready
document.addEventListener('DOMContentLoaded', function(){
    populateSizeSelectors()
})

/* =============================
UTILITAS UI
=============================*/
function tampilError(pesan){
document.getElementById("output").innerHTML = "❌ ERROR:\n" + pesan
}

function tampilLoading(status){
document.getElementById("loading").style.display =
status ? "block" : "none"
}

/* =============================
FUNGSI HITUNG (UTAMA)
=============================*/
function hitung(){
const metode = document.getElementById("metode").value
let data = ''

// build data string sesuai format yang sudah dipakai fungsi-fungsi
try{
	switch(metode){
case 'gauss':

if(document.querySelectorAll('.gauss-cell').length === 0){
    throw 'Silakan buat variabel matriks terlebih dahulu';
}

data = buildMatrixDataFromGrid('gauss');

if(!data){
    throw 'Silakan isi matriks terlebih dahulu';
}

break

case 'gaussSeidel':

if(document.querySelectorAll('.gaussSeidel-cell').length === 0){
    throw 'Silakan buat variabel matriks terlebih dahulu';
}

data = buildMatrixDataFromGrid('gaussSeidel');

if(!data){
    throw 'Silakan isi seluruh elemen matriks terlebih dahulu';
}

break

		case 'bisection':{
			const f = document.getElementById('bisection-f').value.trim()
			const a = document.getElementById('bisection-a').value.trim()
			const b = document.getElementById('bisection-b').value.trim()
			const it = document.getElementById('bisection-iter').value
			if(!f||!a||!b) throw 'Lengkapi fungsi dan interval (a,b) untuk Bisection'
			data = `fungsi: ${f}\na: ${a}\nb: ${b}\niterasi: ${it}`
			break
		}

		case 'secant':{
			const f = document.getElementById('secant-f').value.trim()
			const x0 = document.getElementById('secant-x0').value.trim()
			const x1 = document.getElementById('secant-x1').value.trim()
			const it = document.getElementById('secant-iter').value
			if(!f||!x0||!x1) throw 'Lengkapi fungsi dan x0/x1 untuk Secant'
			data = `fungsi: ${f}\nx0: ${x0}\nx1: ${x1}\niterasi: ${it}`
			break
		}

		case 'newton':{
			const xs = document.getElementById('newton-x').value.trim()
			const ys = document.getElementById('newton-y').value.trim()
			if(!xs||!ys) throw 'Masukkan daftar x dan y untuk Interpolasi Newton'
			data = `x: ${xs}\ny: ${ys}`
			break
		}

		case 'trapesium':{
			const f = document.getElementById('trapesium-f').value.trim()
			const a = document.getElementById('trapesium-a').value.trim()
			const b = document.getElementById('trapesium-b').value.trim()
			const n = document.getElementById('trapesium-n').value
			if(!f||!a||!b) throw 'Lengkapi fungsi dan batas a/b untuk Trapesium'
			data = `fungsi: ${f}\na: ${a}\nb: ${b}\nn: ${n}`
			break
		}

		case 'runge':{
			const f = document.getElementById('runge-f').value.trim()
			const x0 = document.getElementById('runge-x0').value.trim()
			const y0 = document.getElementById('runge-y0').value.trim()
			const h = document.getElementById('runge-h').value.trim()
			const it = document.getElementById('runge-iter').value
			if(!f||!x0||!y0||!h) throw 'Lengkapi f, x0, y0, dan h untuk Runge Kutta'
			data = `fungsi: ${f}\nx0: ${x0}\ny0: ${y0}\nh: ${h}\niterasi: ${it}`
			break
		}

		default:
			throw 'Metode belum tersedia'
	}
}catch(err){
	tampilError(err)
	return
}

// tampilkan teks menghitung
tampilLoading(true)
document.getElementById("output").innerHTML = ""

setTimeout(()=>{
    const container = document.getElementById("history-list");
	try{
		switch(metode){
case "gauss":
    let raw = parseMatrix(data)
    let result = gaussSolve(raw)

    const hasil = "<pre>" + formatGaussResult(result) + "</pre>"

    // tampilkan ke output
    const outputEl = document.getElementById("output")
    outputEl.innerHTML = hasil

    // simpan ke history (PAKAI TEXT BUKAN HTML)
            break
 case "bisection":
            metodeBisection(data)
            break

        case "secant":
            metodeSecant(data)
            break

        case "trapesium":
            metodeTrapesium(data)
            break

        case "runge":
            rungeKutta(data)
            break

        case "gaussSeidel":
            metodeGaussSeidel(data)
            break

        case "newton":
            interpolasiNewton(data)
            break
    }

    const hasilText =
        document.getElementById("output").innerText;

    if(
        hasilText &&
        !hasilText.includes("ERROR")
    ){
        addHistory(hasilText, metode);
    }

}catch(e){
    tampilError("Format input salah: " + e)
}

	// sembunyikan loading setelah hasil keluar
	tampilLoading(false)

},600)
}

function parseMatrix(input){
    let rows = input.split("\n").map(r => r.trim()).filter(r => r.length)

    let matrix = rows.map(r=>{
        let vals = r.split(/\s+/).map(v=>{
let num;

try {
    num = math.evaluate(v);
} catch (e) {
    throw "Input bukan angka valid: " + v;
}

if (!isFinite(num)) {
    throw "Nilai tidak valid (Infinity/NaN): " + v;
}
            return num
        })
        return vals
    })

    let cols = matrix[0].length

    if(!matrix.every(r => r.length === cols)){
        throw "Jumlah kolom tiap baris harus sama"
    }

    if(cols !== matrix.length + 1){
        throw "Harus matriks augmented (n x n+1)"
    }

    if(matrix.length > 10){
        throw "Maksimal ukuran matriks adalah 10x10"
    }

    return matrix
}

function formatNumber(v){
    // hilangkan noise kecil (floating error)
    if(Math.abs(v) < 1e-10) return "0"

    // kalau bilangan bulat → tampilkan tanpa desimal
    if(Number.isInteger(v)) return v.toString()

    // kalau desimal → batasi tapi tidak dipaksa
    return parseFloat(v.toFixed(6)).toString()
}

function formatMatrix(mat){

    let html = `<table class="matrix-output">`

    mat.forEach(row=>{
        html += `<tr>`

        row.forEach((val,i)=>{
            if(i === row.length - 1){
                html += `<td class="b">${formatNumber(val)}</td>`
            }else{
                html += `<td>${formatNumber(val)}</td>`
            }
        })

        html += `</tr>`
    })

    html += `</table>`

    return html
}

function formatGaussResult(res){

    let out = `<div class="gauss-report">`
    out += `<h3>PENYELESAIAN ELIMINASI GAUSS</h3>`

    res.steps.forEach((s,i)=>{
        out += `<div class="step">`
        out += `<b>Langkah ${i+1}:</b> ${s.desc}`
        out += formatMatrix(s.matrix)
        out += `</div>`
    })

    out += `<h3>HASIL</h3>`

    if(res.type === "no-solution"){
        out += `<p>❌ Sistem tidak memiliki solusi</p>`
        return out + `</div>`
    }

    if(res.type === "infinite"){
        out += `<p>♾️ Sistem memiliki banyak solusi</p>`
    }

    if(res.type === "unique"){
        out += `<p>✅ Sistem memiliki solusi unik</p>`
    }

    res.solution.forEach((v,i)=>{
        out += `<p>x${i+1} = ${formatNumber(v)}</p>`
    })

    out += `</div>`

    return out
}

function safeEval(expr, scope = {}) {
    try {
        return math.evaluate(expr, scope);
    } catch (e) {
        throw "Ekspresi tidak valid: " + expr;
    }
}

function gaussSolve(matrixInput, epsilon = 1e-10){

    let M = matrixInput.map(r => [...r])
    let n = M.length
    let steps = []

    function cloneMatrix(mat){
        return mat.map(r => [...r])
    }

    function log(desc){
        steps.push({
            desc,
            matrix: cloneMatrix(M)
        })
    }

    function isZeroRow(row){
        return row.every(v => Math.abs(v) < epsilon)
    }

    function getRank(mat){
        let rank = 0
        for(let i=0;i<mat.length;i++){
            if(!isZeroRow(mat[i])) rank++
        }
        return rank
    }

    log("Matriks awal")

    // =============================
    // FORWARD ELIMINATION (Gaya Buku)
    // =============================
    for(let k=0;k<n;k++){

        // =============================
        // 1. PILIH PIVOT (Partial Pivoting)
        // =============================
        let maxRow = k
        for(let i=k+1;i<n;i++){
            if(Math.abs(M[i][k]) > Math.abs(M[maxRow][k])){
                maxRow = i
            }
        }

        // jika semua nol → lanjut (nanti ditangani di rank)
        if(Math.abs(M[maxRow][k]) < epsilon){
            log(`Kolom ${k+1} tidak memiliki pivot (semua nol)`)
            continue
        }

        // =============================
        // 2. TUKAR BARIS
        // =============================
        if(maxRow !== k){
            [M[k], M[maxRow]] = [M[maxRow], M[k]]
            log(`Tukar baris B${k+1} dengan B${maxRow+1}`)
        }

        // =============================
        // 3. NORMALISASI PIVOT (BIAR = 1)
        // =============================
        let pivot = M[k][k]
        for(let j=k;j<=n;j++){
            M[k][j] /= pivot
        }
        log(`Normalisasi baris B${k+1} (pivot jadi 1)`)

        // =============================
        // 4. ELIMINASI KE BAWAH
        // =============================
        for(let i=k+1;i<n;i++){
            let factor = M[i][k]

            if(Math.abs(factor) < epsilon) continue

            for(let j=k;j<=n;j++){
                M[i][j] -= factor * M[k][j]
            }

            log(`B${i+1} = B${i+1} - (${factor.toFixed(4)}) × B${k+1}`)
        }
    }

    // =============================
    // CEK JENIS SOLUSI (RANK)
    // =============================
    let A = M.map(r => r.slice(0,n))
    let rankA = getRank(A)
    let rankAug = getRank(M)

    if(rankA !== rankAug){
        return {
            steps,
            type: "no-solution",
            solution: []
        }
    }

    if(rankA < n){
        return {
            steps,
            type: "infinite",
            solution: []
        }
    }

    // =============================
    // BACK SUBSTITUTION (Gaya Buku)
    // =============================
    let x = new Array(n).fill(0)

    for(let i=n-1;i>=0;i--){
        let sum = M[i][n]

        for(let j=i+1;j<n;j++){
            sum -= M[i][j] * x[j]
        }

        if(Math.abs(M[i][i]) < epsilon){
            throw "Pivot nol saat back substitution"
        }

        x[i] = sum / M[i][i]

        log(`x${i+1} = ${x[i].toFixed(6)}`)
    }

    return {
        steps,
        type: "unique",
        solution: x.map(v => +v.toFixed(6))
    }
}

// =============================
// METODE GAUSS-SEIDEL
// =============================    
function metodeGaussSeidel(data){

    // =====================================
    // PARSING INPUT
    // =====================================
    let lines = data
        .split("\n")
        .map(r => r.trim())
        .filter(r => r.length)

    let A = lines.map(r =>
        r.split(/\s+/).map(v => safeEval(v))
    )

    let n = A.length

    // =====================================
    // VALIDASI AUGMENTED MATRIX
    // =====================================
    for(let i=0;i<n;i++){

        if(A[i].length !== n+1){

            throw "Format matriks harus augmented (n x n+1)"
        }
    }

    // =====================================
    // AUTO ROW SWAP
    // =====================================
    for(let i=0;i<n;i++){

        if(Math.abs(A[i][i]) < 1e-12){

            let found = false

            for(let k=i+1;k<n;k++){

                if(Math.abs(A[k][i]) > 1e-12){

                    [A[i],A[k]] = [A[k],A[i]]

                    found = true
                    break
                }
            }

            if(!found){

                throw `Kolom ${i+1} tidak memiliki pivot valid`
            }
        }
    }

    // =====================================
    // VALIDASI DIAGONAL
    // =====================================
    for(let i=0;i<n;i++){

        if(Math.abs(A[i][i]) < 1e-12){

            throw `Elemen diagonal a${i+1}${i+1} = 0`
        }
    }

    // =====================================
    // CEK DOMINAN DIAGONAL
    // =====================================
    let dominant = true

    for(let i=0;i<n;i++){

        let sum = 0

        for(let j=0;j<n;j++){

            if(i !== j){

                sum += Math.abs(A[i][j])
            }
        }

        if(Math.abs(A[i][i]) < sum){

            dominant = false
            break
        }
    }

    // =====================================
    // INITIAL GUESS
    // =====================================
    let x

    if(n === 3){

        x = [1,2,2]
    }
    else{

        x = new Array(n).fill(0)
    }

    const epsilon = 0.3
    const maxIter = 50

    // =====================================
    // OUTPUT
    // =====================================
    let output = ""
    output += "══════════════════════════\n"
    output += "      PENYELESAIAN GAUSS-SEIDEL\n"
    output += "══════════════════════════\n"

    if(dominant){

        output += "✔ Matriks dominan diagonal\n"
        output += "Konvergensi cenderung terjamin.\n\n"

    }else{

        output += "⚠ Matriks tidak dominan diagonal\n"
        output += "Konvergensi tidak dijamin.\n\n"
    }

    // =====================================
    // PERSAMAAN ITERASI
    // =====================================
    output += "1. Membentuk Persamaan Iterasi\n"

    for(let i=0;i<n;i++){

        let eq = `x${i+1} = (${A[i][n]}`

        for(let j=0;j<n;j++){

            if(i === j) continue

            if(A[i][j] >= 0){

                eq += ` - (${A[i][j]})x${j+1}`
            }
            else{

                eq += ` + (${Math.abs(A[i][j])})x${j+1}`
            }
        }

        eq += `) / ${A[i][i]}`

        output += eq + "\n"
    }

    output += "\n"

    // =====================================
    // ITERASI
    // =====================================
    let converged = false

    let prevErrorMax = Infinity
    let divergenceCount = 0

    for(let it=1; it<=maxIter; it++){

        output += "──────────────────────────\n"
        output += `ITERASI ${it}\n`
        output += "──────────────────────────\n"

        output +=
        `Solusi awal : (${x.map(v=>v.toFixed(6)).join(", ")})\n\n`

        let xOld = [...x]

        let errors = []

        for(let i=0;i<n;i++){

            let numerator = A[i][n]

            let detail = `${A[i][n]}`

            for(let j=0;j<n;j++){

                if(i === j) continue

                numerator -= A[i][j] * x[j]

                detail +=
                    ` - (${A[i][j]} × ${x[j].toFixed(6)})`
            }

            let xi = numerator / A[i][i]

            if(!isFinite(xi)){

                throw "Perhitungan menghasilkan NaN/Infinity"
            }

            // ERROR RELATIF STABIL
            let err =
                Math.abs(xi - xOld[i]) /
                Math.max(1, Math.abs(xi))

            errors.push(err)

            x[i] = xi

            output +=
            `x${i+1} = (${detail}) / ${A[i][i]}\n`

            output +=
            `   = ${xi.toFixed(6)} | E${i+1} = ${err.toFixed(6)}\n`
        }

        let errorMax = Math.max(...errors)

        output +=
        `Error maksimum = ${errorMax.toFixed(6)}\n\n`

        // =====================================
        // KONVERGENSI
        // =====================================
        if(errorMax < epsilon){

            output +=
            `✔ Error maksimum < ${epsilon}\n`

            output +=
            "Metode konvergen.\n\n"

            converged = true

            break
        }

        // =====================================
        // CEK DIVERGENSI BERTAHAP
        // =====================================
        if(errorMax > prevErrorMax){

            divergenceCount++

        }else{

            divergenceCount = 0
        }

        prevErrorMax = errorMax

        if(divergenceCount >= 5){

            output +=
            "❌ Metode terdeteksi divergen\n\n"

            break
        }

        output +=
        "Masih ada error > ε\n"

        output +=
        "Lanjut ke iterasi berikutnya.\n\n"
    }

    // =====================================
    // HASIL AKHIR
    // =====================================
    output +=
    "══════════════════════════\n"

    output +=
    "HASIL AKHIR\n"

    output +=
    "══════════════════════════\n"

    if(converged){

        x.forEach((v,i)=>{

            output +=
            `x${i+1} = ${v.toFixed(6)}\n`
        })
    }
    else{

        output +=
        "Metode berhenti tanpa memenuhi syarat konvergensi.\n"
    }

    document.getElementById("output").innerHTML =
        "<pre>" + output + "</pre>"
}

/* =============================
BISECTION
=============================*/
function metodeBisection(data){

let lines = data.split("\n")

let f = lines[0].split(":")[1].trim()
let a = parseFloat(lines[1].split(":")[1])
let b = parseFloat(lines[2].split(":")[1])
let iter = parseInt(lines[3].split(":")[1])

function fx(x){
    let val = safeEval(f,{x})
    if(!isFinite(val)) throw "Fungsi tidak valid di x=" + x
    return val
}

// VALIDASI AWAL
let fa = fx(a)
let fb = fx(b)

if(fa * fb > 0){
    throw "Interval tidak valid: f(a) dan f(b) harus beda tanda"
}

let output = "=== METODE BISECTION (INDUSTRI VERSION) ===\n\n"

let c = 0

for(let i=1;i<=iter;i++){

    c = (a + b) / 2
    let fc = fx(c)

    output += `Iterasi ${i}\n`
    output += `a=${a} b=${b} c=${c}\n`
    output += `f(a)=${fa} f(b)=${fb} f(c)=${fc}\n`

    if(Math.abs(fc) < 1e-8){
        output += "✔ AKAR DITEMUKAN (exact)\n"
        break
    }

    if(fa * fc < 0){
        b = c
        fb = fc
    } else {
        a = c
        fa = fc
    }

    output += "\n"
}

output += `=== HASIL AKHIR ===\nAkar ≈ ${c}\n`

document.getElementById("output").innerHTML = output
}

/* =============================
SECANT
=============================*/

/* =============================
TRAPESIUM
=============================*/

/* =============================
RUNGE KUTTA
=============================*/

/* =============================
SPLASH SCREEN
=============================*/
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},3000)

// =============================
// FIX GLOBAL SCOPE
// =============================
window.hitung = hitung
window.gaussSolve = gaussSolve
window.metodeBisection = metodeBisection
window.metodeSecant = metodeSecant
window.metodeTrapesium = metodeTrapesium
window.rungeKutta = rungeKutta
window.metodeGaussSeidel = metodeGaussSeidel
window.interpolasiNewton = interpolasiNewton

// =============================
// PASTIKAN DOM READY
// =============================
document.addEventListener("DOMContentLoaded", function(){

    populateSizeSelectors()

    createMatrixGrid('gauss')

    ubahPlaceholder()

})
function toggleTutorial(){
    const modal = document.getElementById("tutorialModal")
    modal.classList.toggle("active")
}