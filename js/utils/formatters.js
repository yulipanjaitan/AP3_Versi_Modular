export function formatProperCase(str) {
  if (!str || str === '-') return '-';
  let cleanStr = str.toString().trim();
  
  let connectors = ['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'dengan', 'dalam', 'atas', 'oleh', 'sebagai', 'atau', 'serta'];
  let uppercaseWords = [
    'WIB', 'FTZ', 'PP', 'UU', 'PMK', 'NIK', 'NIB', 'NPWP', 'SIM', 'SBP', 'LP', 'LPP', 'LPF', 
    'SPLIT', 'LHP', 'BAP', 'BA', 'KPU', 'BC', 'TMP', 'B', 'C', 'DKI', 'NO', 'NO.', 'NOMOR', 
    'PBI', 'BPOM', 'BKC', 'NPPBKC', 'EA', 'MMEA', 'HT', 'BDN', 'SPSA', 'BAST', 'CN', 'PIBK'
  ];

  let words = cleanStr.split(/\s+/);
  let formattedWords = words.map((w, index) => {
    let lowerW = w.toLowerCase();
    let upperW = w.toUpperCase();

    if (/[0-9]/.test(w) && /[a-zA-Z]/.test(w)) {
      return upperW;
    }

    if (w.includes('/') || (w.includes('.') && /[a-zA-Z]/.test(w) && w.length > 4)) {
      return upperW;
    }

    if (uppercaseWords.includes(upperW) || uppercaseWords.includes(upperW.replace(/[^A-Z]/g, ''))) {
      return upperW;
    }

    if (connectors.includes(lowerW) && index > 0) {
      return lowerW;
    }

    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });

  return formattedWords.join(' ');
}

export function getVal(id) {
  let el = document.getElementById(id);
  if(!el) return '-';
  let val = String(el.value || '').trim();
  return val !== '' ? formatProperCase(val) : '-';
}

export function escText(s) {
  return String(s ?? '-').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}

export function formatModusVerb(modus) {
  if (!modus || modus === '-') return '-';
  let str = modus.trim();

  const verbMap = [
    { from: /^Pemasukan/i, to: 'memasukkan' },
    { from: /^Pengeluaran/i, to: 'mengeluarkan' },
    { from: /^Penyediaan/i, to: 'menyediakan' },
    { from: /^Penyerahan/i, to: 'menyerahkan' },
    { from: /^Pengangkutan/i, to: 'mengangkut' },
    { from: /^Pembawaan/i, to: 'membawa' },
    { from: /^Pembongkaran/i, to: 'membongkar' },
    { from: /^Penimbunan/i, to: 'menimbun' }
  ];

  for (let rule of verbMap) {
    if (rule.from.test(str)) {
      str = str.replace(rule.from, rule.to);
      break;
    }
  }

  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function terbilangHuruf(angka) {
  let bilangan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  let n = parseInt(angka, 10);
  if (isNaN(n)) return angka;
  if (n < 12) return bilangan[n];
  if (n < 20) return terbilangHuruf(n - 10) + " belas";
  if (n < 100) return terbilangHuruf(Math.floor(n / 10)) + " puluh " + terbilangHuruf(n % 10);
  if (n < 200) return "seratus " + terbilangHuruf(n - 100);
  if (n < 1000) return terbilangHuruf(Math.floor(n / 100)) + " ratus " + terbilangHuruf(n % 100);
  if (n < 2000) return "seribu " + terbilangHuruf(n - 1000);
  if (n < 1000000) return terbilangHuruf(Math.floor(n / 1000)) + " ribu " + terbilangHuruf(n % 1000);
  return n.toString();
}

export function terbilang(angka) {
  return terbilangHuruf(angka);
}

export function tanggalKeTeks(dateString) {
  if(!dateString) return '';
  let d = new Date(dateString + 'T12:00:00');
  let bulan = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
  return `${terbilang(d.getDate())} bulan ${bulan[d.getMonth()]} tahun ${terbilang(d.getFullYear())}`.replace(/\s+/g, ' ').trim();
}

export function formatJam24(el) {
  let val = el.value.replace(/[^0-9]/g, '');
  if (val.length >= 3) {
    el.value = val.slice(0, 2) + '.' + val.slice(2, 4);
  } else {
    el.value = val;
  }
}

export function validateJam24(el) {
  let val = el.value.trim().replace(':', '.');
  if (!val) return;

  let parts = val.split('.');
  if (parts.length === 2) {
    let hh = parseInt(parts[0], 10);
    let mm = parseInt(parts[1], 10);

    if (isNaN(hh) || hh < 0 || hh > 23) hh = 0;
    if (isNaN(mm) || mm < 0 || mm > 59) mm = 0;

    let padHH = String(hh).padStart(2, '0');
    let padMM = String(mm).padStart(2, '0');
    el.value = `${padHH}.${padMM}`;
  } else if (parts.length === 1 && parts[0].length >= 2) {
    let hh = parseInt(parts[0].slice(0, 2), 10);
    if (isNaN(hh) || hh < 0 || hh > 23) hh = 0;
    el.value = `${String(hh).padStart(2, '0')}.00`;
  }
}

export function formatRupiahInput(el) {
  let raw = el.value.replace(/[^0-9]/g, '');
  if (!raw) {
    el.value = '';
    return;
  }
  let formatted = parseInt(raw, 10).toLocaleString('id-ID');
  el.value = `Rp ${formatted}`;
}

export function formatRupiahFinal(el) {
  let raw = el.value.replace(/[^0-9]/g, '');
  if (!raw) {
    el.value = '';
    return;
  }
  let formatted = parseInt(raw, 10).toLocaleString('id-ID');
  el.value = `Rp ${formatted},00`;
}

export function formatDateIndo(dateStr) {
  if (!dateStr || dateStr === '-') return '-';
  let cleanStr = String(dateStr).trim();
  let bulanList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
    let [y, m, d] = cleanStr.split('-');
    let mIdx = parseInt(m, 10) - 1;
    let day = String(parseInt(d, 10)).padStart(2, '0');
    return `${day} ${bulanList[mIdx]} ${y}`;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(cleanStr)) {
    let [d, m, y] = cleanStr.split('-');
    let mIdx = parseInt(m, 10) - 1;
    let day = String(parseInt(d, 10)).padStart(2, '0');
    return `${day} ${bulanList[mIdx]} ${y}`;
  }

  return cleanStr;
}

export function formatDate(id) {
  let el = document.getElementById(id);
  let val = el ? el.value : '';
  if (!val) {
    let v = getVal(id);
    return v !== '-' ? formatDateIndo(v) : '-';
  }
  return formatDateIndo(val);
}

export function autoGenerateTeksTanggalBA(dateStr) {
  if (!dateStr) return { hari: '', teksLengkap: '' };

  const hariArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulanArr = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const angkaTeks = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas'
  ];

  function terbilang(n) {
    n = parseInt(n, 10);
    if (n < 12) return angkaTeks[n];
    if (n < 20) return terbilang(n - 10) + ' belas';
    if (n < 100) return terbilang(Math.floor(n / 10)) + ' puluh' + (n % 10 !== 0 ? ' ' + terbilang(n % 10) : '');
    if (n < 200) return 'seratus' + (n % 100 !== 0 ? ' ' + terbilang(n % 100) : '');
    if (n < 1000) return terbilang(Math.floor(n / 100)) + ' ratus' + (n % 100 !== 0 ? ' ' + terbilang(n % 100) : '');
    if (n < 2000) return 'seribu' + (n % 1000 !== 0 ? ' ' + terbilang(n % 1000) : '');
    if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' ribu' + (n % 1000 !== 0 ? ' ' + terbilang(n % 1000) : '');
    return n.toString();
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) return { hari: '', teksLengkap: '' };

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);

  const dt = new Date(y, m, d);
  const hari = hariArr[dt.getDay()];
  const namaBulan = bulanArr[m];

  // Output huruf kecil murni: "satu bulan maret tahun dua ribu dua puluh enam"
  const teksLengkap = `${terbilang(d)} bulan ${namaBulan.toLowerCase()} tahun ${terbilang(y)}`;

  return {
    hari: hari,
    teksLengkap: teksLengkap
  };
}

