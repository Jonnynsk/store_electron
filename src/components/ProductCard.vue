<script setup>
import { PriceFormatter } from '@/services/CatalogService';

defineProps({
  item: {
    type: Object,
    required: true,
  },
  groupName: {
    type: String,
    default: '',
  },
});

defineEmits(['open']);

const formatPrice = (price) => PriceFormatter.formatKopecks(price);
</script>

<template>
  <button type="button" class="product-card card-interactive" @click="$emit('open', item)">
    <div class="product-card__body">
      <span class="product-card__name">{{ item.product.name }}</span>
      <p v-if="item.product.description" class="product-card__description">
        {{ item.product.description }}
      </p>
      <span v-if="groupName" class="product-card__group">{{ groupName }}</span>
    </div>
    <span class="product-card__price">{{ formatPrice(item.product.price) }}</span>
  </button>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-md);
  min-height: 148px;
  padding: var(--space-md);
  text-align: left;
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.product-card__name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.35;
}

.product-card__description {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__group {
  margin-top: var(--space-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.product-card__price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-price);
  letter-spacing: -0.02em;
}
</style>
