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

router.put('/files', async (req, res) => {
    const { filePath } = req.body;
    console.log(filePath)
    if (!filePath) {
      return res.status(400).send('Faltan datos');
    }
  
    try {

      // Verificar si el archivo existe y si está protegido
      const file = await prisma.file.findUnique({
        where: { filePath },
    });

    if (!file) {
      return res.status(404).send('El archivo no fue encontrado');
  }

  if (file.isProtected) {
      return res.status(403).send('Este archivo está protegido y no se puede eliminar');
  }

      const fileDeleted = await prisma.file.delete({
        where: { filePath },
      });
      res.json(fileDeleted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
  
})


export default router;