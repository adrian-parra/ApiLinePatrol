import { exec } from 'child_process'

export const ping = (hostname) => {
  return new Promise((resolve, reject) => {
    // Sanitize hostname to prevent command injection
    const sanitizedHostname = hostname.replace(/[^a-zA-Z0-9_\-\.]/g, '')
    
    // Use different ping strategies
    const pingCommands = [
      `ping -n 4 "${sanitizedHostname}"`,  // Windows
    ]

    // Try multiple ping commands
    const tryPingCommands = (commands) => {
      if (commands.length === 0) {
        reject(new Error(`Unable to ping ${hostname}`))
        return
      }

      const currentCommand = commands[0]

      exec(currentCommand, (error, stdout, stderr) => {
        // Log the full stdout for debugging
        console.log('Full Ping Output:', stdout);

        // Check for specific unreachable scenarios
        if (stdout.includes('Destination host unreachable') || 
            stdout.includes('Request timed out') || 
            stdout.includes('100% loss')) {
          resolve({
            estatus: 'error',
            mensaje: `No se pudo conectar a ${hostname}`,
            packetLoss: '100',
            avgTime: 'N/A',
            rawOutput: stdout
          });
          return;
        }

        // Parse ping results for Windows output
        const packetLoss = stdout.match(/Lost\s*=\s*(\d+)\s*\((\d+)%\s*loss\)/i)
        const avgTime = stdout.match(/Average\s*=\s*(\d+)ms/i)

        console.log("---------------")
        console.log('Packet Loss Match:', packetLoss);
        console.log('Average Time Match:', avgTime);
        console.log("---------------")

        // Determine status based on packet loss
        const lossPercentage = packetLoss ? parseInt(packetLoss[2]) : 100
        const status = lossPercentage === 0 ? 'ok' : 'error'

        resolve({
          estatus: status,
          mensaje: `Conexión a ${hostname}`,
          packetLoss: lossPercentage.toString(),
          avgTime: avgTime ? avgTime[1] : 'N/A',
          rawOutput: stdout
        })
      })
    }

    // Start trying ping commands
    tryPingCommands(pingCommands)
  })
}