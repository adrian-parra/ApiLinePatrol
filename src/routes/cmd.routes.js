import { Router } from "express";

import { exec } from "child_process"

const router = Router();

// APAGAR MAQUINA CON WMI
router.post('/cmd/wmi/ShutdownDevice', async (req, res) => {
  const remoteComputer = req.body.ip;
  try{
    const command = `powershell -Command "Stop-Computer -ComputerName '${remoteComputer}' -Force"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al apagar el equipo: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      console.log(`Resultados: ${stdout}`);
      return res.json("Equipo apagado con éxito");
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})






/* ESTA RUTA OBTIENE EL TIEMPO QUE HA TENIDO PRENDIDA UNA PC */
router.post('/cmd/wmi/uptime', async (req, res) => {
  const remoteComputer = req.body.ip;
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_OperatingSystem -ComputerName '${remoteComputer}' | Select-Object -Property LastBootUpTime"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener el tiempo de inicio: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }

      const formatFechaDeEncendido = formatFechaDeEncendidoPc(stdout);
      const calcularTiempoDeEncendido = calcularTiempoDeEncendidoPc(stdout)

      console.log(`Resultados: ${calcularTiempoDeEncendido}`);
      return res.json({fechaEncendido:formatFechaDeEncendido,tiempoEncendido:calcularTiempoDeEncendido});
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

/* ESTA RUTA OBTIENE EL NOMBRE DE LA PC REMOTA */
router.post('/cmd/wmi/hostname', async (req, res) => {
  const remoteComputer = req.body.ip;
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_ComputerSystem -ComputerName '${remoteComputer}' | Select-Object -Property Name"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener el nombre del equipo: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      console.log(`Resultados: ${stdout}`);
      return res.json(stdout);
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

/* ESTA RUTA OBTIENE LA VERSIÓN DEL SISTEMA OPERATIVO DE LA PC REMOTA */
router.post('/cmd/wmi/os/version', async (req, res) => {
  const remoteComputer = req.body.ip;
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_OperatingSystem -ComputerName '${remoteComputer}' | Select-Object -Property Version"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener la versión del sistema operativo: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      console.log(`Resultados: ${stdout}`);
      return res.json(stdout);
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

/* ESTA RUTA OBTIENE EL NOMBRE DEL PRODUCTO DE LA PC REMOTA */
router.post('/cmd/wmi/product/name', async (req, res) => {
  const remoteComputer = req.body.ip;
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_ComputerSystem -ComputerName '${remoteComputer}' | Select-Object -Property Name"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener el nombre del producto: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      console.log(`Resultados: ${stdout}`);
      return res.json(stdout);
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

/* ESTA RUTA OBTIENE LA INFORMACIÓN DE LA PC REMOTA */
router.post('/cmd/wmi/info', async (req, res) => {
  const remoteComputer = req.body.ip
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_ComputerSystem -ComputerName '${remoteComputer}' | Select-Object -Property * | Out-String"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener la información del equipo: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      
      
      return res.json(formatInfoPc(stdout));
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

/* ESTA RUTA OBTIENE LA INFORMACIÓN DE LA PC REMOTA */
router.post('/cmd/wmi/info/short', async (req, res) => {
  const remoteComputer = req.body.ip
  try{
    const command = `powershell -Command "Get-WmiObject -Class Win32_ComputerSystem -ComputerName '${remoteComputer}' | Select-Object -Property Name, Manufacturer, Model, SystemType, TotalPhysicalMemory, Processor, OperatingSystem, Version, LastBootUpTime | Out-String"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al obtener la información del equipo: ${error.message}`);
        return res.status(500).json(error.message );
      }
      if (stderr) {
        console.error(`Error en stderr: ${stderr}`);
        return res.status(500).json(stderr );
      }
      console.log(`Resultados: ${stdout}`);
      return res.json(stdout);
    });
  }catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
})

//! FIN IA

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


router.post("/cmd/testConection", async (req, res) => {
  const ip = req.body.ip;

  exec(`ping -n 1 ${ip}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al hacer ping a ${ip}: ${error.message}`);
      return res.json({ 'estatus': 'error' });
    }
    if (stderr) {
      console.error(`Error al hacer ping a ${ip}: ${stderr}`);
      return res.json({ 'estatus': 'error' });
    }
    if (stdout.includes("Destination host unreachable")) {
      console.log(`Ping fallido a ${ip}`);
      return res.json({ 'estatus': 'error' });
    }
    console.log(`Ping exitoso a ${ip}`);
    return res.json({ 'estatus': 'ok' });
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


const formatInfoPc = (info) => {
  const rawData = info
// Limpiar y formatear la salida
const formattedData = rawData
  .split('\r\n')
  .filter(line => line.trim() !== '') // Eliminar líneas vacías
  .map(line => line.trim()) // Eliminar espacios en blanco al inicio y al final
  .map(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    return `${key}: ${value}`;
  })
  .join('\n');

console.log("Información del Sistema:\n");
console.log(formattedData);
return formattedData

}

const formatFechaDeEncendidoPc = (rawBootTimeP)=>{
  const rawBootTime = rawBootTimeP.trim();

// Extraer la cadena de tiempo
const bootTimeString = rawBootTime.match(/\d{14}/)[0];

// Convertir la cadena a un objeto Date
const year = parseInt(bootTimeString.substring(0, 4), 10);
const month = parseInt(bootTimeString.substring(4, 6), 10) - 1; // Los meses en JavaScript son 0-indexados
const day = parseInt(bootTimeString.substring(6, 8), 10);
const hour = parseInt(bootTimeString.substring(8, 10), 10);
const minute = parseInt(bootTimeString.substring(10, 12), 10);
const second = parseInt(bootTimeString.substring(12, 14), 10);

// Crear un objeto Date
const bootDate = new Date(year, month, day, hour, minute, second);

// Formatear la fecha a un formato legible
const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
const formattedBootTime = bootDate.toLocaleString('es-ES', options);

//console.log(`La PC fue encendida por última vez el: ${formattedBootTime}`);
return formattedBootTime
}

const calcularTiempoDeEncendidoPc = (rawBootTimeP)=>{
  const rawBootTime = rawBootTimeP.trim();

// Extraer la cadena de tiempo
const bootTimeString = rawBootTime.match(/\d{14}/)[0];

// Convertir la cadena a un objeto Date
const year = parseInt(bootTimeString.substring(0, 4), 10);
const month = parseInt(bootTimeString.substring(4, 6), 10) - 1; // Los meses en JavaScript son 0-indexados
const day = parseInt(bootTimeString.substring(6, 8), 10);
const hour = parseInt(bootTimeString.substring(8, 10), 10);
const minute = parseInt(bootTimeString.substring(10, 12), 10);
const second = parseInt(bootTimeString.substring(12, 14), 10);

// Crear un objeto Date
const bootDate = new Date(year, month, day, hour, minute, second);

// Calcular el tiempo de actividad
const uptime = new Date() - bootDate; // Tiempo en milisegundos

// Convertir milisegundos a días, horas y minutos
const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

//console.log(`La PC lleva encendida: ${days} días, ${hours} horas y ${minutes} minutos.`);
return `${days} días, ${hours} horas y ${minutes} minutos.`

}

export default router;