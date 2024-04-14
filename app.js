import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Ruta de ejemplo
app.get("/", (req, res) => {
  fs.readFile("linepatrol.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    // Convierte el contenido del archivo JSON en un objeto JavaScript
    const jsonData = JSON.parse(data);
    // Envía el objeto JSON como respuesta
    res.json(jsonData);
  });
});

app.post("/guardar", (req, res) => {
  console.log(req.body);
  // return res.json(req.body.comentario);

  try {
    let newData = req.body; // Datos que se enviarán para agregar al archivo JSON
    delete newData.imagen; // Elimina el atributo 'imagen' del objeto newData
    const existingData = JSON.parse(fs.readFileSync('linepatrol.json')); // Lee el archivo JSON existente
    existingData.push(newData); // Agrega los nuevos datos al arreglo existente
    fs.writeFileSync('linepatrol.json', JSON.stringify(existingData)); // Escribe los datos actualizados en el archivo JSON
    res.status(200).json('Datos agregados correctamente al archivo JSON.');
  } catch (error) {
    console.error('Error al agregar datos:', error);
    res.status(500).json('Error al agregar datos al archivo JSON.');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
