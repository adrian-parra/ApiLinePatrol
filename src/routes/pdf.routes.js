import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import express from 'express';
import zlib from 'zlib';
import { promisify } from 'util';

const router = Router();
const prisma = new PrismaClient();
const gzipAsync = promisify(zlib.gzip);

router.use(express.raw({ type: 'application/gzip', limit: '10mb' }));

router.post('/uploadPdf', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send('No se recibió ningún archivo.');
    }

    try {
      const newPdfDocument = await prisma.pdfDocument.create({
        data: {
          filename: 'documento.pdf', // Nombre por defecto
          content: req.body, // Usar directamente el buffer comprimido
          mimeType: 'application/gzip', // Mantener como gzip
          fileSize: req.body.length // Tamaño del archivo comprimido
        }
      });

      res.status(200).json({
        message: 'PDF comprimido subido exitosamente',
        documentId: newPdfDocument.id,
        compressedSize: req.body.length
      });
    } catch (dbError) {
      console.error('Error al guardar en la base de datos:', dbError);
      res.status(500).send('Error al guardar el archivo');
    }
  } catch (error) {
    console.error('Error en la subida:', error);
    res.status(500).send('Error en la subida del archivo');
  }

  // Convertir bytes a Base64
//const base64Content = req.body.toString('base64');

// Convertir Base64 de vuelta a bytes
//const originalBytes = Buffer.from(base64Content, 'base64');
});

export default router;