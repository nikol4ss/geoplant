<script setup lang="ts">
import { createUser } from '@/api/modules/auth/auth.api';
import type { SignupPayload } from '@/models/modules/auth/auth.model';

import { type HTMLAttributes, watch } from 'vue';
import { ref } from 'vue';

import { useRouter } from 'vue-router';

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Toast, parseApiError } from '@/lib/toast.util';
import { cn, delay } from '@/lib/utils';

import PasswordInput from '../tooltip/PasswordInput.vue';

const router = useRouter();

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const loading = ref(false);
const error = ref<string | null>(null);

const form = ref<SignupPayload>({
  name: '',
  surname: '',
  email: '',
  password: '',
  organization: 'None',
  organization_name: undefined,
  occupation: undefined,
});

const submitSignup = async () => {
  loading.value = true;
  error.value = null;

  const loadingId = toast.loading('Criando sua conta. Aguarde um momento.');

  try {
    await delay(1000);
    await createUser(form.value);

    toast.dismiss(loadingId);
    router.push('/atlas'); // para test(finalizar jwt)

    await delay(200);

    Toast.success(
      'Conta criada com sucesso.',
      `${form.value.name} ${form.value.surname}, seja bem-vindo.`,
    );
  } catch (err: unknown) {
    toast.dismiss(loadingId);

    error.value = parseApiError(err)[0] ?? 'Erro inesperado';
    Toast.error(parseApiError(err));
  } finally {
    loading.value = false;
  }
};

watch(
  () => form.value.organization,
  (value) => {
    if (value === 'None') {
      form.value.organization_name = undefined;
    }
  },
);
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0 rounded-lg">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8" @submit.prevent="submitSignup">
          <FieldGroup>
            <header class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">
                Bem-vindo ao <span class="text-primary">GeoPlant</span>
              </h1>
              <p class="text-muted-foreground text-balance">Crie sua Conta</p>
            </header>

            <div class="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel for="name"> Nome </FieldLabel>
                <Input v-model="form.name" id="name" type="text" placeholder="Seu nome" required />
              </Field>

              <Field>
                <FieldLabel for="surname"> Sobrenome </FieldLabel>
                <Input
                  v-model="form.surname"
                  id="surname"
                  type="text"
                  placeholder="Seu sobrenome"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel> Organização </FieldLabel>
              <Tabs v-model="form.organization" default-value="None">
                <TabsList class="w-full">
                  <TabsTrigger value="None">Nenhum</TabsTrigger>
                  <TabsTrigger value="Company">Empresa</TabsTrigger>
                  <TabsTrigger value="Institution">Instituição</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>

            <Field v-if="form.organization === 'Company'">
              <Input
                v-model="form.organization_name"
                id="cnpj"
                type="text"
                placeholder="Nome da Empresa"
              />
            </Field>

            <Field v-else-if="form.organization === 'Institution'">
              <Input
                v-model="form.organization_name"
                id="institution_code"
                type="text"
                placeholder="Nome da Instituição"
              />
            </Field>

            <Field>
              <FieldLabel> Ocupação </FieldLabel>
              <Select v-model="form.occupation" required>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Selecione a ocupação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ocupação</SelectLabel>
                    <SelectItem value="Student"> Estudante </SelectItem>
                    <SelectItem value="Teacher"> Professor </SelectItem>
                    <SelectItem value="Engineer"> Engenheiro </SelectItem>
                    <SelectItem value="Researcher"> Pesquisador </SelectItem>
                    <SelectItem value="Botanist"> Botânico </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

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

            <Field>
              <Button type="submit"> Cadastrar-se </Button>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Você já tem uma conta?
            </FieldSeparator>

            <FieldDescription class="text-center">
              <RouterLink to="/auth/login"> Acessar Conta </RouterLink>
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
