import { Router } from "express";

import { exec } from "child_process"

const router = Router();



/*NO SE TERMINO DE CREAR LOGICA YA QUE NO HE ENCONTRADO COMO EJECUTAR UN SCRIPT COMPLETO SOLO COMANDOS... */
router.post('/cmd/wmi/apps/close/duplicate', async (req, res) => {
  const command = `
  $processes = Get-WmiObject -Class Win32_Process -ComputerName "7MCH3_82141PR" | Where-Object { $_.Name -like "*ACSystem*" };
  if ($processes.Count -gt 1) {
      # Obtener todos los procesos excepto el último
      $processes[0..($processes.Count - 2)] | ForEach-Object { $_.Terminate() }
      "Se cerraron todas las instancias del proceso ACSystem excepto la última."
  } else {
      "No hay más de una instancia del proceso ACSystem abierta."
  }
  `;

  // Ejecutar el comando
  exec(`powershell.exe -NoProfile -Command "${command.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).send(`Error: ${error.message}`);
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).send(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      return res.send(stdout);
  });
});

/* ESTA RUTA ME PERMITE CERRAR APLICACIONES ABIERTAS DE PC REMOTAS EN EL MISMO DOMINIO */
router.post('/cmd/wmi/apps/close', async (req, res) => {
  const remoteComputer = req.body.ip;
  const app = req.body.app;
try{
//const command = `powershell -Command "(Get-WmiObject -Class Win32_Process -ComputerName "${remoteComputer}" -Filter 'Name=''${app}''').Terminate()"`;
const command = `powershell.exe -Command "(Get-WmiObject -Class Win32_Process -ComputerName '${remoteComputer}' -Filter 'Name=''${app}''') | ForEach-Object { $_.Terminate() }"`;

exec(command, (error, stdout, stderr) => {

  if (error) {
    console.error(`Error al cerrar la aplicación: ${error.message}`);
    return res.status(500).json(error.message );
  }
  if (stderr) {
    console.error(`Error en stderr: ${stderr}`);
    return res.status(500).json(stderr );
  }
  console.log(`Resultados: ${stdout}`);
  return res.json("Aplicación cerrada con éxito");
});
}catch(error){
  console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
}
})

/* ESTA RUTA ME PERMITE REINICIAR PC REMOTAS EN EL MISMO DOMINIO */
router.post('/cmd/wmi/restart/device', async (req, res) => {
  try {

    const computerName = req.body.ip;
    //const computerName = "172.30.106.138"; // Cambia esto por la IP o nombre del equipo remoto

    // Comando de PowerShell para obtener información del sistema operativo
    const command = `powershell -Command "Restart-Computer -ComputerName "${computerName}" -Force"`;
    //const command = `Restart-Computer -ComputerName "${computerName}" -Force`;
    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.error(`Error al reiniciar el equipo: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return;
      }
      console.log(`Resultados: ${stdout}`);
      return res.json("Equipo reiniciado con éxito");
    });


  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/* ESTA RUTA ME PERMITE OBTENER INFORMACIÓN DE PC REMOTAS EN EL MISMO DOMINIO */
router.post('/cmd/wmi', async (req, res) => {
  try {

    const computerName = req.body.ip;
    //const computerName = "172.30.106.138"; // Cambia esto por la IP o nombre del equipo remoto

    // Comando de PowerShell para obtener información del sistema operativo
    const command = `powershell -Command "Get-WmiObject -Class Win32_OperatingSystem -ComputerName '${computerName}' | Select-Object -Property *"`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json(error.message );
        
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).json(stderr);
      
      }
      console.log(`Resultados: ${stdout}`);
      return res.json(stdout);
    });


  } catch (error) {
    
    return res.status(500).json(error.message );
  }
});

/* ESTA RUTA ME PERMITE OBTENER EL USUARIO CON EL QUE SE CORRIÓ EN SERVIDOR */
router.get('/cmd/user', async (req, res) => {

  exec('whoami', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error en stderr: ${stderr}`);
      return;
    }
    // stdout contendrá el nombre del usuario actual
    console.log(`El usuario actual es: ${stdout.trim()}`);
    return res.json({ 'estatus': 'ok', 'user': stdout.trim() });
  });

})



router.post('/cmd/ping', async (req, res) => {
  let hosts = ['C7TIME104', 'C7TIME105', 'C7TIME203', 'C7TIME204', 'C7TIME306', 'C7TIME307']; // Lista de IPs a verificar

  try {
    const results = await Promise.all(hosts.map(host => pingHost(host)));
    return res.json(results);
  } catch (error) {
    console.error('Error al hacer ping:', error);
    return res.status(500).json({ 'estatus': 'error' });
  }
});

function pingHost(host) {
  return new Promise((resolve, reject) => {
    exec(`ping ${host}`, (error, stdout, stderr) => {
      // console.log(stderr);
      if (error) {
        // console.error(`Error al hacer ping a ${host}: ${error.message}`);
        resolve({ host, status: 'fallido' });
        return;
      }
      if (stderr) {
        // console.error(`Error al hacer ping a ${host}: ${stderr}`);
        resolve({ host, status: 'fallido' });
        return;
      }
      if (stdout.includes("Destination host unreachable")) {
        // console.log(`Ping fallido a ${host}`);
        resolve({ host, status: 'fallido' });
        return;
      }
      // console.log(`Ping exitoso a ${host}`);
      resolve({ host, status: 'exitoso' });
    });
  });
}


router.post('/cmd', (req, res) => {
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