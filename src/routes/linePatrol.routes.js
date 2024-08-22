import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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
        const estadoBool = estado === "True";
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


    
    if (linePatrol.length > 0) {
        // Formatear la fecha de created_at para cada objeto en el array
        // const formattedData = linePatrol.map(item => {
        //     const createdAt = new Date(item.created_at);
        //     // createdAt.setDate(createdAt.getDate() + 1);
        //     const formattedCreatedAt = createdAt.toLocaleString('es-ES', {
        //         year: 'numeric',
        //         month: 'long',
        //         day: '2-digit',
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         // second: '2-digit',
        //         hour12: true,
        //         timeZone: 'America/Mazatlan'
        //     }).replace(',', '');

        //     const updatedAt = new Date(item.updated_at);
        //     // createdAt.setDate(createdAt.getDate() + 1);
        //     const formattedUpdatedAt = updatedAt.toLocaleString('es-ES', {
        //         year: 'numeric',
        //         month: 'long',
        //         day: '2-digit',
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         // second: '2-digit',
        //         hour12: true,
        //         timeZone: 'America/Mazatlan'
        //     }).replace(',', '');

        //     return {
        //         ...item,
        //         created_at: formattedCreatedAt,
        //         updated_at:formattedUpdatedAt
        //     };
        // });

        
            const formattedData = linePatrol.map(item => {
                const createdAt = new Date(item.created_at);
                const formattedCreatedAt = formatDistanceToNow(createdAt, { addSuffix: true, locale: es });

                const formattedCreatedAtF = createdAt.toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            // second: '2-digit',
                            hour12: true,
                            timeZone: 'America/Mazatlan'
                        }).replace(',', '');
        
                const updatedAt = new Date(item.updated_at);
                const formattedUpdatedAt = formatDistanceToNow(updatedAt, { addSuffix: true, locale: es });

                const formattedUpdatedAtF = updatedAt.toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            // second: '2-digit',
                            hour12: true,
                            timeZone: 'America/Mazatlan'
                        }).replace(',', '');
        
                return {
                    ...item,
                    created_at: formattedCreatedAt,
                    updated_at: formattedUpdatedAt,
                    created_at_f: formattedCreatedAtF,
                    updated_at_f: formattedUpdatedAtF
                };
            });
        

        return res.json(formattedData);
    } 
    res.json(linePatrol)
})

router.post('/linePatrol', async (req, res) =>{
    try {
        delete req.body.imagen

        console.log(req.body.responsable)
    const newLinePatrol = await prisma.line_patrol.create({
        data:req.body,
    })
    res.json(newLinePatrol)
    } catch (error) {
        res.status(500).json({error:"Problemas con servidor"})
    }
    
})

router.patch('/linePatrol/:id', async (req, res) => {
    try {
        const id = req.params.id
        delete req.body.imagen_after
        delete req.body.id

        const payload = req.body

        payload.estado = false
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