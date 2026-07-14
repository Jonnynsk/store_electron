<script setup>
import { computed } from 'vue';
import IconArrowLeft from '~icons/lucide/arrow-left';
import IconChevronRight from '~icons/lucide/chevron-right';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['navigate']);

/** Parent group or root (null). */
const parentTarget = computed(() => {
  if (props.items.length <= 1) {
    return null;
  }

  return props.items[props.items.length - 2].id;
});

const trail = computed(() =>
  props.items.map((item, index) => ({
    ...item,
    isCurrent: index === props.items.length - 1,
  })),
);

function goBack() {
  emit('navigate', parentTarget.value);
}

function goTo(id) {
  emit('navigate', id);
}
</script>

<template>
  <nav class="breadcrumb" aria-label="Навигация по каталогу">
    <button
      type="button"
      class="breadcrumb__back"
      aria-label="Назад на уровень выше"
      @click="goBack"
    >
      <IconArrowLeft class="breadcrumb__back-icon" aria-hidden="true" />
      <span>Назад</span>
    </button>

    <div class="breadcrumb__trail">
      <button type="button" class="breadcrumb__chip" @click="goTo(null)">
        Каталог
      </button>

      <template v-for="item in trail" :key="item.id">
        <IconChevronRight class="breadcrumb__sep" aria-hidden="true" />

        <button
          v-if="!item.isCurrent"
          type="button"
          class="breadcrumb__chip"
          @click="goTo(item.id)"
        >
          {{ item.name }}
        </button>
        <span v-else class="breadcrumb__current">{{ item.name }}</span>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 0 var(--space-xs);
}

.breadcrumb__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--surface-elevated);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.breadcrumb__back:hover {
  background: var(--surface-muted);
  border-color: var(--border-focus);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.breadcrumb__back:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.breadcrumb__back-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.breadcrumb__trail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  min-width: 0;
}

.breadcrumb__chip {
  border: none;
  background: var(--surface-muted);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.breadcrumb__chip:hover {
  background: color-mix(in srgb, var(--accent-primary-soft) 80%, var(--surface-muted));
  color: var(--text-primary);
}

.breadcrumb__chip:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.breadcrumb__current {
  padding: 6px 4px;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.breadcrumb__sep {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--text-subtle);
  stroke-width: 2;
}
</style>
