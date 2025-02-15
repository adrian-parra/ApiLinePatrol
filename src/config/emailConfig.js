import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER, // Tu correo corporativo
      pass: process.env.EMAIL_PASS  // Contraseña o token de aplicación
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
};