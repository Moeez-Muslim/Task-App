<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px;">
      <h3 class="text-center mb-4">Sign Up</h3>
      <form @submit.prevent="signup">
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Password" required />
        </div>
        <button class="btn btn-success w-100">Sign Up</button>
        <p class="text-center mt-3 small">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '../axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const signup = async () => {
  await axios.post('/auth/signup', { email: email.value, password: password.value });
  router.push('/login');
};
</script>
