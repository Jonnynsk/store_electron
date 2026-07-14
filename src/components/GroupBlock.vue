<script setup>
import { resolveGroupIcon } from "@/utils/groupIcons";

defineProps({
  groups: {
    type: Array,
    required: true,
  },

  levelKey: {
    type: [String, Number],
    required: true,
  },
});

defineEmits(["enter"]);
</script>

<template>
  <section class="group-block">
    <header class="group-block__header">
      <h2>Разделы</h2>
    </header>

    <Transition name="group-grid" mode="out-in">
      <div :key="levelKey" class="group-block__content">
        <div class="group-block__grid">
          <button
            v-for="group in groups"
            :key="group.id"
            type="button"
            class="group-card card-interactive"
            @click="$emit('enter', group.id)"
          >
            <span class="group-card__icon-wrap" aria-hidden="true">
              <component
                :is="resolveGroupIcon(group)"
                class="group-card__icon"
              />
            </span>

            <span class="group-card__title">{{ group.name }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.group-block__header {
  margin-bottom: var(--space-md);
}

.group-block__header h2 {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.group-block__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-md);
}

.group-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  min-height: 128px;
  padding: var(--space-md);
  text-align: left;
}

.group-card__icon-wrap {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--accent-primary-soft);
  color: var(--accent-primary);
}

.group-card__icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.75;
}

.group-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: 1.3;
}

.group-grid-enter-active,
.group-grid-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.group-grid-enter-from,
.group-grid-leave-to {
  opacity: 0;

  transform: translateY(6px);
}
</style>
