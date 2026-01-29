<script lang="ts">
export const description = "A login page with form and image."
</script>

<script setup lang="ts">
import SignupForm from '@/components/auth/SignupForm.vue';
import ThemeToggle from '@/components/shell/tooltip/ThemeToggle.vue';
</script>

<template>
  <div class="bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">

    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>

    <div class="w-full max-w-sm md:max-w-4xl">
      <SignupForm />
    </div>

  </div>
</template>
