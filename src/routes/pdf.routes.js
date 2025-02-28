import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import express from 'express';

// const zlib = require('zlib');
import zlib from 'zlib';



const router = Router();
const prisma = new PrismaClient();

router.use(express.raw({ type: 'application/gzip', limit: '10mb' }));

router.post('/uploadPdf', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send('No se recibió ningún archivo.');
    }

    // Descomprimir el archivo GZip
    zlib.gunzip(req.body, async (err, buffer) => {
      if (err) {
        return res.status(500).send('Error al descomprimir el archivo');
      }

      try {
        const newPdfDocument = await prisma.pdfDocument.create({
          data: {
            filename: 'documento.pdf', // Nombre por defecto, puedes mejorarlo
            content: buffer,
            mimeType: 'application/pdf',
            fileSize: buffer.length
          }
        });

        res.status(200).json({
          message: 'PDF subido exitosamente',
          documentId: newPdfDocument.id
        });
      } catch (dbError) {
        console.error('Error al guardar en la base de datos:', dbError);
        res.status(500).send('Error al guardar el archivo');
      }
    });
  } catch (error) {
    console.error('Error en la subida:', error);
    res.status(500).send('Error en la subida del archivo');
  }
});

export default router;