/**
 * Menutup sisa ruang baris teks/paragraf dengan garis strip (---)
 * Otomatis pas batas margin kanan, dinamis, dan anti-meluber.
 * 
 * @param {string} text - Teks kalimat
 * @param {string} [prefix=''] - Awalan opsional (misal: '----------')
 * @returns {string} HTML string
 */
export function formatTrailingDashes(text, prefix = '') {
  const clean = (text || '').trim();
  const pre = prefix ? `${prefix}` : '';
  const filler = '----------------------------------------------------------------------------------------------------------------------------------------------------------------';
  
  return `
    <div style="position: relative; overflow: hidden; text-align: justify; margin: 4px 0; font-family: Arial, Helvetica, sans-serif !important; font-size: 11pt !important; line-height: 1.35; color: #000 !important; white-space: normal;">
      <span>${pre}${clean}</span>
      <span aria-hidden="true" style="position: absolute; padding-left: 4px; white-space: nowrap; color: #000; font-family: inherit; font-size: inherit; font-weight: normal; letter-spacing: 0;">${filler}</span>
    </div>
  `.trim();
}

/**
 * Baris tabel identitas dengan tanda hubung strip (---)
 * Otomatis menambahkan tanda titik (.) di akhir nilai jika bukan strip tunggal.
 * 
 * @param {string} label - Nama field (contoh: 'Nama', 'Alamat', 'Jabatan')
 * @param {string} value - Nilai teks data
 * @param {string} [labelWidth='271px'] - Lebar kolom label agar titik dua rata sejajar
 * @returns {string} HTML string <tr>
 */
