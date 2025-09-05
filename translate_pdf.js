const fs = require('fs');
const pdf = require('pdf-parse');
const translate = require('@vitalets/google-translate-api');

async function translatePdf(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  const text = data.text.trim();
  if (!text) {
    throw new Error('PDF contains no extractable text');
  }
  const res = await translate(text, { to: 'ko' });
  return res.text;
}

if (require.main === module) {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: node translate_pdf.js <pdf-file>');
    process.exit(1);
  }
  translatePdf(pdfPath)
    .then((korean) => console.log(korean))
    .catch((err) => {
      console.error('Failed to translate PDF:', err.message);
      process.exit(1);
    });
}

module.exports = translatePdf;
