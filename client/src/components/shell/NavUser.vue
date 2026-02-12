<script setup lang="ts">
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';

import { Bolt, ChevronsUpDown, LogOut, User } from 'lucide-vue-next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { useAuthStore } from '@/stores/auth/auth.store';

import { Toast } from '@/lib/toast.util';

import { abbreviatedName } from '@/utils/abbreviatedName.util';
import { occupationTranslation } from '@/utils/roleTraslation.util';

const props = defineProps<{
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>();

const { isMobile } = useSidebar();

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  authStore.logout();
  Toast.warning('Sessão encerrada');
  await router.replace({ name: 'login' });
};

onMounted(async () => {
  if (authStore.refreshToken && !authStore.user) {
    try {
      await authStore.refresh();
    } catch {}
  }
});
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                {{ abbreviatedName(authStore.user?.name, authStore.user?.surname) }}</AvatarFallback
              >
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium"
                >{{ authStore.user?.name }} {{ authStore.user?.surname }}</span
              >
              <span class="truncate text-xs text-muted-foreground">
                {{
                  authStore.user?.occupation ? occupationTranslation[authStore.user.occupation] : ''
                }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  {{
                    abbreviatedName(authStore.user?.name, authStore.user?.surname)
                  }}</AvatarFallback
                >
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold"
                  >{{ authStore.user?.name }} {{ authStore.user?.surname }}</span
                >
                <span class="truncate text-sm text-muted-foreground">{{
                  authStore.user?.email
                }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              Meu Perfil
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bolt />
              Configurações
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
