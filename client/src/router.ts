import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: '/', component: () => import('./pages/Shell.vue'), meta: { title: 'GeoPlant - Home' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  next();
});

export default router;
