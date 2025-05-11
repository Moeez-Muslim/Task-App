<template>

  <div class="container mt-5">
    <div class="d-flex justify-content-end mb-4">
        <router-link to="/create-task" class="btn btn-success">+ Add Task</router-link>
    </div>
    <h2 class="text-center mb-4">Your Tasks</h2>
    <div class="row g-4">
      <div v-for="task in tasks" :key="task.id" class="col-sm-6 col-md-4">
        <div class="card h-100 shadow-sm">
          <img :src="task.fileUrl" class="card-img-top" alt="Task Image" style="object-fit: cover; height: 200px;" />
          <div class="card-body">
            <h5 class="card-title">{{ task.title }}</h5>
            <p class="card-text text-muted">{{ task.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../axios';

interface Task {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
}

const tasks = ref<Task[]>([]);
const router = useRouter();

onMounted(async () => {
  try {
    const res = await axios.get('/tasks');
    tasks.value = res.data;
  } catch (err) {
    router.push('/login');
  }
});
</script>
