import { createApp } from 'vue';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import App from './App.vue';
import router from './router';
import './style.css';

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    document.title = (to.meta?.title as string) || 'Loopcontract';
    next();
  },
);

const app = createApp(App);
app.use(router);

app.mount('#app');
