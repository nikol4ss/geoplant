import { createApp } from 'vue';

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth.store';
import './style.css';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();
    document.title = (to.meta?.title as string) || 'GeoPlant';

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      return next('/auth/login'); 
    }

    if (to.meta.public && authStore.isLoggedIn) {
      return next('/atlas'); // não deixa entrar em login/signup se já estiver logado
    }

    next();
  },
);

app.mount('#app');
