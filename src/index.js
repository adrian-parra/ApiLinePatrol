import express from 'express'

import linePatrolRoutes  from './routes/linePatrol.routes.js'
import voseoRoutes from './routes/voseo.routes.js'
import cmdRoutes from './routes/cmd.routes.js'
import gestionPlantasRoutes from './routes/gestionPlantas.routes.js'
import reporteGenerador from './routes/reporteGenerador.routes.js'
import fileUploadRoutes from './routes/file.routes.js'




const app = express()



app.use(express.json())

app.use("/api", gestionPlantasRoutes)
app.use("/api", linePatrolRoutes)
app.use("/api", voseoRoutes)
app.use("/api", cmdRoutes)
app.use("/api", reporteGenerador)
app.use("/api", fileUploadRoutes)


app.listen(3000)
console.log('server en port 3000')