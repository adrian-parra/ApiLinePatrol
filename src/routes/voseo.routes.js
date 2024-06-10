import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post('/voseo', async (req, res) =>{
    console.log(req.body.fecha1)
    const tableData = `
    <div class='table-responsive' id='my-table-id'>
<table class='table table-hover table-bordered'>
<tr>
<td bgcolor='black' align='center'><b><font color='white'>DEPARTAMENTO</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>LINEA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>PROBLEMA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>PLANTA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>FECHA</font></b></td>

</tr> <tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 00:20:18:410</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 01:59:20:007</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 02:05:42:823</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 02:31:52:610</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:00:05:600</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:04:54:777</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:06:11:380</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:25:39:043</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:28:09:973</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:35:49:327</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:43:49:800</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 05:02:59:597</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:12:32:517</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:27:30:470</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:28:34:237</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:57:17:480</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:59:26:900</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:03:21:653</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:04:22:453</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 07:27:09:350</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:43:50:107</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 08:07:32:507</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 08:13:56:353</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 09:29:38:983</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 10:12:32:290</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 10:42:02:463</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 11:51:22:670</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 13:19:39:057</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 14:18:54:423</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 14:32:35:583</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 14:50:29:497</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 14:58:35:410</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 15:16:25:497</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>CABLE SUELTO</td>
<td>MCH1</td>
<td>05/24/2024 15:45:04:973</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>
</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 1</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 2</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 3</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 11111111</td>
<td>TIEMPO MUERTO 4</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>
</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1111</td>
<td>TIEMPO MUERTO 1111</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 111</td>
<td>TIEMPO MUERTO 1</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 11</td>
<td>TIEMPO MUERTO 11</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</table></div>
    `

    res.send(tableData)
})

router.get('/voseo', async (req , res) => {
    const tableData = `
    <div class='table-responsive' id='my-table-id'>
<table class='table table-hover table-bordered'>
<tr>
<td bgcolor='black' align='center'><b><font color='white'>DEPARTAMENTO</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>LINEA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>PROBLEMA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>PLANTA</font></b></td>
<td bgcolor='black' align='center'><b><font color='white'>FECHA</font></b></td>

</tr> <tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 00:20:18:410</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 01:59:20:007</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 02:05:42:823</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 02:31:52:610</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:00:05:600</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:04:54:777</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:06:11:380</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 03:25:39:043</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:28:09:973</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:35:49:327</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 04:43:49:800</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 05:02:59:597</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:12:32:517</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:27:30:470</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:28:34:237</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:57:17:480</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 06:59:26:900</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:03:21:653</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:04:22:453</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 07:27:09:350</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 07:43:50:107</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 08:07:32:507</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 08:13:56:353</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 09:29:38:983</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 10:12:32:290</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 10:42:02:463</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 11:51:22:670</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 13:19:39:057</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 4</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 14:18:54:423</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 14:32:35:583</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 14:50:29:497</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 14:58:35:410</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td> GENERAL</td>
<td>MCH1</td>
<td>05/24/2024 15:16:25:497</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>CABLE SUELTO</td>
<td>MCH1</td>
<td>05/24/2024 15:45:04:973</td>



</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/24/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/25/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>
</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 1</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 2</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1</td>
<td>TIEMPO MUERTO 3</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 11111111</td>
<td>TIEMPO MUERTO 4</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>
</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 1111</td>
<td>TIEMPO MUERTO 1111</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 111</td>
<td>TIEMPO MUERTO 1</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</tr><tr class='active'>
<td>MANTENIMIENTO</td>
<td>LINEA: 11</td>
<td>TIEMPO MUERTO 11</td>
<td>MCH1</td>
<td>05/26/2024 15:58:49:257</td>



</tr>

</table></div>
    `

    res.send(tableData)
})

export default router;