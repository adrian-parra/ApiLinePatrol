// In gestionPlantas.routes.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import { ping } from '../utils/networkUtils.js'

export const getLineaEstacionesEquipos = async (req, res) => {
  try {
    const { idLinea } = req.params

    const lineaEstaciones = await prisma.lineaEstacionEquipo.findMany({
      where: {
        idLinea: parseInt(idLinea)
      },
      include: {
        linea: true,
        estacion: true,
        equipo: true
      }
    })

    // Test connection for each equipment
    const resultadosConexion = await Promise.all(lineaEstaciones.map(async (item) => {
        try {
          // Ping the hostname
          const pingResult = await ping(item.equipo.hostname)
          
          return {
            estacion: item.estacion.nombre,
            hostname: item.equipo.hostname,
            status: pingResult.estatus === 'ok' ? 'Conectado' : 'Desconectado',
            detalles: pingResult
          }
        } catch (error) {
          return {
            estacion: item.estacion.nombre,
            hostname: item.equipo.hostname,
            status: 'Error de conexión',
            detalles: error.message
          }
        }
      }))
  
      res.json({
        success: true,
        data: resultadosConexion
      })
  } catch (error) {
    console.error('Error al obtener estaciones y equipos:', error)
    res.status(500).json({
      success: false,
      message: 'Error al recuperar información de la línea',
      error: error.message
    })
  }
}
