<template>
  <section class="home">
    <div class="overlay"></div>
    <div class="navar">
      <div class="text">
        <h1 class="titulo">Navify</h1>
      </div>
      <div class="actions">
        <div class="dropdown">
          <button class="dropbtn" @click="toggleDropdown">
            <i class='bx bx-cog confi'></i> Settings
          </button>
          <div class="dropdown-content" :class="{ 'show': dropdownOpen }">
            <a href="#"><i class='bx bx-user-circle iconsub'></i> Perfil</a>
            <a href="#"><i class='bx bx-lock-alt iconsub'></i> Contraseña</a>
            <a href="#"><i class='bx bx-bell iconsub'></i> Notificaciones</a>
            <a href="#"><i class='bx bx-user-x iconsub'></i> Privacidad</a>
          </div>
        </div>
      </div>
    </div>

    <div class="tituloo">
      <div class="hone">
        <h1>Lista de Dispositivos</h1>
        <button @click="addDevice">Enviar ubicación</button> <!-- Botón para enviar ubicación -->
        <div class="group">
          <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path
                d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
              </path>
            </g>
          </svg>
          <input placeholder="Buscar" type="search" class="input" v-model="searchQuery" @input="filterResults">
        </div>
        <ul class="device-list">
          <li v-for="item in filteredResults" :key="item.id" @click="showAlert(item)">
            {{ item.name }} <i class='bx bxs-car icon'></i>
          </li>
        </ul>
      </div>

      <div class="hone2">
        <h1>Dispositivo</h1>
      </div>

      <div id="map" class="map-container"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import L from 'leaflet'; 
import { io } from 'socket.io-client';
const socket = io('https://ee36-181-204-106-98.ngrok-free.app/enviarUbicacion');

let map;

// Inicializa el mapa con Leaflet
function initMap() {
  const colombia = { lat: 10.9685, lng: -74.7813 };
  const mapOptions = {
    center: colombia,
    zoom: 12.4
  };
  
  map = L.map('map').setView([colombia.lat, colombia.lng], mapOptions.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

// Función para alternar la visibilidad del dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Función para filtrar resultados según la consulta de búsqueda
function filterResults() {
  const query = searchQuery.value.toLowerCase();
  filteredResults.value = devices.value.filter(item =>
    item.name.toLowerCase().includes(query)
  );
}

// Función para mostrar la ubicación del dispositivo seleccionado en el mapa
function showDeviceOnMap(device) {
  map.setView([device.lat, device.lng], 18);
  
  L.marker([device.lat, device.lng]).addTo(map)
    .bindPopup(`<b>${device.name}</b><br>Latitud: ${device.lat}<br>Longitud: ${device.lng}<br>Velocidad: ${device.speed} km/h<br>Kilometraje: ${device.km} km`)
    .openPopup();
}

// Mostrar alerta con detalles del dispositivo seleccionado y centrar en el mapa
const showAlert = (item) => {
  Swal.fire({
    title: 'Detalles del Dispositivo',
    html: `
      <p><strong>Nombre:</strong> ${item.name}</p>
      <p><strong>Latitud:</strong> ${item.lat}</p>
      <p><strong>Longitud:</strong> ${item.lng}</p>
      <p><strong>Velocidad:</strong> ${item.speed} km/h</p>
      <p><strong>Kilometraje:</strong> ${item.km} km</p>
    `,
    confirmButtonText: 'Mostrar en Mapa',
    showCancelButton: true,
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      showDeviceOnMap(item); 
    }
  });
};

// Función para agregar un nuevo dispositivo con la ubicación actual

// Asegúrate de que esta función se ejecute correctamente al presionar el botón en el celular


const addDevice = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const newDevice = {
        id: devices.value.length + 1,
        name: `Nuevo Dispositivo ${devices.value.length + 1}`,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        speed: 0,
        km: 0
      };

      devices.value.push(newDevice);
      filteredResults.value.push(newDevice);

      // Cambia el nombre del evento a 'device-location'
      socket.emit('device-location', newDevice);
      console.log('Nuevo dispositivo agregado:', newDevice);
    },
    (error) => {
      console.error('Error al obtener la ubicación:', error);
    }
  );
};




// Variables reactivas para manejar el estado del dropdown y la búsqueda
const dropdownOpen = ref(false);
const searchQuery = ref('');
const devices = ref([
  { id: 1, name: 'Jesus Alvarez', lat: 10.9878, lng: -74.7889, speed: 60, km: 1200 },
  { id: 2, name: 'RTY687', lat: 10.9870, lng: -74.7850, speed: 50, km: 850 },
  { id: 3, name: 'SJS981', lat: 10.9880, lng: -74.7860, speed: 70, km: 900 },
  { id: 4, name: 'HDS432', lat: 10.9890, lng: -74.7870, speed: 55, km: 1100 },
]);
const filteredResults = ref([]);

onMounted(() => {
  initMap();
  filterResults(); // Inicializar la lista filtrada
});
</script>


<style scoped>
.map-container {
  height: calc(100vh - 60px);
  width: 100%; 
  z-index: 0; 
}

.home {
  height: 100vh; 
  overflow: hidden; 
  position: relative;
}

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
  z-index: 2; 
}

.home .navar,
.home .titulo,
.home .subtitulo {
  position: relative; 
  z-index: 2; 
}

.tituloo {
  position: relative;
  z-index: 1; 
}

.hone {
  margin-left: 30px;
  width: 17%;
  background-color: var(--sidebar-color);
  height: 280px;
  position: absolute;
  top: 35%;
  z-index: 2; 
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto; 
  border: 1px solid;
}

.hone h1 {
  text-align: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 15px;
  color: var(--text-color);
}

.hone2 {
  margin-left: 30px;
  background-color: var(--sidebar-color);
  height: 50px;
  position: absolute;
  top: 25%;
  z-index: 2; 
  border-radius: 10px;
  padding: 5px 15px;
  border: 1px solid;
}

.hone2 h1 {
  text-align: center;
  margin-top: 10px;
  font-size: 15px;
  color: var(--text-color);
}

.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 250px;
  margin-top: 20px;
  margin-left: 10px;
}

.icon {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  fill: #444;
}

.input {
  width: 100%;
  padding: 10px 10px 10px 38px;
  font-size: 15px;
  color: #444;
  background: #eef1f6;
  border: 1px solid transparent;
  border-radius: 10px;
  outline: none;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 10px;
}

.device-list li {
  font-size: 14px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.device-list li:hover {
  background-color: var(--hover-color);
}
</style>
