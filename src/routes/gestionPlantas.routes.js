import { Router } from "express";

import { exec } from "child_process"
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


/**
 * Obtiene la lista de equipos de cómputo, incluyendo relaciones con líneas, estaciones, software y plantas.
 * Permite filtrar por planta utilizando el parámetro de consulta `idPlanta`.
 * 
 * @route GET /gestion/planta/equipoComputo/
 * @param {string} req.query.idPlanta - ID de la planta por la que se desea filtrar.
 * @returns {object[]} - Lista de equipos de cómputo.
 */
router.get('/gestion/planta/equipoComputo/', async (req, res) => {
  try {
    const { idPlanta } = req.query;


    // Construir el objeto where para el filtrado
    const whereClause = idPlanta ? { lineas: { some: { linea: { idPlanta: parseInt(idPlanta) } } } } : {};

    const equipos = await prisma.equipoComputo.findMany({
      where: whereClause, // Aplicar el filtro por planta si se proporciona idPlanta
      include: {
        lineas: {
          include: {
            linea: {
              include: {
                planta: true,
              },
            },
            estacion: true,
          },
        },
        equiposComputoSoftware: {
          include: {
            software: true,
          },
        },
      },
    });

    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los equipos' });
  }
});

/**
 * Crea un nuevo equipo de computo
 * 
 * @route POST /gestion/planta/equipoComputo/
 * @param {object} req.body - Objeto con los datos del nuevo equipo de computo.
 * @returns {object} - El equipo de computo creado.
 */
router.post('/gestion/planta/equipoComputo/', async (req, res) => {
  try {
    const nuevoEquipo = await prisma.equipoComputo.create({
      data: req.body,
    });
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el equipo de computo' });
  }
});

/**
 * Actualiza un equipo de computo existente.
 * 
 * @route PUT /gestion/planta/equipoComputo/:id
 * @param {number} req.params.id - ID del equipo de computo a actualizar.
 * @param {object} req.body - Objeto con los datos actualizados del equipo de computo.
 * @returns {object} - El equipo de computo actualizado.
 */
router.put('/gestion/planta/equipoComputo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipoActualizado = await prisma.equipoComputo.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(equipoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el equipo de computo' });
  }
});

/**
 * Elimina un equipo de computo.
 * 
 * @route DELETE /gestion/planta/equipoComputo/:id
 * @param {number} req.params.id - ID del equipo de computo a eliminar.
 * @returns {object} - El equipo de computo eliminado.
 */
router.delete('/gestion/planta/equipoComputo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipoEliminado = await prisma.equipoComputo.delete({
      where: { id: parseInt(id) },
    });
    res.json(equipoEliminado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el equipo de computo' });
  }
});


export default router;