import { Router } from "express";

import {exec} from "child_process"

const router = Router();
router.post('/cmd', (req ,res) => {
  const comando = req.body.comando;
    console.log(comando);
    // const comando = 'ping 172.30.67.46';
    var std = '';

    exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error('Error al ejecutar el comando: ${error.message}');
          return;
        }
        if (stderr) {
          console.error('Error de la línea de comandos: ${stderr}');
          return;
        }
        // Resultado exitoso
        std = stdout;
        console.log(`Resultado del comando: ${stdout}`);
        return res.json(std);
      });

      
})

export default router;