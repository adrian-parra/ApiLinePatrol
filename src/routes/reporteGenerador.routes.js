import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { formatDistanceToNow,format } from 'date-fns';
import { es } from 'date-fns/locale';

const router = Router();
const prisma = new PrismaClient();

router.post('/reporteGenerador', async (req, res) => {

    const {
      idPlanta,
      responsable,
      path_imagen_horas_trabajadas,
      path_imagen_status_bateria,
      path_imagen_nivel_anticongelante,
      path_imagen_nivel_diesel,
      path_imagen_nivel_aceite,
      comentario
    } = req.body;
  
    try {
      // Crear un nuevo reporte de generador
      const nuevoReporte = await prisma.reporteGenerador.create({
        data: {
          idPlanta: Number(idPlanta),
          responsable,
          path_imagen_horas_trabajadas,
          path_imagen_status_bateria,
          path_imagen_nivel_anticongelante,
          path_imagen_nivel_diesel,
          path_imagen_nivel_aceite,
          comentario,
        },
      });
  
      // Responder con el reporte creado
      res.status(201).json(nuevoReporte);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el reporte' });
    }
  });


// Endpoint GET para obtener todos los registros de reporteGenerador
router.get('/reporteGenerador', async (req, res) => {
  try {
    // Obtener todos los reportes
    const reportes = await prisma.reporteGenerador.findMany({
      include: {
        planta: true, // Incluir la relación con la planta
      },
    });

    // Formatear el campo created_at a "hace X minutos"
    const reportesFormateados = reportes.map((reporte) => ({
      id: reporte.id,
      idPlanta: reporte.idPlanta,
      responsable: reporte.responsable,
      path_imagen_horas_trabajadas: reporte.path_imagen_horas_trabajadas,
      path_imagen_status_bateria: reporte.path_imagen_status_bateria,
      path_imagen_nivel_anticongelante: reporte.path_imagen_nivel_anticongelante,
      path_imagen_nivel_diesel: reporte.path_imagen_nivel_diesel,
      path_imagen_nivel_aceite: reporte.path_imagen_nivel_aceite,
      comentario: reporte.comentario,
      estado: reporte.estado,
      created_at: format(new Date(reporte.created_at), 'dd/MM/yyyy'),
      created_at_format_relative: formatDistanceToNow(new Date(reporte.created_at), { addSuffix: true, locale: es }), // Formato relativo en español
      updated_at: reporte.updated_at,
      planta: reporte.planta, // Información de la planta
    }));

    // Devolver los reportes formateados
    res.json(reportesFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
});


export default router;