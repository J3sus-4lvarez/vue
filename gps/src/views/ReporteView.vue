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

    <div class="crud">
      <div class="titu">
        <h1><i class='bx bxs-report icoon'></i>Reportes</h1>
      </div>

      <div class="cruds">
        <div class="tituloss">
          <div class="tituloA">
            <h1>Generar reporte</h1>
          </div>
          <div class="tituloB">
            <h1>Seleccionar Reportes</h1>

            <div class="submenu">
              <div class="select">
                <input type="text" readonly :value="selectedDevice || 'Seleccione un dispositivos'"
                  @click="toggleDeviceDropdown" />
                <i class="arrow" @click="toggleDeviceDropdown">&#9660;</i>
              </div>
              <ul v-if="deviceDropdownOpen" class="dropdown-menu">
                <li v-for="device in devices" :key="device" @click="selectDevice(device)">{{ device }}
                  <i class='bx bxs-car iconn'></i>
                </li>

              </ul>
            </div>

            <div class="fechas">
              <div class="derecha">
                <label for="start-date">Fecha inicial:</label>
              </div>

              <div class="centro">
                <label for="end-date">Fecha fin:</label>
              </div>
            </div>

            <div class="dates">
              <div class="derecha2">
                <input type="date" name="" id="">
              </div>

              <div class="centro2">
                <input type="date" name="" id="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      dropdownOpen: false,
      deviceDropdownOpen: false,
      selectedDevice: null,
      devices: ['RTY687', 'SJS981', 'HDS432']
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleDeviceDropdown() {
      this.deviceDropdownOpen = !this.deviceDropdownOpen;
    },
    selectDevice(device) {
      this.selectedDevice = device;
      this.deviceDropdownOpen = false;
    }
  }
};
</script>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
}

.home .navar {
  background-color: var(--sidebar-color);
  border-bottom: 3px solid var(--body-color);
}

.home .text {
  position: relative;
  z-index: 2;
}

.home .actions {
  display: flex;
  justify-content: flex-end;
}

.crud {
  display: flex;
  flex-direction: column;
}

.titu {
  margin-left: 50px;
  margin-top: 40px;
  display: flex;
}

.listad {
  margin-left: 50px;
  margin-top: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.listad h1 {
  font-weight: 400;
  color: var(--text-colar);
}

.listad .boton {
  margin-right: 50px;
}

.titu h1 {
  color: var(--text-colar);
}

.titu h1 i {
  margin-right: 10px;
}

.cruds {
  margin: 20px 20px;
  border-radius: 10px;
  background-color: var(--sidebar-color);
  height: 400px;
  padding: 15px;
}

.cruds .tituloss {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cruds .tituloA {
  margin: 10px 20px;
}

.cruds .tituloA h1 {
  color: var(--text-colar);
}

.cruds .tituloB {
  margin: 10px 20px;
}

.cruds .tituloB h1 {
  color: var(--text-colar);
  font-weight: 400;
  font-size: 20px;
}

.cruds .submenu {
  margin-top: 10px;
}

.select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.select input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  font-weight: 500;
}

.select .arrow {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: var(--text-colar);
}

.dropdown-menu {
  position: absolute;
  width: 92.2%;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  background-color: var(--sidebar-color);
  color: var(--text-colar);
  z-index: 1000;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-menu li {
  margin-left: 40px;
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 300;
}

.iconn {
  position: absolute;
  left: 1rem;
  fill: #9e9ea7;
  width: 1rem;
  height: 1rem;
  font-size: 21px;
}

.dropdown-menu li:hover {
  border-radius: 10px;
  background-color: var(--body-color);
}

.cruds .fechas {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.cruds .fechas .derecha {
  margin-left: 0 auto;
  color: var(--text-colar);
}

.cruds .fechas .centro {
  margin: auto;
  color: var(--text-colar);
}

.cruds .dates {
  margin-top: 20px;
  display: flex;
  align-items: center;
  
}

.cruds .dates .derecha2 {
  margin-left: 0 auto;
  color: var(--text-colar);
}

.cruds .dates .derecha2 input{
  width: 360%;
  height: 40px;
  background-color: var(--body-color);
  border: none;
  padding: 20px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
}

.cruds .dates .derecha2 input[type="date"]{
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cruds .dates .derecha2 input[type="date"]::-webkit-calendar-picker-indicator{
  position: absolute;
  left: 45.9%;
  color: transparent;
}

.cruds .dates .derecha2 input[type="date"]::after {
  content: '📅';
  padding-left: 5px;
  color: var(--text-color);
  pointer-events: none;
  z-index: 1;
}

.cruds .dates .centro2 {
  margin: 0 auto;
  color: var(--text-colar);
}

.cruds .dates .centro2 input{
  width: 330%;
  height: 40px;
  background-color: var(--body-color);
  border: none;
  padding: 20px;
  margin-left: 20px;
  border: 1px solid var(--text-colar);
  border-radius: 4px;
}

.cruds .dates .centro2 input[type="date"]{
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cruds .dates .centro2 input[type="date"]::-webkit-calendar-picker-indicator{
  position: absolute;
  left: 93.6%;
  color: transparent;
}

.cruds .dates .centro2   input[type="date"]::after {
  content: '📅';
  padding-left: 5px;
  color: var(--text-color);
  pointer-events: none;
  z-index: 1;
  
}

</style>
