<script setup lang="ts">
import { computed } from 'vue';

import { RouterView, useRoute } from 'vue-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Separator from '@/components/ui/separator/Separator.vue';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue';

import AppSidebar from '@/components/shell/AppSidebar.vue';
import NotificationToggle from '@/components/tooltip/NotificationToggle.vue';
import RegisterToggle from '@/components/tooltip/RegisterToggle.vue';
import ThemeToggle from '@/components/tooltip/ThemeToggle.vue';

const route = useRoute();

const breadcrumbs = computed(() => {
  return (route.meta.breadcrumb as Array<{ label: string; to?: string }>) ?? [];
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(item, index) in breadcrumbs" :key="index">
                <BreadcrumbItem>
                  <BreadcrumbLink v-if="item.to && index < breadcrumbs.length - 1" :href="item.to">
                    {{ item.label }}
                  </BreadcrumbLink>

                  <BreadcrumbPage v-else>
                    {{ item.label }}
                  </BreadcrumbPage>
                </BreadcrumbItem>

                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto flex items-center gap-1 rounded-lg mx-4 border bg-background/80">
          <RegisterToggle />
          <NotificationToggle />
          <ThemeToggle />
        </div>
      </header>
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
