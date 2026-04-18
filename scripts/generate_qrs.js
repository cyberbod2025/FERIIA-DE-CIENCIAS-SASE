import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const stations = [
  {"id":"c5d879d4-c9c0-4a99-a690-a3cc9d2d6d2e","nombre":"Magia de los Números A","materia":"Matemáticas","grupo":"1A","docente_responsable":"Marisol"},
  {"id":"fc2766cd-30b6-49c8-b8ae-6df8cbe011ae","nombre":"Magia de los Números B","materia":"Matemáticas","grupo":"1B","docente_responsable":"Marisol"},
  {"id":"a4e9a34a-ade8-479d-8b59-d6b20fcc168b","nombre":"Magia de los Números C","materia":"Matemáticas","grupo":"1C","docente_responsable":"Marisol"},
  {"id":"22e69c4a-0d72-4048-8c02-8ed1480433d5","nombre":"Desafío Hugo D","materia":"Matemáticas","grupo":"1D","docente_responsable":"Hugo"},
  {"id":"3d569085-c77a-4ce0-ac69-ac4a15696f51","nombre":"Desafío Hugo 2A","materia":"Matemáticas","grupo":"2A","docente_responsable":"Hugo"},
  {"id":"a63d7b83-e7db-4acb-870e-9b3cd40c7a11","nombre":"Desafío Hugo 2B","materia":"Matemáticas","grupo":"2B","docente_responsable":"Hugo"},
  {"id":"9c502966-3c57-4f26-aac0-b73968e3ae95","nombre":"Desafío Hugo 2C","materia":"Matemáticas","grupo":"2C","docente_responsable":"Hugo"},
  {"id":"5a146471-6c89-4b4f-a3de-02b3b1639050","nombre":"Desafío Hugo 2D","materia":"Matemáticas","grupo":"2D","docente_responsable":"Hugo"},
  {"id":"3a52581c-f7c5-4338-bdd3-a15def7bde0a","nombre":"El Gran Acertijo 3A","materia":"Matemáticas","grupo":"3A","docente_responsable":"Juan"},
  {"id":"f2c60c56-30e5-4fda-8843-5fe5cb9aed21","nombre":"Cápsula de Hans 3B","materia":"Matemáticas","grupo":"3B","docente_responsable":"Hans"},
  {"id":"88f56007-c73e-4dbd-954f-50cf779e83f1","nombre":"Cápsula de Hans 3C","materia":"Matemáticas","grupo":"3C","docente_responsable":"Hans"},
  {"id":"f51b1556-d281-4a2b-b967-abd9ccfef74a","nombre":"Cápsula de Hans 3D","materia":"Matemáticas","grupo":"3D","docente_responsable":"Hans"},
  {"id":"320d2029-b0f4-4ab8-b3e5-5ebdb4e9e056","nombre":"Exploración Global 1A","materia":"Geografía","grupo":"1A","docente_responsable":"Jairo"},
  {"id":"b4e59b65-652c-4ae2-885f-8d256e273bc8","nombre":"Exploración Global 1B","materia":"Geografía","grupo":"1B","docente_responsable":"Jairo"},
  {"id":"b1e3b503-3026-40ba-9d54-118b0b96f989","nombre":"Exploración Global 1C","materia":"Geografía","grupo":"1C","docente_responsable":"Jairo"},
  {"id":"2b9f2142-a74e-4d75-a3f0-75a3641ad226","nombre":"Exploración Global 1D","materia":"Geografía","grupo":"1D","docente_responsable":"Jairo"},
  {"id":"120a2306-802e-4fc5-b1b3-8f06cf72e1fd","nombre":"Mundo Microscópico 1A","materia":"Biología","grupo":"1A","docente_responsable":"Brenda"},
  {"id":"25e9484c-b5a3-49f7-b560-a24c7f958c0a","nombre":"Mundo Microscópico 1B","materia":"Biología","grupo":"1B","docente_responsable":"Brenda"},
  {"id":"f823b0e4-9bc1-49b5-8504-1e6f75c8edb8","nombre":"Mundo Microscópico 1C","materia":"Biología","grupo":"1C","docente_responsable":"Brenda"},
  {"id":"4cd27bd0-454e-4060-bbe1-3d72a70dcceb","nombre":"Mundo Microscópico 1D","materia":"Biología","grupo":"1D","docente_responsable":"Brenda"},
  {"id":"976693dd-14bf-4fe3-b1a0-b6a589071ee3","nombre":"Fuerzas en Acción A","materia":"Física","grupo":"2A","docente_responsable":"Docente Física 1"},
  {"id":"5242a58d-f095-47f5-92a9-0a03d66946d1","nombre":"Fuerzas en Acción B","materia":"Física","grupo":"2B","docente_responsable":"Docente Física 2"},
  {"id":"55bbaa6b-10b2-481f-a4b6-6da58fe31de2","nombre":"Fuerzas en Acción C","materia":"Física","grupo":"2C","docente_responsable":"Docente Física 2"},
  {"id":"d65fe3ef-6733-44e7-8d88-22705fbad951","nombre":"Fuerzas en Acción D","materia":"Física","grupo":"2D","docente_responsable":"Docente Física 2"},
  {"id":"6829dec4-e780-4da4-9f33-5f08492267f6","nombre":"Reacciones Sorprendentes A","materia":"Química","grupo":"3A","docente_responsable":"Docente Química 1"},
  {"id":"338d2c7c-3f79-4d2b-8102-eae62eab1b5a","nombre":"Reacciones Sorprendentes B","materia":"Química","grupo":"3B","docente_responsable":"Docente Química 1"},
  {"id":"025947ce-2c51-47d1-a64e-9e68e0ecded6","nombre":"Reacciones Sorprendentes C","materia":"Química","grupo":"3C","docente_responsable":"Docente Química 2"},
  {"id":"ebe9d61e-f6de-453c-bd2b-6ff7847be016","nombre":"Reacciones Sorprendentes D","materia":"Química","grupo":"3D","docente_responsable":"Docente Química 2"}
];

