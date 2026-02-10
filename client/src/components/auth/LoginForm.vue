<script setup lang="ts">
import type { LoginPayload } from '@/models/modules/auth/auth.dto';
import router from '@/router';

import { type HTMLAttributes, ref } from 'vue';

import { Power, PowerOff } from 'lucide-vue-next';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/stores/auth/auth.store';

import { cn } from '@/lib/classname.util';
import { Toast } from '@/lib/toast.util';

import { abbreviatedName } from '@/utils/abbreviatedName.util';
import { parseApiError } from '@/utils/parseApiError.util';

import DialogToggle from '../tooltip/DialogToggle.vue';
import PasswordInput from '../tooltip/PasswordInput.vue';

const authStore = useAuthStore();

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const loading = ref(false);
const form = ref<LoginPayload>({
  email: '',
  password: '',
});

const handleLoginSubmit = async () => {
  loading.value = true;

  try {
    await Toast.promise(authStore.login(form.value), {
      loading: 'Acessando sua conta',
      success: 'Login realizado. Bem-vindo.',
      error: (err) => parseApiError(err),
    });

    if (!authStore.isLoggedIn) {
      throw new Error('Sessão inválida após login');
    }

    await router.replace({ name: 'atlas' });
  } finally {
    loading.value = false;
  }
};

const handleSessionRestore = async () => {
  loading.value = true;

  try {
    await Toast.promise(authStore.refresh(), {
      loading: 'Conectando à sua conta',
      success: `Sessão Reconectada \n Bem-vindo de volta, ${authStore.user?.name || ''} ${authStore.user?.surname || ''}.`,
      error: (err) => parseApiError(err),
    });

    await router.replace({ name: 'atlas' });
  } catch {
    authStore.logout();
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  authStore.logout();
  Toast.warning('Sessão encerrada.');
  await router.replace({ name: 'login' });
};
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0 rounded-lg">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8" @submit.prevent="handleLoginSubmit()">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">
                Bem-vindo ao <span class="text-primary">GeoPlant</span>
              </h1>
              <p class="text-muted-foreground text-balance">Acesse sua Conta</p>
            </div>

            <Field>
              <FieldLabel for="email"> E-mail </FieldLabel>
              <Input
                v-model="form.email"
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel for="password"> Senha </FieldLabel>
              <PasswordInput v-model="form.password" />
            </Field>

            <Field class="mt-5">
              <Button type="submit"> Entrar </Button>
            </Field>

            <FieldSeparator
              v-if="authStore.user"
              class="*:data-[slot=field-separator-content]:bg-card"
            >
              ou
            </FieldSeparator>

            <Field v-if="authStore.user">
              <div class="flex items-center gap-3 border p-4 rounded-lg">
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarFallback class="rounded-lg">{{
                    abbreviatedName(authStore.user?.name, authStore.user?.surname)
                  }}</AvatarFallback>
                </Avatar>

                <div class="flex flex-col text-left text-sm leading-tight">
                  <span class="truncate font-medium"
                    >{{ authStore.user?.name || '' }} {{ authStore.user?.surname || '' }}</span
                  >
                  <span class="truncate text-xs">{{ authStore.user?.email || '' }}</span>
                </div>

                <div class="ml-auto flex items-center gap-2">
                  <DialogToggle
                    title="Deseja sair da sua conta?"
                    description="Ao sair, será necessário fazer login novamente para acessar sua conta."
                    confirmText="Deslogar"
                    cancelText="Manter Sessão"
                    @confirm="handleLogout"
                  >
                    <template #trigger>
                      <Button variant="outline">
                        <PowerOff class="h-4 w-4 text-destructive" />
                      </Button>
                    </template>
                  </DialogToggle>

                  <Button type="button" variant="outline" @click="handleSessionRestore()">
                    <Power class="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </div>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Não tem uma conta?
            </FieldSeparator>

            <FieldDescription class="text-center">
              <RouterLink :to="{ name: 'signup' }">Criar uma Conta</RouterLink>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div class="bg-muted/70 relative hidden md:flex items-center justify-center">
          <img src="@/assets/geoplant.png" alt="logo" class="size-35 object-contain" />
        </div>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e
      <a href="#">Política de Privacidade</a>.
    </FieldDescription>
  </div>
</template>
