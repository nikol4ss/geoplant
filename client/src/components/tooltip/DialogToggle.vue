<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Separator from '../ui/separator/Separator.vue';

const props = defineProps<{
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <Separator />
        <DialogDescription>{{ props.description }}</DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="secondary" @click="$emit('cancel')">
          {{ props.cancelText || 'Cancelar' }}
        </Button>
        <Button variant="destructive" @click="$emit('confirm')">
          {{ props.confirmText || 'Confirmar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
