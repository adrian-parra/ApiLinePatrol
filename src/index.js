import express from 'express'
import cors from 'cors';

import linePatrolRoutes  from './routes/linePatrol.routes.js'
import voseoRoutes from './routes/voseo.routes.js'
import cmdRoutes from './routes/cmd.routes.js'
import gestionPlantasRoutes from './routes/gestionPlantas.routes.js'
import reporteGenerador from './routes/reporteGenerador.routes.js'
import fileUploadRoutes from './routes/file.routes.js'
import geminiRoutes from './routes/gemini.routes.js';





import emailRoutes from './routes/email.routes.js';


const app = express()

app.use(cors({origin: '*'}));



app.use(express.json())

app.use("/api", gestionPlantasRoutes)
app.use("/api", linePatrolRoutes)
app.use("/api", voseoRoutes)
app.use("/api", cmdRoutes)
app.use("/api", reporteGenerador)
app.use("/api", fileUploadRoutes)

app.use('/api', emailRoutes);

// Después de otras configuraciones de middleware
app.use('/api/gemini', geminiRoutes);


app.listen(3000)
console.log('server en port 3000')