import { createApp } from 'vue';

import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth/auth.store';
import './style.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  document.title = (to.meta?.title as string) || 'GeoPlant';

  if (to.meta.requiresAuth) {
    if (authStore.isLoggedIn) {
      return next();
    }

    try {
      await authStore.refresh();
      return authStore.isLoggedIn ? next() : next('/auth/login');
    } catch {
      authStore.logout();
      return next('/auth/login');
    }
  }

  if (authStore.isLoggedIn && !to.meta.allowWhenLogged) {
    return next('/atlas');
  }

  next();
});

app.mount('#app');
