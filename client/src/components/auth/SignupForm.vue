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
              <h1 class="text-2xl font-bold">Welcome <span class="text-primary">GeoPlant</span></h1>
              <p class="text-muted-foreground text-balance">Create your account</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel for="name"> Name </FieldLabel>
                <Input id="name" type="text" placeholder="Your name" required />
              </Field>

              <Field>
                <FieldLabel for="surname"> Surname </FieldLabel>
                <Input id="surname" type="text" placeholder="Your surname" required />
              </Field>
            </div>

            <Field>
              <FieldLabel> Organization </FieldLabel>
              <Tabs v-model="organizationType" default-value="none">
                <TabsList class="w-full">
                  <TabsTrigger value="none">None</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="institution">Institution</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>

            <Field v-if="organizationType === 'company'">
              <Input id="cnpj" type="text" placeholder="00.000.000/0000-00" />
            </Field>

            <Field v-else-if="organizationType === 'institution'">
              <Input id="institution_code" type="text" placeholder="Enter CNPq or MEC code" />
            </Field>

            <Field>
              <FieldLabel>Occupation</FieldLabel>
              <Select v-model="occupation">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select the occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Occupation</SelectLabel>
                    <SelectItem value="student"> Student </SelectItem>
                    <SelectItem value="teacher"> Teacher </SelectItem>
                    <SelectItem value="engineer"> Engineer </SelectItem>
                    <SelectItem value="researcher"> Researcher </SelectItem>
                    <SelectItem value="botanist"> Botanist </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel for="email"> E-mail </FieldLabel>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </Field>

            <Field>
              <FieldLabel for="password"> Password </FieldLabel>

              <PasswordInput />
            </Field>

            <Field>
              <Button type="submit"> Signup </Button>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Do you already have an account?
            </FieldSeparator>

            <FieldDescription class="text-center">
              <RouterLink to="/auth/login"> Access Account </RouterLink>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div class="bg-muted/70 relative hidden md:flex items-center justify-center">
          <img src="@/assets/geoplant.png" alt="logo" class="size-35 object-contain" />
        </div>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      By clicking continue, you agree to our <a href="#">Terms of Service</a> and
      <a href="#">Privacy Policy</a>.
    </FieldDescription>
  </div>
</template>