export function formatRowTrailingDashes(label, value, labelWidth = '271px') {
  let val = (value || '-').trim();
  
  if (val !== '-' && !val.endsWith('.')) {
    val += '.';
  }
  
  const filler = '----------------------------------------------------------------------------------------------------------------------------------------------------------------';
  
  return `
    <tr style="font-family: Arial, Helvetica, sans-serif !important; font-size: 11pt !important; color: #000 !important;">
      <td style="width: ${labelWidth}; border: none !important; padding: 1px 0; vertical-align: top;">${label}</td>
      <td style="width: 18px; border: none !important; padding: 1px 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none !important; padding: 1px 4px; vertical-align: top;">
        <div style="position: relative; overflow: hidden; white-space: nowrap; width: 100%;">
          <span>${val}</span>
          <span aria-hidden="true" style="position: absolute; padding-left: 4px; color: #000; font-family: inherit; font-size: inherit; font-weight: normal; letter-spacing: 0;">${filler}</span>
        </div>
      </td>
    </tr>
  `.trim();
}

/**
 * Baris tabel identitas dengan tanda titik-titik (...)
 * Berguna jika format dokumen tertentu meminta titik pengisi.
 */
export function formatRowTrailingDots(label, value, labelWidth = '271px') {
  let val = (value || '-').trim();
  const dotFiller = '................................................................................................................................................................';
  
  return `
    <tr style="font-family: Arial, Helvetica, sans-serif !important; font-size: 11pt !important; color: #000 !important;">
      <td style="width: ${labelWidth}; border: none !important; padding: 1px 0; vertical-align: top;">${label}</td>
      <td style="width: 18px; border: none !important; padding: 1px 0; text-align: center; vertical-align: top;">:</td>
      <td style="border: none !important; padding: 1px 4px; vertical-align: top;">
        <div style="position: relative; overflow: hidden; white-space: nowrap; width: 100%;">
          <span>${val}</span>
          <span aria-hidden="true" style="position: absolute; padding-left: 4px; color: #000; font-family: inherit; font-size: inherit; font-weight: normal; letter-spacing: 1px;">${dotFiller}</span>
        </div>
      </td>
    </tr>
  `.trim();
}