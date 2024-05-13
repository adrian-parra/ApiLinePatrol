import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


router.get('/linePatrol', async (req, res) => {
    const { id_planta, id_linea, id_estacion, estado, fecha_inicio, fecha_fin } = req.query;
    
    let whereClause = {};
    if (id_planta) {
        whereClause.id_planta = id_planta;
    }
    if (id_linea) {
        whereClause.id_linea = id_linea;
    }
    if (id_estacion) {
        whereClause.id_estacion = id_estacion;
    }

    if (estado) {
        const estadoBool = estado === "true";
        whereClause.estado = estadoBool;
    }
    if (fecha_inicio && fecha_fin) {
        whereClause.created_at = {
            gte: new Date(fecha_inicio),
            lt: new Date(new Date(fecha_fin).setDate(new Date(fecha_fin).getDate() + 1))
        };
    }
    
    const linePatrol = await prisma.line_patrol.findMany({
        where: whereClause,
    });
    res.json(linePatrol)
})

router.post('/linePatrol', async (req, res) =>{
    console.log(req.body)
    delete req.body.imagen
    console.log(req.body)
    const newLinePatrol = await prisma.line_patrol.create({
        data:req.body,
    })
    res.json(newLinePatrol)
})

router.patch('/linePatrol/:id', async (req, res) => {
    try {
        console.log(req.body)
        const id = req.params.id
        delete req.body.imagen_after
        delete req.body.id

        const payload = req.body
        console.log(req.body)

        payload.estado = false
        console.log(payload)
        const updateLinePatrol = await prisma.line_patrol.update({
            where: {
              id: Number(id)
            },
            data: payload
          })
          res.json(updateLinePatrol)
    } catch (error) {
        res.status(500).json({
            error:'Error con servidor (500)'
        })    
    }
})

export default router;