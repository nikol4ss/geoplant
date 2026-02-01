<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: 'password'
  }
})

defineEmits(['update:modelValue'])

const show = ref(false)
const toggle = () => (show.value = !show.value)
</script>


<template>
  <div class="grid gap-3 relative">
    <Input
      :id="id"
      :type="show ? 'text' : 'password'"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      v-bind="$attrs"
      required
    />

    <button
      type="button"
      class="absolute right-4 top-[1.1rem] -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
      @click="toggle"
    >
      <component :is="show ? EyeOff : Eye" class="h-4 w-4" />
    </button>
  </div>
</template>

