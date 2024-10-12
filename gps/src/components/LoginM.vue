<template>
    <div class="cont">
        <div class="contenedor1">
            <div class="logo">
                <img :src="require('@/assets/earth1.gif')" alt="">
                <h1>Los Populares</h1>
            </div>

            <div class="formu">
                <form class="box" @submit.prevent="login">
                    <h1 ref="typedText" class="typed-text"> {{ displayText }}</h1>
                    <input type="text" v-model="email" placeholder="Email" required>
                    <input type="password" v-model="password" placeholder="Password" required> 
                    <input type="submit" value="Iniciar Sesion" class="btn1">
                </form>
            </div>
        </div>

        <div class="contenedor2">
           
        </div>
    </div>

</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import Swal from 'sweetalert2';
import '@/styles_App/login.css';

const emit = defineEmits(['loginSuccess']);

const email = ref('');
const password = ref('');
const displayText = ref(''); // Cambiamos a usar una propiedad reactiva
const text = "Iniciar sesión en Navify GPS"; 
let index = 0; 

const login = () => {
    if (email.value === '1' && password.value === '1') {
        sessionStorage.setItem('isAuthenticated', 'true');
        emit('loginSuccess');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Por favor, verifica tu usuario y contraseña',
        });
    }
};

const typeWriter = () => {
  if (index < text.length) {
    displayText.value += text.charAt(index); // Cambiamos el innerHTML por displayText
    index++;
    setTimeout(typeWriter, 100); 
  } else {
    setTimeout(() => {
      displayText.value = ""; // Reiniciamos displayText en lugar de innerHTML
      index = 0;
      typeWriter();
    }, 5000);
  }
};

onMounted(() => {
  typeWriter();
});
</script>

