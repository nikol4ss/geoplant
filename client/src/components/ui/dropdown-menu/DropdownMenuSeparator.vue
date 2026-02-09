<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';

import type { HTMLAttributes } from 'vue';

import type { DropdownMenuSeparatorProps } from 'reka-ui';
import { DropdownMenuSeparator } from 'reka-ui';

import { cn } from '@/lib/classname.util';

const props = defineProps<
  DropdownMenuSeparatorProps & {
    class?: HTMLAttributes['class'];
  }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <DropdownMenuSeparator
    data-slot="dropdown-menu-separator"
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
