import { Router } from "express";

import { exec } from "child_process";
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
router.get("/gestion/planta/equipoComputo/", async (req, res) => {
  try {
    const { idPlanta } = req.query;

    // Construir el objeto where para el filtrado
    // const whereClause = idPlanta ? { lineas: { some: { linea: { idPlanta: parseInt(idPlanta) } } } } : {};
    const whereClause = {
      OR: [
        { lineas: { some: { linea: { idPlanta: parseInt(idPlanta) } } } },
        { lineas: { none: {} } }, // Esto incluye equipos que no tienen líneas
      ],
    };

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
        soportes: true,
        equipoComputoImpresora: {
          include: {
            impresora: true,
          },
        }
      },
    });

    res.json(equipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los equipos" });
  }
});

/**
 * Crea un nuevo equipo de computo
 *
 * @route POST /gestion/planta/equipoComputo/
 * @param {object} req.body - Objeto con los datos del nuevo equipo de computo.
 * @returns {object} - El equipo de computo creado.
 */
router.post("/gestion/planta/equipoComputo/", async (req, res) => {
  try {
    const nuevoEquipo = await prisma.equipoComputo.create({
      data: req.body,
    });
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el equipo de computo" });
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
router.put("/gestion/planta/equipoComputo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const equipoActualizado = await prisma.equipoComputo.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(equipoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el equipo de computo" });
  }
});

/**
 * Elimina un equipo de computo.
 *
 * @route DELETE /gestion/planta/equipoComputo/:id
 * @param {number} req.params.id - ID del equipo de computo a eliminar.
 * @returns {object} - El equipo de computo eliminado.
 */
router.delete("/gestion/planta/equipoComputo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const equipoEliminado = await prisma.equipoComputo.delete({
      where: { id: parseInt(id) },
    });
    res.json(equipoEliminado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el equipo de computo" });
  }
});

// Endpoint para registrar la relación entre EquipoComputo y Software
router.post("/gestion/planta/equipoComputo/add/software", async (req, res) => {
  const { idEquipoComputo, idSoftware } = req.body;

  try {
    // Inserción de los datos en la tabla EquipoComputoSoftware
    const equipoComputoSoftware = await prisma.equipoComputoSoftware.create({
      data: {
        idEquipoComputo: Number(idEquipoComputo),
        idSoftware: Number(idSoftware),
      },
    });

    res.status(201).json(equipoComputoSoftware);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al registrar la relación." });
  }
});

router.get("/gestion/planta/software", async (req, res) => {
  try {
    const softwareList = await prisma.software.findMany({
      include: {
        equipoComputo: true, // Incluir la relación con EquipoComputoSoftware
      },
    });

    res.status(200).json(softwareList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Ocurrió un error al obtener los registros de software.",
      });
  }
});

router.post("/gestion/planta/software", async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({
        success: false,
        message: "El nombre del software es requerido.",
      });
  }

  try {
    const nuevoSoftware = await prisma.software.create({
      data: {
        nombre,
        estado: estado !== undefined ? estado : true, // Valor por defecto
      },
    });
    return res.status(201).json({ success: true, data: nuevoSoftware });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al registrar el software.",
        error: error.message,
      });
  }
});

// Endpoint para registrar un nuevo LineaEstacionEquipo
router.post(
  "/gestion/planta/equipoComputo/add/estacionUbicacion",
  async (req, res) => {
    const { idLinea, idEstacion, idEquipo } = req.body;

    try {
      // Crear un nuevo registro en la base de datos
      const nuevoRegistro = await prisma.lineaEstacionEquipo.create({
        data: {
          idLinea: Number(idLinea),
          idEstacion: Number(idEstacion),
          idEquipo: Number(idEquipo),
        },
      });

      return res.status(201).json(nuevoRegistro);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error al crear el registro",
        error: error.message,
      });
    }
  }
);

router.get("/gestion/planta/equipoComputo/estaciones", async (req, res) => {
  try {
    const estaciones = await prisma.estacion.findMany({
      include: {
        lineas: true, // Incluye las relaciones con LineaEstacionEquipo si es necesario
      },
    });

    return res.status(200).json(estaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las estaciones",
      error: error.message,
    });
  }
});

router.get("/gestion/planta/equipoComputo/lineas", async (req, res) => {
  try {
    const lineas = await prisma.linea.findMany({
      include: {
        estaciones: true, // Incluye las relaciones con LineaEstacionEquipo si es necesario
      },
    });

    return res.status(200).json(lineas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las líneas",
      error: error.message,
    });
  }
});

router.get("/gestion/planta/equipoComputo/plantas", async (req, res) => {
  try {
    const plantas = await prisma.planta.findMany();
    return res.status(200).json(plantas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener las plantas.",
      error: error.message,
    });
  }
});

// Endpoint para registrar una nueva Planta

