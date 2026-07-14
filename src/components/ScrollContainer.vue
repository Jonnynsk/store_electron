<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Scrollbar from 'smooth-scrollbar';

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
});

const containerRef = ref(null);
let scrollbar = null;

onMounted(() => {
  if (!containerRef.value) {
    return;
  }

  scrollbar = Scrollbar.init(containerRef.value, {
    damping: 0.08,
    alwaysShowTracks: false,
  });
});

onBeforeUnmount(() => {
  scrollbar?.destroy();
});
</script>

<template>
  <component :is="tag" ref="containerRef" class="scroll-container">
    <slot />
  </component>
</template>

<style scoped>
.scroll-container {
  height: 100%;
  overflow: hidden;
}
</style>
