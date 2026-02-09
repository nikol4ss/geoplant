import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/auth/login',
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('./pages/auth/Login.vue'),
    meta: {
      public: true,
      title: 'GeoPlant - Logar',
    },
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('./pages/auth/Signup.vue'),
    meta: {
      public: true,
      title: 'GeoPlant - Cadastrar',
    },
  },

  {
    path: '/atlas',
    name: 'atlas',
    component: () => import('./pages/Shell.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [{ label: 'Atlas', to: '/atlas' }],
      title: 'GeoPlant - Atlas',
    },
    children: [
      {
        path: '',
        component: () => import('./pages/Atlas.vue'),
      },
      {
        path: 'catalog',
        name: 'catalog',
        component: () => import('./pages/Catalog.vue'),
        meta: {
          breadcrumb: [{ label: 'Catalog', to: '/atlas/catalog' }],
          title: 'GeoPlant - Catalog',
        },
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
