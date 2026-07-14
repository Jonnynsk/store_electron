<script setup>
import IconSearch from '~icons/lucide/search';
import IconX from '~icons/lucide/x';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const hasValue = computed(() => props.modelValue.length > 0);

function clearInput() {
  emit('update:modelValue', '');
}
</script>

<template>
  <label class="search">
    <IconSearch class="search__icon" aria-hidden="true" />
    <input
      class="search__input"
      type="search"
      placeholder="Поиск по меню…"
      :value="modelValue"
      enterkeyhint="search"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      type="button"
      class="search__clear"
      :class="{ 'search__clear--hidden': !hasValue }"
      :tabindex="hasValue ? 0 : -1"
      aria-label="Очистить поиск"
      @click="clearInput"
    >
      <IconX class="search__clear-icon" aria-hidden="true" />
    </button>
  </label>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  max-width: 400px;
  min-width: 200px;
  min-height: 44px;
  box-sizing: border-box;
  padding: 10px 14px;
  background: var(--surface-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.search:focus-within {
  background: var(--surface-input-focus);
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-primary-soft);
}

.search__icon {
  width: 18px;
  height: 18px;
  stroke-width: 1.75;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  outline: none;
  appearance: none;
}

.search__input::placeholder {
  color: var(--text-subtle);
}

.search__input::-webkit-search-decoration,
.search__input::-webkit-search-cancel-button,
.search__input::-webkit-search-results-button,
.search__input::-webkit-search-results-decoration {
  appearance: none;
  display: none;
}

.search__clear {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    opacity var(--transition-fast);
}

.search__clear--hidden {
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
}

.search__clear:hover {
  background: var(--surface-muted);
  color: var(--text-secondary);
}

.search__clear:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 1px;
}

.search__clear-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}
</style>
