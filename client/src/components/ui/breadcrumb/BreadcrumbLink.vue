<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import type { PrimitiveProps } from 'reka-ui';
import { Primitive } from 'reka-ui';

import { cn } from '@/lib/classname.util';

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'a',
});
</script>

<template>
  <Primitive
    data-slot="breadcrumb-link"
    :as="as"
    :as-child="asChild"
    :class="cn('hover:text-foreground transition-colors', props.class)"
  >
    <slot />
  </Primitive>
</template>