const QR_DIR = path.resolve('public/qrs');
const BASE_URL = process.env.QR_BASE_URL || 'https://feria-de-ciencias-2026.invalid'; // Requiere URL real antes de ejecutar

if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

console.log('Generando QRs...');

const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
const pdfPath = path.resolve('public/QRs_Feria_Ciencias.pdf');
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

async function generate() {
  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const fileName = `qr_${s.materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_${s.grupo}.png`;
    const fullPath = path.join(QR_DIR, fileName);
    const url = `${BASE_URL}/stand/${s.id}`;

    // Generar QR PNG
    await QRCode.toFile(fullPath, url, {
      color: {
        dark: '#1a2f7a',  // Color institucional profundo
        light: '#ffffff'
      },
      width: 400
    });

    // Agregar al PDF
    // 2 por página para que sean grandes y legibles
    if (i > 0 && i % 2 === 0) {
      doc.addPage();
    }

    const yOffset = (i % 2 === 0) ? 50 : 400;

    doc.rect(50, yOffset, 512, 330).stroke('#1a2f7a');
    
    doc.fontSize(20).fillColor('#1a2f7a').text(s.nombre, 280, yOffset + 40, { width: 250, align: 'center' });
    doc.fontSize(14).fillColor('#666').text(`Materia: ${s.materia}`, 280, yOffset + 100, { width: 250, align: 'center' });
    doc.fontSize(14).fillColor('#666').text(`Grupo: ${s.grupo}`, 280, yOffset + 125, { width: 250, align: 'center' });
    doc.fontSize(12).fillColor('#999').text(`Responsable: ${s.docente_responsable}`, 280, yOffset + 150, { width: 250, align: 'center' });
    
    doc.image(fullPath, 70, yOffset + 30, { width: 200 });
    
    doc.fontSize(10).fillColor('#aaa').text('Escanea para registrar tu visita', 70, yOffset + 240, { width: 200, align: 'center' });
  }

  doc.end();
  console.log('Finalizado.');
}

generate().catch(console.error);

