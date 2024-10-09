const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/gps-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware para manejar JSON
app.use(express.json());
app.use(express.static('public'));

// Definir el esquema y modelo de coordenadas
const coordenadaSchema = new mongoose.Schema({
  latitud: Number,
  longitud: Number,
  dispositivoId: String,
  timestamp: { type: Date, default: Date.now }
});

const Coordenada = mongoose.model('Coordenada', coordenadaSchema);
app.get('/', (req, res) => {
  res.redirect('/enviarUbicacion'); // Redirige a la página de enviar ubicación
});
// Ruta para enviar la página de ubicación
app.get('/enviarUbicacion', (req, res) => {
  res.sendFile(__dirname + '/public/enviarUbicacion.html');
});

// Manejo de conexiones en tiempo real con Socket.IO
io.on('connection', (socket) => {
  console.log('A device connected');

  socket.on('device-location', async (data) => {
    console.log('Location received:', data);

    // Guardar la coordenada en la base de datos
    const nuevaCoordenada = new Coordenada(data);
    await nuevaCoordenada.save();

    // Emitir la actualización a todos los clientes conectados
    io.emit('update-location', data);  // Aquí emitimos la nueva ubicación a todos los clientes

    console.log(`Ubicación de ${data.dispositivoId} emitida a todos los clientes.`);
  });
});

// Arrancar el servidor
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
