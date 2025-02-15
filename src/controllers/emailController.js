import { createTransporter } from '../config/emailConfig.js';

export const sendEmail = async (req, res) => {
  try {
    const { 
      to, 
      cc,  // Nuevo campo para destinatarios en copia
      subject, 
      text, 
      html 
    } = req.body;

    const transporter = createTransporter();

    // Función para limpiar y validar correos
    const parseEmails = (emailString) => {
      if (!emailString) return [];
      return emailString.split(',').map(email => email.trim()).filter(email => email);
    };

    const mailOptions = {
      from: process.env.EMAIL_USER, // Tu correo corporativo
      to: parseEmails(to), // Convertir cadena de correos a array
      cc: parseEmails(cc),  // Añadir destinatarios en copia
      subject: subject || 'Notificación de Sistema',
      text: text,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      message: 'Correo enviado exitosamente',
      messageId: result.messageId,
      recipients: {
        to: mailOptions.to,
        cc: mailOptions.cc
      }
    });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({
      message: 'Error al enviar el correo',
      error: error.message
    });
  }
};