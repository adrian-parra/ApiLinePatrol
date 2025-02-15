import { Router } from "express";

import { exec } from "child_process";
import { PrismaClient } from "@prisma/client";

import { getLineaEstacionesEquipos } from "../services/gestionPlantasService.js";

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
  const { descripcion, solucion, responsable,requeridoPor, estado, idEquipoComputo } =
    req.body;

  try {
    // Crear un nuevo registro de soporte en la base de datos
    const nuevoSoporte = await prisma.soporte.create({
      data: {
        descripcion,
        solucion,
        responsable,
        requeridoPor,
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

function convertirAUTC(fechaLocal) {
  // Crear un objeto Date con la fecha local
  const fecha = new Date(fechaLocal);
  // Ajustar manualmente para Sinaloa (UTC-7)
  const fechaUTC = new Date(fecha.getTime() + (7 * 60 * 60 * 1000));

  return fechaUTC.toISOString();
}

router.get("/gestion/planta/equipoComputo/soporte/dia", async (req, res) => {
  let { fecha_inicio, fecha_fin, plantas } = req.query;

  try {
    // Verificar que se haya proporcionado la fecha de inicio
    if (!fecha_inicio) {
      return res.status(400).json({ error: "Debe proporcionar la fecha de inicio" });
    }

    // Verificar que se haya proporcionado la fecha de fin
    if (!fecha_fin) {
      return res.status(400).json({ error: "Debe proporcionar la fecha de fin" });
    }

    // Convertir plantas a un array de números si se proporcionan
    const plantasIds = plantas
      ? plantas.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id))
      : [];

    // Obtener la fecha de inicio y fin
    const fechaInicio = convertirAUTC(fecha_inicio);
    const fechaFin = convertirAUTC(fecha_fin);

    // Construir el objeto de filtrado
    const whereCondition = {
      fecha: {
        gte: fechaInicio, // Soportes desde el inicio del día
        lt: fechaFin, // Hasta el final del día
      },
      // Si se proporcionan plantas, filtrar por ellas
      ...(plantasIds.length > 0 && {
        equipoComputo: {
          lineas: {
            some: {
              linea: {
                planta: {
                  id: {
                    in: plantasIds
                  }
                }
              }
            }
          }
        }
      })
    };

    // Consulta para obtener soportes con la fecha actual y opcionalmente filtrados por plantas
    const soportesHoy = await prisma.soporte.findMany({
      where: whereCondition,
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

router.get('/gestion/planta/soportes/estadisticas/semana', async (req, res) => {
  try {
    const { mes } = req.query; // Formato esperado: "YYYY-MM"
    console.log(mes)
    const fechaInicio = mes
      ? `${mes}-01T00:00:00.000Z` // Primer día del mes proporcionado
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(); // Primer día del mes actual

      console.log(fechaInicio)
    const fechaFin = mes
      ? new Date(new Date(`${mes}-01`).getFullYear(), new Date(`${mes}-01`).getMonth() + 2, 0).toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z') // Último día del mes proporcionado
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().replace('T00:00:00.000Z', 'T23:59:59.999Z'); // Último día del mes actual

      console.log(fechaFin)
       // Obtener los datos filtrados por mes
       const soportes = await prisma.soporte.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
      });
  
      // Agrupar los datos por semana
      const soportesPorSemana = {};
  
      soportes.forEach(suporte => {
        const fecha = new Date(suporte.fecha);
        const año = fecha.getFullYear();
        const semana = getISOWeek(fecha); // Función para obtener el número de semana ISO
  
        const key = `${año}-${semana}`;
        if (!soportesPorSemana[key]) {
          soportesPorSemana[key] = 0;
        }
        soportesPorSemana[key]++;
      });
  
      // Convertir el objeto a un array
      const result = Object.entries(soportesPorSemana).map(([semana, total]) => ({
        semana,
        total,
      })).sort((a, b) => b.total - a.total);

  
      res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener soportes por semana: ' + error.message });
  }
});

// Función para obtener el número de semana ISO
function getISOWeek(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);
}

router.get('/gestion/planta/soportes/estadisticas/estacion', async (req, res) => {
  try {
    const { mes } = req.query; // Formato esperado: "YYYY-MM"
    
    // Definir el primer y último día del mes
    const fechaInicio = mes ? new Date(`${mes}-01T00:00:00.000Z`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const fechaFin = mes ? new Date(new Date(`${mes}-01T00:00:00.000Z`).getFullYear(), new Date(`${mes}-01T00:00:00.000Z`).getMonth() + 2, 0) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Obtener los datos agrupados por idEquipoComputo
    const soportesPorEquipo = await prisma.soporte.groupBy({
      by: ['idEquipoComputo'], // Agrupar por el ID del equipo de cómputo
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      _count: {
        _all: true, // Contar todos los registros
      },
    });

    // Obtener los IDs de los equipos de cómputo
    const equipoIds = soportesPorEquipo.map(s => s.idEquipoComputo);

    console.log(equipoIds)

   // Obtener los equipos de cómputo y sus estaciones
   const equipos = await prisma.equipoComputo.findMany({
    where: {
      id: { in: equipoIds },
    },
    include: {
      lineas: {
        include: {
          estacion: true, // Incluir la estación relacionada
        },
          },
        },
  });


   // Contar los soportes por estación
   const conteoPorEstacion = {};

   soportesPorEquipo.forEach(soporte => {
     const equipo = equipos.find(e => e.id === soporte.idEquipoComputo);
     if (equipo && equipo.lineas.length > 0) {
       const estacion = equipo.lineas[0].estacion.nombre; // Obtener el nombre de la estación
       if (!conteoPorEstacion[estacion]) {
         conteoPorEstacion[estacion] = 0;
       }
       conteoPorEstacion[estacion] += soporte._count._all; // Sumar el conteo
     }
   });

   // Encontrar la estación con más soportes
   const maxEstacion = Object.entries(conteoPorEstacion).reduce((prev, current) => {
     return (prev[1] > current[1]) ? prev : current;
   });

   res.json({
     estacion: maxEstacion[0],
     total: maxEstacion[1],
   });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la estación con más soportes: ' + error.message });
  }
});

router.get('/gestion/planta/soportes/estadisticas/top-estaciones', async (req, res) => {
  try {
    const { mes } = req.query; // Formato esperado: "YYYY-MM"
    
    // Definir el primer y último día del mes
    const fechaInicio = mes ? new Date(`${mes}-01T00:00:00.000Z`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const fechaFin = mes ? new Date(new Date(`${mes}-01T00:00:00.000Z`).getFullYear(), new Date(`${mes}-01T00:00:00.000Z`).getMonth() + 2, 0) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Obtener los datos agrupados por idEquipoComputo
    const soportesPorEquipo = await prisma.soporte.groupBy({
      by: ['idEquipoComputo'], // Agrupar por el ID del equipo de cómputo
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      _count: {
        _all: true, // Contar todos los registros
      },
    });

   

    // Obtener los IDs de los equipos de cómputo
    const equipoIds = soportesPorEquipo.map(s => s.idEquipoComputo);

    console.log(equipoIds)

   // Obtener los equipos de cómputo y sus estaciones y líneas
   const equipos = await prisma.equipoComputo.findMany({
    where: {
      id: { in: equipoIds },
    },
    include: {
      lineas: {
        include: {
          estacion: true,
          linea:true
        },
          },
        },
  });


   // Contar los soportes por estación
   const conteoPorEstacion = {};
   let claveIncremental = 1; // Inicializar el contador

   soportesPorEquipo.forEach(soporte => {
     const equipo = equipos.find(e => e.id === soporte.idEquipoComputo);
     if (equipo && equipo.lineas.length > 0) {
       const estacion = equipo.lineas[0].estacion.nombre; // Obtener el nombre de la estación
       const linea = equipo.lineas[0].linea.nombre; // Obtener el nombre de la línea

         // Crear una clave única incrementable
         const clave = `clave-${claveIncremental++}`; // Incrementar la clave

       if (!conteoPorEstacion[clave]) {
         //conteoPorEstacion[estacion] = { total: 0, linea }; // Inicializar con el nombre de la línea
         conteoPorEstacion[clave] = { total: 0, estacion, linea }; // Inicializar con el nombre de la línea
       }
       conteoPorEstacion[clave].total += soporte._count._all; // Sumar el conteo
     }
   });

   console.log(conteoPorEstacion)

 // Convertir el objeto a un array y ordenar por total de soportes
const estacionesOrdenadas = Object.entries(conteoPorEstacion)
.map(([clave, { total, estacion, linea }]) => ({ clave, total, estacion, linea })) // Incluir el nombre de la línea
.sort((a, b) => b.total - a.total) // Ordenar de mayor a menor
.slice(0, 10); // Limitar a las 10 primeras

res.json(estacionesOrdenadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el top 10 de estaciones con más soportes: ' + error.message });
  }
});

// Add this route in your routes file
router.get('/linea/:idLinea/estaciones-equipos', getLineaEstacionesEquipos)


export default router;
