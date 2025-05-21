const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // <- esto importa correctamente fetch
const app = express();
const PORT = process.env.PORT || 3000;


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

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
