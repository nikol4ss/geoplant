<script setup lang="ts">
import FieldLabel from '../ui/field/FieldLabel.vue';

defineProps<{
  label: string;
  required?: boolean;
  forId?: string;
}>();
</script>

<template>
  <FieldLabel :for="forId">
    {{ label }}
    <span v-if="required" class="text-xs -ml-[0.2rem] text-red-600">*</span>
  </FieldLabel>
</template>
