const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // <- esto importa correctamente fetch
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

const contadorPath = path.join(__dirname, 'contador.json');

function leerContadores() {
  if (!fs.existsSync(contadorPath)) {
    return {};
  }
  const data = fs.readFileSync(contadorPath);
  return JSON.parse(data);
}

function guardarContadores(contadores) {
  fs.writeFileSync(contadorPath, JSON.stringify(contadores, null, 2));
}


app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/status', async (req, res) => {
  const { deviceId } = req.body;

  try {
    const response = await fetch('https://sqj6a1yysl.execute-api.us-west-1.amazonaws.com/default/IWSS_GetDeviceStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YedYxiPP3n5rbjlwb24cQag44EjobK2fa4plfnMT'
      },
      body: JSON.stringify({ DeviceId: deviceId })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al consultar el estado:', error);
    res.status(500).json({ error: 'Error al consultar el estado del dispositivo' });
  }
});

app.post('/api/contador', (req, res) => {
  const { deviceId } = req.body;
  const contadores = leerContadores();
  const count = contadores[deviceId] || 0;
  res.json({ deviceId, count });
});
app.post('/api/contador/incrementar', (req, res) => {
  const { deviceId, comando } = req.body;

  const contadores = leerContadores();
  contadores[deviceId] = (contadores[deviceId] || 0) + 1;
  guardarContadores(contadores);

  res.json({ success: true, count: contadores[deviceId] });
});


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
