import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import TaskList from '../views/TaskList.vue';
import CreateTask from '../views/CreateTask.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/tasks', component: TaskList },
  { path: '/create-task', component: CreateTask }, 
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
