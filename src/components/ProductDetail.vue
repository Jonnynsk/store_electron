<script setup>
import { computed } from 'vue';
import { PriceFormatter } from '@/services/CatalogService';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  groupName: {
    type: String,
    default: '',
  },
});

defineEmits(['close']);

const product = computed(() => props.item.product);
const price = computed(() => PriceFormatter.formatKopecks(product.value.price));

const hasNutrition = computed(() => {
  const nutrition = product.value.nutrition;
  return nutrition && Object.keys(nutrition).length > 0;
});

const hasWeight = computed(
  () => product.value.weight != null && product.value.unitType,
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="overlay" @click.self="$emit('close')">
        <article class="detail">
          <button type="button" class="detail__close" aria-label="Закрыть" @click="$emit('close')">
            ×
          </button>

          <p v-if="groupName" class="detail__group">{{ groupName }}</p>
          <h2 class="detail__title">{{ product.name }}</h2>
          <p class="detail__price">{{ price }}</p>

          <p v-if="product.description" class="detail__description">
            {{ product.description }}
          </p>

          <dl v-if="hasWeight" class="detail__meta">
            <div>
              <dt>Объём / вес</dt>
              <dd>{{ product.weight }} {{ product.unitType }}</dd>
            </div>
          </dl>

          <section v-if="hasNutrition" class="detail__nutrition">
            <h3>КБЖУ на порцию</h3>
            <div class="detail__nutrition-grid">
              <div>
                <span>Ккал</span>
                <strong>{{ product.nutrition.calories }}</strong>
              </div>
              <div>
                <span>Белки</span>
                <strong>{{ product.nutrition.protein }} г</strong>
              </div>
              <div>
                <span>Жиры</span>
                <strong>{{ product.nutrition.fat }} г</strong>
              </div>
              <div>
                <span>Углеводы</span>
                <strong>{{ product.nutrition.carbs }} г</strong>
              </div>
            </div>
          </section>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: var(--space-lg);
  background: var(--surface-overlay);
  backdrop-filter: blur(6px);
}

.detail {
  position: relative;
  width: min(520px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-lg);
}

.detail__close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--border-subtle);
  color: var(--text-primary);
  font-size: 1.4rem;
  line-height: 1;
  transition: background var(--transition-fast);
}

.detail__close:hover {
  background: var(--border-default);
}

.detail__group {
  margin: 0 0 var(--space-sm);
  color: var(--text-subtle);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.detail__title {
  margin: 0 0 var(--space-sm);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
  padding-right: 40px;
}

.detail__price {
  margin: 0 0 var(--space-md);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-price);
  letter-spacing: -0.02em;
}

.detail__description {
  margin: 0 0 var(--space-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: 1.6;
}

.detail__meta {
  margin: 0 0 var(--space-lg);
}

.detail__meta div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--border-default);
}

.detail__meta dt {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.detail__meta dd {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.detail__nutrition h3 {
  margin: 0 0 var(--space-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.detail__nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-sm);
}

.detail__nutrition-grid div {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.detail__nutrition-grid span {
  display: block;
  margin-bottom: var(--space-xs);
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.detail__nutrition-grid strong {
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.24s ease;
}

.modal-enter-active .detail,
.modal-leave-active .detail {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .detail,
.modal-leave-to .detail {
  transform: scale(0.92) translateY(12px);
}

@media (max-width: 640px) {
  .detail__nutrition-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
