
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(join(__dirname, 'dist')));

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pablo.sistemas@normalitec.com.mx',
    pass: 'S1sP4bl*>?'
  }
});

// Ruta para enviar correo
app.post('/api/send-email', async (req, res) => {
  try {
    const { 
      nombre, 
      edad, 
      sexo, 
      resultadosA, 
      resultadosB, 
      puntajeA, 
      puntajeB 
    } = req.body;
    
    // Fecha actual
    const fecha = new Date().toLocaleDateString();
    
    // Contenido HTML del correo
    const htmlContent = `
      <h2>Resultados del Test Psicométrico</h2>
      <h3>Datos del Usuario:</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Edad:</strong> ${edad}</p>
      <p><strong>Sexo:</strong> ${sexo}</p>
      
      <h3>Resultados Primera Parte:</h3>
      <p><strong>Perfil A:</strong> ${resultadosA} pts</p>
      <p><strong>Perfil B:</strong> ${resultadosB} pts</p>
      
      <h3>Resultados Segunda Parte:</h3>
      <p><strong>Puntaje A:</strong> ${puntajeA} pts</p>
      <p><strong>Puntaje B:</strong> ${puntajeB} pts</p>
      
      <p><em>Fecha de la evaluación: ${fecha}</em></p>
    `;
    
    // Configuración del correo
    const mailOptions = {
      from: 'pablo.sistemas@normalitec.com.mx',
      to: 'pablo.sistemas@normalitec.com.mx',
      subject: `Resultados Test Psicométrico - ${nombre}`,
      html: htmlContent
    };
    
    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

// Manejar rutas no encontradas para SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en ejecución en http://0.0.0.0:${PORT}`);
});
