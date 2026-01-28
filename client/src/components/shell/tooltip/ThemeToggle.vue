<script setup lang="ts">
import { Sun, Moon} from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core';
import { Button } from '@/components/ui/button';

const mode = useColorMode();

function toggleTheme() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <Button class="cursor-pointer" variant="ghost" @click="toggleTheme">
    <Sun
      icon="radix-icons:moon"
      class="h-4 w-4 rotate-0 scale-100 transition-all dark:scale-0"
    />
    <Moon
      icon="radix-icons:sun"
      class="h-4 w-4 scale-0 absolute transition-all dark:scale-100"
    />
  </Button>
</template>
