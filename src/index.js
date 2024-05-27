import express from 'express'

import linePatrolRoutes  from './routes/linePatrol.routes.js'
import voseoRoutes from './routes/voseo.routes.js'

const app = express()



app.use(express.json())

app.use("/api", linePatrolRoutes)
app.use("/api", voseoRoutes)

app.listen(3000)
console.log('server en port 3000')