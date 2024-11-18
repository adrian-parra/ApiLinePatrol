import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();


const prisma = new PrismaClient();

// Endpoint para listar archivos
router.get('/files', async (req, res) => {
    console.log("entrooooooo")
    const files = await prisma.file.findMany();
    res.json(files);
  });
  
  // Endpoint para registrar un archivo
  router.post('/files', async (req, res) => {
    const { fileName, filePath } = req.body;
    if (!fileName || !filePath) {
      return res.status(400).send('Faltan datos');
    }
  
    const newFile = await prisma.file.create({
      data: { fileName, filePath },
    });
  
    res.json(newFile);
  });


export default router;