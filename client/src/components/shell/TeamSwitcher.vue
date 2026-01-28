<script setup lang="ts">
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div class="flex size-10 items-center justify-center rounded-lg overflow-hidden
          min-w-8 min-h-8.25">

          <img
            src="@/assets/geoplant.png"
            alt="logo"
            class="h-full w-full object-contain shrink-0"
          />
        </div>

        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">GeoPlant</span>
          <span class="truncate text-xs">Atlas & Catalog</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
