<script setup lang="ts">
import { type HTMLAttributes } from 'vue';
import { ref } from 'vue';

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

import { cn } from '@/lib/utils';

import PasswordInput from './tooltip/PasswordInput.vue';

const organizationType = ref<'none' | 'company' | 'institution'>('none');
const occupation = ref<string | null>(null);

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0 rounded-lg">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">
                Bem-vindo ao <span class="text-primary">GeoPlant</span>
              </h1>
              <p class="text-muted-foreground text-balance">Crie sua Conta</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel for="name"> Nome </FieldLabel>
                <Input id="name" type="text" placeholder="Seu nome" required />
              </Field>

              <Field>
                <FieldLabel for="surname"> Sobrenome </FieldLabel>
                <Input id="surname" type="text" placeholder="Seu sobrenome" required />
              </Field>
            </div>

            <Field>
              <FieldLabel> Organização </FieldLabel>
              <Tabs v-model="organizationType" default-value="none">
                <TabsList class="w-full">
                  <TabsTrigger value="none">Nenhum</TabsTrigger>
                  <TabsTrigger value="company">Empresa</TabsTrigger>
                  <TabsTrigger value="institution">Instituição</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>

            <Field v-if="organizationType === 'company'">
              <Input id="cnpj" type="text" placeholder="Nome da Empresa" />
            </Field>

            <Field v-else-if="organizationType === 'institution'">
              <Input id="institution_code" type="text" placeholder="Nome da Instituição" />
            </Field>

            <Field>
              <FieldLabel>Ocupação</FieldLabel>
              <Select v-model="occupation" required>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Selecione a ocupação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ocupação</SelectLabel>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="engineer">Engenheiro</SelectItem>
                    <SelectItem value="researcher">Pesquisador</SelectItem>
                    <SelectItem value="botanist">Botânico</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel for="email"> E-mail </FieldLabel>
              <Input id="email" type="email" placeholder="email@exemplo.com" required />
            </Field>

            <Field>
              <FieldLabel for="password"> Senha </FieldLabel>
              <PasswordInput />
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
