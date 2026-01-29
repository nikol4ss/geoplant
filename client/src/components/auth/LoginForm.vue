<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

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

import { cn } from '@/lib/utils';

import PasswordInput from './tooltip/PasswordInput.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0 rounded-lg">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-10">
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">Welcome <span class="text-primary">GeoPlant</span></h1>

              <p class="text-muted-foreground text-balance">Access your account</p>
            </div>

            <Field>
              <FieldLabel for="email"> E-mail </FieldLabel>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </Field>

            <Field>
              <FieldLabel for="password"> Password </FieldLabel>

              <PasswordInput />
            </Field>

            <Field>
              <Button type="submit"> Login </Button>
            </Field>

            <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
              Don't have an account?
            </FieldSeparator>

            <FieldDescription class="text-center">
              <RouterLink to="/auth/signup"> Create an Account </RouterLink>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div class="bg-muted relative hidden md:flex items-center justify-center">
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