router.post("/gestion/planta/equipoComputo/plantas", async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({
        success: false,
        message: "El nombre de la planta es requerido.",
      });
  }

  try {
    const nuevaPlanta = await prisma.planta.create({
      data: {
        nombre,
        estado: estado !== undefined ? estado : true, // Valor por defecto
      },
    });
    return res.status(201).json({ success: true, data: nuevaPlanta });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al registrar la planta.",
        error: error.message,
      });
  }
});

// Endpoint para registrar una nueva Linea
router.post("/gestion/planta/equipoComputo/lineas", async (req, res) => {
  const { nombre, idPlanta, estado } = req.body;

  if (!nombre || !idPlanta) {
    return res
      .status(400)
      .json({
        success: false,
        message: "El nombre de la línea y el ID de la planta son requeridos.",
      });
  }

  try {
    const nuevaLinea = await prisma.linea.create({
      data: {
        nombre,
        idPlanta,
        estado: estado !== undefined ? estado : true, // Valor por defecto
      },
    });
    return res.status(201).json({ success: true, data: nuevaLinea });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al registrar la línea.",
        error: error.message,
      });
  }
});

// Endpoint para registrar una nueva Estacion
router.post("/gestion/planta/equipoComputo/estaciones", async (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({
        success: false,
        message: "El nombre de la estación es requerido.",
      });
  }

  try {
    const nuevaEstacion = await prisma.estacion.create({
      data: {
        nombre,
        estado: estado !== undefined ? estado : true, // Valor por defecto
      },
    });
    return res.status(201).json({ success: true, data: nuevaEstacion });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al registrar la estación.",
        error: error.message,
      });
  }
});

router.post("/gestion/planta/equipoComputo/impresora", async (req, res) => {
  const dataBody = req.body;

  try {
    // Crear una nueva impresora en la base de datos
    const nuevaImpresora = await prisma.impresora.create({
      data: dataBody,
    });

    // Devolver la impresora creada
    return res.status(201).json(nuevaImpresora);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al registrar la impresora" });
  }
});

router.get("/gestion/planta/equipoComputo/impresora", async (req, res) => {
  try {
    const impresoraList = await prisma.impresora.findMany();

    res.status(200).json(impresoraList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Ocurrió un error al obtener los registros de impresora.",
      });
  }
});

// Endpoint para registrar la relación entre EquipoComputo y Software
router.post("/gestion/planta/equipoComputo/add/impresora", async (req, res) => {
  const { idEquipoComputo, idImpresora } = req.body;

  try {
    // Inserción de los datos en la tabla EquipoComputoSoftware
    const equipoComputoSoftware = await prisma.equipoComputoImpresora.create({
      data: {
        idEquipoComputo: Number(idEquipoComputo),
        idImpresora: Number(idImpresora),
      },
    });

    res.status(201).json(equipoComputoSoftware);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al registrar la relación." });
  }
});

router.post("/gestion/planta/equipoComputo/soporte", async (req, res) => {
  const { descripcion, solucion, responsable, estado, idEquipoComputo } =
    req.body;

  try {
    // Crear un nuevo registro de soporte en la base de datos
    const nuevoSoporte = await prisma.soporte.create({
      data: {
        descripcion,
        solucion,
        responsable,
        estado,
        idEquipoComputo: parseInt(idEquipoComputo),
      },
    });

    // Devolver el registro de soporte creado
    return res.status(201).json(nuevoSoporte);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al registrar el soporte" });
  }
});

router.get("/gestion/planta/equipoComputo/soporte/hoy", async (req, res) => {
  try {

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Buscar y actualizar soportes pendientes o en proceso con fecha anterior a la actual
    const soportesPendientes = await prisma.soporte.findMany({
      where: {
        OR: [
          { estado: 'Pendiente' },
          { estado: 'En proceso' }
        ],
        fecha: {
          lt: fechaActual, // Filtrar por fecha anterior a la actual
        },
      },
      include: {
        equipoComputo: {
          include: {
            lineas: {
              include: {
                linea: true,
                estacion: true,
              },
            },
          },
        },
      },
    });

    // Actualizar la fecha de cada soporte encontrado
    await Promise.all(soportesPendientes.map(async (soporte) => {
      await prisma.soporte.update({
        where: { id: soporte.id },
        data: { fecha: fechaActual },
      });
    }));

    // Obtener el inicio del día actual
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    // Consulta para obtener soportes con la fecha actual

    const soportesHoy = await prisma.soporte.findMany({
      where: {
        fecha: {
          gte: inicioDelDia, // Soportes desde el inicio del día
        },
      },
      include: {
        equipoComputo: {
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
            equipoComputoImpresora: {
              include: {
                impresora: true,
              },
            }
          },
        },
      },
    });

    return res.status(200).json(soportesHoy);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al obtener los soportes de hoy" });
  }
});


router.patch('/gestion/planta/equipoComputo/soporte/:id', async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = req.body;

  // Verificar que el cuerpo no esté vacío
  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar" });
  }

  try {
    const soporteActualizado = await prisma.soporte.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.json({ message: 'Soporte actualizado exitosamente', soporte: soporteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el soporte' });
  }
});


export default router;
