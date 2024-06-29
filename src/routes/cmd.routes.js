import { Router } from "express";

import {exec} from "child_process"

const router = Router();


router.post('/cmd/ping', async (req, res) => {
  let hosts = ['C7TIME104', 'C7TIME105', 'C7TIME203', 'C7TIME204', 'C7TIME306','C7TIME307']; // Lista de IPs a verificar

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



// router.post('/cmd/ping', async (req, res) => {
//   let hosts = ['172.30.97.65', '172.30.97.37', '172.30.67.134', '172.30.67.62', '172.30.106.75','172.30.106.94']; // Lista de IPs a verificar
//   let results = [];

//   try {
//     for (const host of hosts) {
//       let data = await pingHost(host);
//       results.push(data)
//     }

//     return res.json(results);
//   } catch (error) {
//     console.error('Error al hacer ping:', error);
//     return res.status(500).json({ 'estatus': 'error' });
//   }
// });

// function pingHost(host) {
//   return new Promise((resolve, reject) => {
//     exec(`ping ${host}`, (error, stdout, stderr) => {
//       console.log(stderr);
//       if (error) {
//         // console.error(`Error al hacer ping a ${host}: ${error.message}`);
//         resolve({ host, status: 'fallido' });
//         return;
//       }
//       if (stderr) {
//         // console.error(`Error al hacer ping a ${host}: ${stderr}`);
//         // reject(new Error(stderr));
//         resolve({ host, status: 'fallido' });
//         return;
//       }
//       if (stdout.includes("Destination host unreachable")) {
//         // console.log(`Ping fallido a ${host}`);
//         resolve({ host, status: 'fallido' });
//         return;
//       }
//       // console.log(`Ping exitoso a ${host}`);
//       resolve({ host, status: 'exitoso' });
//     });
//   });
// }


// function pingHost(host) {
//   return new Promise((resolve, reject) => {
//     exec(`ping ${host}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error al hacer ping a ${host}: ${error.message}`);
//         reject(error);
//         return;
//       }
//       if (stderr) {
//         console.error(`Error al hacer ping a ${host}: ${stderr}`);
//         reject(new Error(stderr));
//         return;
//       }
//       if (stderr.includes("Destination host unreachable")) {
//         console.log(`Ping fallido a ${host}`);
//         resolve();
//         return;
//       }
//       console.log(`Ping exitoso a ${host}`);
//       resolve();
//     });
//   });
// }


// router.post('/cmd/ping', (req ,res) => {
//   let hosts = ['172.30.67.22', '172.30.67.41', 'ping 172.30.67.129']; // Lista de IPs a verificar
//   hosts.forEach(function(host){
//     exec(`ping ${host}`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error al hacer ping a ${host}: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.error(`Error al hacer ping a ${host}: ${stderr}`);
//             return;
//         }
//         if(stderr.includes("Destination host unreachable")){
//             console.log(`Ping fallido a ${host}`);
//             return;
//         }
//         console.log(`Ping exitoso a ${host}`);
//     });
   
// });
// return res.json({'estatus': 'ok'});
// })


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