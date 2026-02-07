<script setup lang="ts">
import { loginUser } from '@/api/modules/auth/auth.api';
import type { LoginPayload } from '@/models/modules/auth/auth.model';
import router from '@/router';

import { type HTMLAttributes, onMounted, ref } from 'vue';

import { Power, PowerOff } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

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

import { useAuthStore } from '@/stores/auth.store';

import { Toast, parseApiError } from '@/lib/toast.util';
import { cn, delay } from '@/lib/utils';

import PasswordInput from '../tooltip/PasswordInput.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const form = ref<LoginPayload>({
  email: '',
  password: '',
});

// TODO: melhora funções e reatividade do estado
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);

const submitLogin = async () => {
  loading.value = true;
  error.value = null;

  const loadingId = toast.loading('Acessando sua conta');

  try {
    await delay(500);

    const response = await loginUser(form.value);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erro inesperado');
    }

    const { accessToken, refreshToken } = response.data;
    const user = response.data.user;

    authStore.setTokens(accessToken, refreshToken, user);

    toast.dismiss(loadingId);

    Toast.success('Login realizado com sucesso seja bem-vindo.');

    router.push('/atlas');
  } catch (err: unknown) {
    toast.dismiss(loadingId);

    error.value = parseApiError(err)[0] ?? 'Erro inesperado';
    Toast.error(parseApiError(err));
  } finally {
    loading.value = false;
  }
};

const submitLoginRefresh = async () => {
  if (!authStore.refreshToken) {
    Toast.error('Não há refresh token disponível.');
    return;
  }

  loading.value = true;
  const loadingId = toast.loading('Logando automaticamente');

  try {
    await authStore.refresh();
    toast.dismiss(loadingId);

    Toast.success(
      'Login realizado com sucesso',
      `${authStore.user?.name || ''} ${authStore.user?.surname || ''}, bem-vindo de volta.`,
    );
    router.push('/atlas');
  } catch (err: unknown) {
    toast.dismiss(loadingId);
    Toast.error(parseApiError(err));
  } finally {
    loading.value = false;
  }
};

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}

onMounted(async () => {
  if (authStore.refreshToken && !authStore.user) {
    try {
      await authStore.refresh();
    } catch {
      authStore.logout();
    }
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0 rounded-lg">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8" @submit.prevent="submitLogin">
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
                  <AvatarFallback class="rounded-lg">NK</AvatarFallback>
                </Avatar>

                <div class="flex flex-col text-left text-sm leading-tight">
                  <span class="truncate font-medium"
                    >{{ authStore.user?.name || '' }} {{ authStore.user?.surname || '' }}</span
                  >
                  <span class="truncate text-xs">{{ authStore.user?.email || '' }}</span>
                </div>

                <div class="ml-auto flex items-center gap-2">
                  <Button type="button" variant="secondary" @click="handleLogout">
                    <PowerOff class="h-4 w-4 text-destructive" />
                  </Button>

                  <Button type="button" variant="secondary" @click="submitLoginRefresh">
                    <Power class="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </div>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Não tem uma conta?
            </FieldSeparator>

            <FieldDescription class="text-center">
              <RouterLink to="/auth/signup"> Criar uma Conta </RouterLink>
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
