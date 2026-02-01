<script setup lang="ts">
import { Bell } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';

const notificationsCount = ref(4);
</script>

<template>
  <Button variant="ghost" class="relative">
    <Bell class="h-4 w-4" />

    <span
      v-if="notificationsCount > 0"
      class="absolute -top-0.5 -right-0.5 flex h-4 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white"
    >
      {{ notificationsCount }}
    </span>
  </Button>
</template>
