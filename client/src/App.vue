<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <router-view />
  <Toaster rich-colors theme="system" :expand="true" position="bottom-right" />
</template>
