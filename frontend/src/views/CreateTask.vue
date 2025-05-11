<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Create a New Task</h2>
    <form @submit.prevent="submitTask" class="card p-4 shadow-sm mx-auto" style="max-width: 600px;">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea v-model="description" class="form-control" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Upload Image</label>
        <input type="file" class="form-control" accept="image/*" @change="handleFile" required />
      </div>
      <button class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Uploading...' : 'Submit Task' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../axios';

const title = ref('');
const description = ref('');
const file = ref<File | null>(null);
const loading = ref(false);
const router = useRouter();

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
};

const submitTask = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('file', file.value);

  loading.value = true;

  try {
    await axios.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    router.push('/tasks');
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Failed to upload task.');
  } finally {
    loading.value = false;
  }
};
</script>
