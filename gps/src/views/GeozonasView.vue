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
        <h1>Crear Geozonas</h1>
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
            <li @click="selectDevice(item)" v-for="item in filteredResults" :key="item.id">{{ item.name }}
            <i class='bx bxs-car icon'></i>
          </li>
          </router-link>
          
        </ul>

        <button type="button" class="button" @click="deleteLastShape">
          <span class="button__text">Eliminar Geozona</span>
        </button>
      </div>

      <div id="map" class="map-container"></div>
    </div>
  </section>  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

// Variables de estado
const map = ref(null);
const drawingManager = ref(null);
const shapes = ref([]);
const dropdownOpen = ref(false);
const searchQuery = ref('');
const devices = ref([
  { id: 1, name: 'Jesus Alvarez' },
  { id: 2, name: 'RTY687' },
  { id: 3, name: 'SJS981' },
  { id: 4, name: 'HDS432' }
]);
const filteredResults = ref([]);
const selectedDevice = ref(null);
const deviceShapes = ref({});

// Función para alternar la visibilidad del dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Función que se ejecuta al montar el componente
onMounted(() => {
  filteredResults.value = devices.value;

  // Cargar el script de Google Maps con Drawing Library al iniciar
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBljMgFeIGE-6n1LBVmNWai3Km4MC8_NEg&libraries=drawing&callback=initGoogleMaps`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

// Función de callback al inicializar Google Maps
window.initGoogleMaps = () => {
  initMap();
};

// Función para inicializar el mapa de Google
const initMap = () => {
  map.value = new window.google.maps.Map(document.getElementById('map'), {
    center: { lat: 10.96854, lng: -74.78132 },
    zoom: 12
  });

  // Configurar el DrawingManager para permitir dibujar formas en el mapa
  drawingManager.value = new window.google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['rectangle', 'circle', 'polyline']
    }
  });
  drawingManager.value.setMap(map.value);

  // Escuchar el evento de completado de dibujo de una forma
  window.google.maps.event.addListener(drawingManager.value, 'overlaycomplete', (event) => {
    if (!selectedDevice.value) {
      // Mostrar alerta si no se ha seleccionado un dispositivo
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debe seleccionar un dispositivo antes de crear una geozona.',
        confirmButtonText: 'Cerrar'
      });
      event.overlay.setMap(null); // Eliminar la forma dibujada si no hay dispositivo seleccionado
      return;
    }

    // Si se dibuja una forma válida (rectángulo, círculo o polilínea)
    if (event.type === 'rectangle' || event.type === 'circle' || event.type === 'polyline') {
      // Guardar la forma dibujada
      const newShape = event.overlay;
      newShape.type = event.type;

      // Asociar la forma con el dispositivo seleccionado
      if (!deviceShapes.value[selectedDevice.value.id]) {
        deviceShapes.value[selectedDevice.value.id] = [];
      }
      deviceShapes.value[selectedDevice.value.id].push(newShape);

      // Mostrar las coordenadas en la tabla
      displayCoordinates(newShape.type, newShape);

      // Limpiar el modo de dibujo después de completar
      drawingManager.value.setDrawingMode(null);
    }
  });
};

// Función para mostrar las coordenadas de la forma dibujada
const displayCoordinates = (type, shape) => {
  const coordinatesTable = document.createElement('table');
  coordinatesTable.classList.add('coordinates-table');

  // Crear encabezado de la tabla
  const thead = coordinatesTable.createTHead();
  const headerRow = thead.insertRow();
  const typeHeaderCell = document.createElement('th');
  typeHeaderCell.textContent = 'Tipo';
  const coordinatesHeaderCell = document.createElement('th');
  coordinatesHeaderCell.textContent = 'Coordenadas';
  headerRow.appendChild(typeHeaderCell);
  headerRow.appendChild(coordinatesHeaderCell);

  // Crear cuerpo de la tabla y añadir fila con datos de la forma
  const tbody = coordinatesTable.createTBody();
  const newRow = tbody.insertRow();
  const typeCell = newRow.insertCell(0);
  const coordinatesCell = newRow.insertCell(1);

  typeCell.textContent = type;
  coordinatesCell.textContent = getShapeCoordinates(shape);

  // Mostrar alerta con las coordenadas
  Swal.fire({
    title: "Geozona Creada",
    icon: "success",
    confirmButtonText: 'Cerrar',
  });
};

// Función para obtener las coordenadas de la forma dibujada
const getShapeCoordinates = (shape) => {
  let coordinates = '';

  if (shape.type === 'rectangle') {
    const bounds = shape.getBounds();
    coordinates = 'NE: ' + bounds.getNorthEast().toString() + ', ' +
      'SW: ' + bounds.getSouthWest().toString();
  } else if (shape.type === 'circle') {
    const center = shape.getCenter();
    coordinates = 'Centro: ' + center.toString() + ', ' +
      'Radio: ' + shape.getRadius().toString();
  } else if (shape.type === 'polyline') {
    const path = shape.getPath();
    coordinates = path.getArray().toString();
  }

  return coordinates;
};

// Función para eliminar la última forma dibujada
const deleteLastShape = () => {
  if (!selectedDevice.value || !deviceShapes.value[selectedDevice.value.id]) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No hay formas asociadas a este dispositivo.',
    });
    return;
  }

  const shapesForDevice = deviceShapes.value[selectedDevice.value.id];
  if (shapesForDevice.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin Geozonas',
      text: 'Este dispositivo no tiene geozonas creadas.',
    });
    return;
  }

  const lastShape = shapesForDevice.pop(); // Elimina la última forma del array
  if (lastShape) {
    lastShape.setMap(null); // Eliminar la forma del mapa
    Swal.fire({
      icon: 'success',
      title: 'Geozona Eliminada',
      text: 'La última geozona creada ha sido eliminada.',
    });
  }
};

// Función para seleccionar un dispositivo y mostrar la alerta correspondiente
const selectDevice = (device) => {
  // Ocultar las geozonas del dispositivo actualmente seleccionado
  if (selectedDevice.value) {
    hideDeviceShapes(selectedDevice.value.id);
  }

  // Actualizar el dispositivo seleccionado
  selectedDevice.value = device;
  showAlert(device.name);
  loadDeviceShapes(); // Cargar las formas asociadas al dispositivo seleccionado
};

// Función para ocultar las formas del dispositivo especificado
const hideDeviceShapes = (deviceId) => {
  if (!deviceShapes.value[deviceId]) {
    return; // No hay formas asociadas a este dispositivo
  }

  // Recorre todas las formas del dispositivo y ocúltalas
  deviceShapes.value[deviceId].forEach((shape) => {
    shape.setMap(null); // Eliminar la forma del mapa sin borrarla del estado
  });
  
  // Limpiar el array de formas visibles para este dispositivo
  shapes.value = shapes.value.filter(shape => shape.deviceId !== deviceId);
};

// Función para cargar las formas asociadas al dispositivo seleccionado en el mapa
const loadDeviceShapes = () => {
  if (selectedDevice.value && deviceShapes.value[selectedDevice.value.id]) {
    deviceShapes.value[selectedDevice.value.id].forEach((shape) => {
      shape.setMap(map.value); // Mostrar las formas asociadas al dispositivo en el mapa
      shapes.value.push(shape); // Añadir la forma al array de formas actuales
    });
  }
};

// Función para mostrar las coordenadas de todas las formas dibujadas para el dispositivo seleccionado
const showCoordinates = () => {
  const coordinatesTable = document.createElement('table');
  coordinatesTable.classList.add('coordinates-table');

  // Crear encabezado de la tabla
  const thead = coordinatesTable.createTHead();
  const headerRow = thead.insertRow();
  const typeHeaderCell = document.createElement('th');
  typeHeaderCell.textContent = 'Tipo';
  const coordinatesHeaderCell = document.createElement('th');
  coordinatesHeaderCell.textContent = 'Coordenadas';
  headerRow.appendChild(typeHeaderCell);
  headerRow.appendChild(coordinatesHeaderCell);

  // Crear cuerpo de la tabla y añadir filas con datos de las formas dibujadas
  const tbody = coordinatesTable.createTBody();
  shapes.value.forEach((shape) => {
    const newRow = tbody.insertRow();
    const typeCell = newRow.insertCell(0);
    const coordinatesCell = newRow.insertCell(1);

    typeCell.textContent = shape.type;
    coordinatesCell.textContent = getShapeCoordinates(shape);
  });

  // Mostrar alerta con las coordenadas de las formas dibujadas
  Swal.fire({
    title: `Coordenadas de la Geozona para ${selectedDevice.value.name}`,
    html: coordinatesTable.outerHTML,
    confirmButtonText: 'Cerrar',
    width: '75%'
  });
};

// Función para mostrar la alerta de selección de dispositivo
const showAlert = (name) => {
  Swal.fire({
    title: 'Dispositivo Seleccionado',
    text: name,
    confirmButtonText: 'Crear Geozona',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    showDenyButton: true,
    denyButtonText: 'Ver Coordenadas'
  }).then((result) => {
    if (result.isDenied) {
      showCoordinates(); 
    } else if (result.isDismissed) {
      selectedDevice.value = null;
    }
  });
};

// Función para filtrar resultados de dispositivos según la consulta de búsqueda
function filterResults() {
  const query = searchQuery.value.toLowerCase();
  filteredResults.value = devices.value.filter(item =>
    item.name.toLowerCase().includes(query)
  );
}
</script>



<style scoped>
#map {
  height: 690px;
  width: 100%;
}

.coordinates-table {
  border-collapse: collapse;
  width: 100%;
}

.coordinates-table,
.coordinates-table th,
.coordinates-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  font-size: 10px;
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

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
}

.iframe-container {
  position: relative;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iframe-container iframe {
  position: relative;
  z-index: 0;
}

.tituloo {
  position: relative;
  z-index: 1;
}

.hone {
  margin-left: 30px;
  width: 17%;
  background-color: var(--sidebar-color);
  height: 340px;
  position: absolute;
  top: 25%;
  z-index: 1;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
  /* Para permitir el desplazamiento si la lista es larga */
  border: 1px solid;
  overflow-x: hidden;
}

.hone h1 {
  text-align: left;
  margin-top: 10px;
  margin-left: 20px;
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
  fill: #9e9ea7;
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

.button {
  --main-focus: #2d8cf0;
  --font-color: #323232;
  --bg-color-sub: #dedede;
  --bg-color: #eee;
  --main-color: #323232;
  position: relative;
  width: 190px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid;
  box-shadow: 4px 4px var(--body-color);
  background-color: var(--body-color);
  border-radius: 10px;
  overflow: hidden;
}

.button,
.button__text {
  transition: all 0.3s;
}

.button .button__text {
  transform: translateX(33px);
  color: var(--text-color);
  font-weight: 600;
}


.button:hover {
  background: var(--body-color);

}

.button:hover .button__text {
  color: var(--text-color);
}

.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px var(--main-color);
}
</style>
