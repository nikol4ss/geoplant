<script setup lang="ts">
import { loginUser } from '@/api/modules/auth/auth.api';
import type { LoginPayload } from '@/models/modules/auth/auth.model';
import router from '@/router';

import { type HTMLAttributes, ref } from 'vue';

import { toast } from 'vue-sonner';

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

    Toast.success(
      'Login realizado com sucesso',
      `${user?.name || ''} ${user?.surname || ''}, seja bem-vindo.`,
    );

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
              v-if="authStore.refreshToken"
              class="*:data-[slot=field-separator-content]:bg-card"
            >
              ou
            </FieldSeparator>

            <Field v-if="authStore.refreshToken">
              <Button type="button" @click="submitLoginRefresh">
                Continuar Logado
              </Button>
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
