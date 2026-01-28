<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

defineProps<{
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}>();
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Panel</SidebarGroupLabel>

    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <router-link :to="item.url" class="block">
          <SidebarMenuButton :tooltip="item.title" class="cursor-pointer">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </SidebarMenuButton>
        </router-link>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
