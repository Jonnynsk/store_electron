<script setup>
import { computed } from 'vue';
import IconSearch from '~icons/lucide/search';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  listKey: {
    type: String,
    required: true,
  },
  isSearchMode: {
    type: Boolean,
    default: false,
  },
  sectionVariant: {
    type: String,
    default: 'default',
  },
  currentGroupName: {
    type: String,
    default: '',
  },
  groupNameById: {
    type: Function,
    default: () => '',
  },
});

defineEmits(['open-product']);

const title = computed(() => {
  if (props.isSearchMode) {
    return 'Результаты поиска';
  }

  if (props.sectionVariant === 'orphans') {
    return 'Дополнительно';
  }

  if (props.currentGroupName) {
    return props.currentGroupName;
  }

  return 'Товары';
});

const hint = computed(() => {
  if (props.isSearchMode) {
    return 'Найденные позиции по всему каталогу';
  }

  if (props.sectionVariant === 'orphans') {
    return 'Позиции вне основных разделов меню';
  }

  return 'Нажмите на карточку для подробностей';
});
</script>

<template>
  <section class="product-block">
    <header class="product-block__header">
      <div>
        <h2>{{ title }}</h2>
        <p>{{ hint }}</p>
      </div>
      <span v-if="items.length" class="product-block__count">{{ items.length }} шт.</span>
    </header>

    <Transition name="product-grid" mode="out-in">
      <div :key="listKey" class="product-block__content">
        <div v-if="items.length" class="product-block__grid">
          <ProductCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :group-name="isSearchMode ? groupNameById(item.idGroup) : ''"
            @open="$emit('open-product', $event)"
          />
        </div>

        <p v-else-if="isSearchMode" class="product-block__empty">
          <IconSearch class="product-block__empty-icon" aria-hidden="true" />
          Ничего не найдено. Попробуйте другой запрос.
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.product-block__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.product-block__header h2 {
  margin: 0 0 var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.product-block__header p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.45;
}

.product-block__count {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--surface-muted);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.product-block__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-md);
}

.product-block__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--surface-elevated) 72%, transparent);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  text-align: center;
}

.product-block__empty-icon {
  width: 28px;
  height: 28px;
  stroke-width: 1.5;
  opacity: 0.45;
}

.product-grid-enter-active,
.product-grid-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.product-grid-enter-from,
.product-grid-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
