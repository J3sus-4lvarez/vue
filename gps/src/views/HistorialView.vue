<template>
  <section class="home">
    <div class="overlay"></div>
    <div class="navar">
      <div class="text">
        <h1 class="titulo">Navify</h1>
      </div>

      <div class="actions">
        <!-- Menú desplegable de configuración -->
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
        <h1>Historial de Dispositivo</h1>
        <div class="group">
          <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path
                d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
              </path>
            </g>
          </svg>
          <input placeholder="Search" type="search" class="input" v-model="searchQuery" @input="filterResults">
        </div>
        <ul class="device-list">
          <router-link to="#" style="text-decoration: none;">
            <li @click="showAlert(item.name)" v-for="item in filteredResults" :key="item.id">{{ item.name }}
              <i class='bx bxs-car icon'></i>
            </li>
          </router-link>
        </ul>
      </div>

      <div class="hone2">
        <h1>Historial</h1>
      </div>

      <div id="map" class="map-container"></div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import gpsIcon from '@/assets/gps.png';

let map;

// Función para inicializar Google Map
function initMap() {
  var colombia = { lat: 4.5709, lng: -74.2973 };
  const mapOptions = {
    center: colombia,
    zoom: 6
  };
  map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
}

// Función para mostrar alertas personalizadas
const showAlert = (name) => {
  if (name === 'Jesus Alvarez') {
    // Alerta con formulario para seleccionar rango de fechas y horas
    Swal.fire({
      title: 'Seleccionar rango de fechas y horas',
      html:
        '<label for="start-date">Fecha inicial:</label>' +
        '<input type="date" id="start-date" class="swal2-input">' +
        '<label for="end-date">Fecha fin:</label>' +
        '<input type="date" id="end-date" class="swal2-input">',
      width: '60%',
      confirmButtonText: 'Ver Historial',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
      
        if (!startDate || !endDate ) {
          Swal.showValidationMessage('Por favor ingrese todas las fechas');
        }
        return { startDate, endDate,};
      }
    }).then((result) => {
      if (result.isConfirmed) {
        showHistory(result.value.startDate, result.value.startTime, result.value.endDate, result.value.endTime);
      }
    });
  } else {
    // Alerta simple para buscar dispositivo
    Swal.fire({
      title: name,
      confirmButtonText: 'Buscar Dispositivo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });
  }
};

// Función para mostrar historial de coordenadas en el mapa
const showHistory = (startDate, startTime, endDate, endTime) => {
  const coordenadas = [
    { lat: 10.9878, lng: -74.7889 }, // Punto 1 (Barranquilla)
    { lat: 10.9885, lng: -74.7895 }, // Punto 2
    { lat: 10.9900, lng: -74.7900 }, // Punto 3
    { lat: 10.9920, lng: -74.7910 }, // Punto 4
    { lat: 10.9930, lng: -74.7920 }  // Punto 5
  ];

  // Dibujar polyline con las coordenadas
  const polyline = new window.google.maps.Polyline({
    path: coordenadas,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  polyline.setMap(map);

  // Agregar marcador inicial con el icono de GPS
  const gpsMarkerIco = {
    url: gpsIcon,
    scaledSize: new window.google.maps.Size(40, 40)
  };
  
  const marker = new window.google.maps.Marker({
    position: coordenadas[0],
    map: map,
    icon: gpsMarkerIco,
    title: 'Inicio'
  });

  // Ajustar el mapa para mostrar el polyline completo
  const bounds = new window.google.maps.LatLngBounds();
  for (let i = 0; i < coordenadas.length; i++) {
    bounds.extend(coordenadas[i]);
  }
  map.fitBounds(bounds);
};

const dropdownOpen = ref(false);
const searchQuery = ref('');
const devices = ref([
  { id: 1, name: 'Jesus Alvarez' },
  { id: 2, name: 'RTY687' },
  { id: 3, name: 'SJS981' },
  { id: 4, name: 'HDS432' }
]);
const filteredResults = ref([]);

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

// Inicializar resultados filtrados al montar el componente
onMounted(() => {
  filteredResults.value = devices.value;

  // Cargar el script de Google Maps al iniciar el componente
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBljMgFeIGE-6n1LBVmNWai3Km4MC8_NEg&callback=initGoogleMaps`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

// Función de callback para inicializar Google Maps
window.initGoogleMaps = () => {
  initMap();
};
</script>



<style scoped>
.map-container {
  height: 690px;
}

.home {
  height: 100vh;
  overflow: hidden;
}

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
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
  z-index: 1;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
  /* Para permitir el desplazamiento si la lista es larga */
  border: 1px solid;
}

.hone h1 {
  text-align: left;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 13px;
  position: relative;
  z-index: 1;
  color: var(--text-color);
}

.hone2 {
  margin-left: 30px;
  background-color: var(--sidebar-color);
  height: 50px;
  position: absolute;
  top: 25%;
  z-index: 1;
  border-radius: 10px;
  padding: 5px 15px;
  overflow-y: auto;
  /* Para permitir el desplazamiento si la lista es larga */
  border: 1px solid;
}

.hone2 h1 {
  text-align: center;
  margin-top: 10px;
  font-size: 15px;
  position: relative;
  z-index: 1;
  color: var(--text-color);
}

.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 250px;

  margin-top: 10px;
}

.input {
  width: 100%;
  height: 40px;
  line-height: 28px;
  padding: 0 1rem;
  padding-left: 2.5rem;
  border: 2px solid;
  border-radius: 8px;
  outline: none;
  background-color: var(--body-color);
  color: var(--text-color);
  transition: .3s ease;
}

.input::placeholder {
  color: var(--text-color);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: var(--text-color);
  width: 1rem;
  height: 1rem;
  font-size: 21px;
}

.device-list {
  list-style: none;
  padding: 0;
  margin: 20px;
}

.device-list li {
  color: var(--text-color);
  padding: 5px 0;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  margin-left: 20px;
}
</style>
