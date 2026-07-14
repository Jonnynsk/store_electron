<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import BreadcrumbNav from "@/components/BreadcrumbNav.vue";
import GroupBlock from "@/components/GroupBlock.vue";
import ProductBlock from "@/components/ProductBlock.vue";
import ProductDetail from "@/components/ProductDetail.vue";
import ScrollContainer from "@/components/ScrollContainer.vue";
import SearchBar from "@/components/SearchBar.vue";
import { useCatalogStore } from "@/store/useCatalog";
import { IconArchive, IconCoffee } from "@/utils/groupIcons";

const catalog = useCatalogStore();
const {
  breadcrumb,
  childGroups,
  currentGroup,
  currentItems,
  isLoading,
  isSearchMode,
  error,
  searchQuery,
  selectedProduct,
  topLevelGroups,
  orphanItems,
} = storeToRefs(catalog);

const localSearchQuery = ref(searchQuery.value);
let searchDebounceTimer = null;

function scheduleGlobalSearchUpdate(value) {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    catalog.setSearchQuery(value);
    searchDebounceTimer = null;
  }, 300);
}

function handleInput(value) {
  localSearchQuery.value = value;
  scheduleGlobalSearchUpdate(value);
}

const visibleGroups = computed(() => {
  if (isSearchMode.value) {
    return [];
  }

  return catalog.currentGroupId == null
    ? topLevelGroups.value
    : childGroups.value;
});

const groupLevelKey = computed(() => catalog.currentGroupId ?? "root");

const productListKey = computed(() => {
  if (isSearchMode.value) {
    return `search:${searchQuery.value}`;
  }

  return `group:${catalog.currentGroupId ?? "root"}`;
});

const currentGroupName = computed(() => currentGroup.value?.name ?? "");

const groupNameById = computed(() => catalog.groupNameById);

const showGroups = computed(
  () => !isSearchMode.value && visibleGroups.value.length > 0,
);

const showProducts = computed(
  () => currentItems.value.length > 0 || isSearchMode.value,
);

const showOrphanItems = computed(
  () =>
    !isSearchMode.value &&
    catalog.currentGroupId == null &&
    orphanItems.value.length > 0,
);

const hasSecondarySection = computed(
  () => showProducts.value || showOrphanItems.value,
);

const showGlobalEmpty = computed(
  () =>
    !isSearchMode.value &&
    visibleGroups.value.length === 0 &&
    currentItems.value.length === 0 &&
    orphanItems.value.length === 0,
);

const mainLayoutClass = computed(() => {
  if (showGlobalEmpty.value) {
    return "catalog-page__main--empty";
  }

  if (showGroups.value && hasSecondarySection.value) {
    return "catalog-page__main--both";
  }

  if (showGroups.value) {
    return "catalog-page__main--groups-only";
  }

  if (showProducts.value || showOrphanItems.value) {
    return "catalog-page__main--products-only";
  }

  return "catalog-page__main--empty";
});

function handleNavigate(id) {
  if (id == null) {
    catalog.goToRoot();
  } else {
    catalog.goToGroup(id);
  }
}

const selectedProductGroupName = computed(() => {
  if (!selectedProduct.value) {
    return "";
  }

  return groupNameById.value(selectedProduct.value.idGroup);
});

onMounted(() => {
  if (!catalog.rawItems.length && !catalog.isLoading) {
    catalog.fetchCatalog();
  }
});

watch(searchQuery, (value) => {
  if (value !== localSearchQuery.value) {
    localSearchQuery.value = value;
  }
});

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});
</script>

<template>
  <div class="catalog-page">
    <header class="catalog-page__header">
      <div class="catalog-page__header-inner">
        <div class="catalog-page__brand">
          <span class="catalog-page__logo" aria-hidden="true">
            <IconCoffee class="catalog-page__logo-icon" />
          </span>
          <div>
            <p class="catalog-page__eyebrow">Coffee Store</p>
            <h1>Меню</h1>
          </div>
        </div>
        <SearchBar
          :model-value="localSearchQuery"
          @update:model-value="handleInput"
        />
      </div>
    </header>

    <div class="catalog-page__body">
      <div class="catalog-page__container">
        <div v-if="isLoading" class="catalog-page__state">
          Загружаем справочник с диска…
        </div>
        <div
          v-else-if="error"
          class="catalog-page__state catalog-page__state--error"
        >
          {{ error }}
        </div>

        <main v-else class="catalog-page__main" :class="mainLayoutClass">
          <BreadcrumbNav
            v-if="!isSearchMode && breadcrumb.length"
            :items="breadcrumb"
            @navigate="handleNavigate"
          />

          <ScrollContainer v-if="showGroups" class="catalog-page__groups-scroll">
            <GroupBlock
              :level-key="groupLevelKey"
              :groups="visibleGroups"
              @enter="catalog.enterGroup"
            />
          </ScrollContainer>

          <ScrollContainer v-if="showOrphanItems" class="catalog-page__products-scroll">
            <ProductBlock
              section-variant="orphans"
              list-key="orphans"
              :items="orphanItems"
              @open-product="catalog.openProduct"
            />
          </ScrollContainer>

          <ScrollContainer v-if="showProducts" class="catalog-page__products-scroll">
            <ProductBlock
              :list-key="productListKey"
              :items="currentItems"
              :is-search-mode="isSearchMode"
              :current-group-name="currentGroupName"
              :group-name-by-id="groupNameById"
              @open-product="catalog.openProduct"
            />
          </ScrollContainer>

          <div v-if="showGlobalEmpty" class="catalog-page__empty">
            <IconArchive class="catalog-page__empty-icon" aria-hidden="true" />
            <p class="catalog-page__empty-title">Раздел пуст</p>
            <p class="catalog-page__empty-text">
              В «{{ currentGroupName || "этом разделе" }}» пока нет подкатегорий и
              товаров.
            </p>
          </div>
        </main>
      </div>
    </div>

    <ProductDetail
      v-if="selectedProduct"
      :item="selectedProduct"
      :group-name="selectedProductGroupName"
      @close="catalog.closeProduct"
    />
  </div>
</template>

<style scoped>
.catalog-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-base);
}

.catalog-page__header {
  flex-shrink: 0;
  background: var(--surface-header);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-default);
}

.catalog-page__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  max-width: var(--layout-max-width);
  margin: 0 auto;
  padding: var(--space-md) var(--layout-gutter);
  min-height: 68px;
}

.catalog-page__brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  min-width: 0;
}

.catalog-page__logo {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--accent-primary-soft);
  color: var(--accent-primary);
  flex-shrink: 0;
}

.catalog-page__logo-icon {
  width: 20px;
  height: 20px;
  stroke-width: 1.75;
}

.catalog-page__eyebrow {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.catalog-page__brand h1 {
  margin: 2px 0 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.catalog-page__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.catalog-page__container {
  height: 100%;
  max-width: var(--layout-max-width);
  margin: 0 auto;
  padding: var(--space-lg) var(--layout-gutter);
}

.catalog-page__state {
  padding: var(--space-lg) 0;
  color: var(--text-muted);
}

.catalog-page__state--error {
  color: var(--text-danger);
}

.catalog-page__main {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  min-height: 0;
}

.catalog-page__groups-scroll,
.catalog-page__products-scroll {
  min-height: 0;
  overflow: hidden;
}

.catalog-page__main--both .catalog-page__groups-scroll {
  flex: 0 1 30%;
  min-height: 140px;
}

.catalog-page__main--both .catalog-page__products-scroll,
.catalog-page__main--products-only .catalog-page__products-scroll,
.catalog-page__main--groups-only .catalog-page__groups-scroll {
  flex: 1 1 0;
}

.catalog-page__empty {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 0;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--surface-elevated) 72%, transparent);
  text-align: center;
}

.catalog-page__empty-icon {
  width: 32px;
  height: 32px;
  stroke-width: 1.5;
  color: var(--text-muted);
  opacity: 0.55;
}

.catalog-page__empty-title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
}

.catalog-page__empty-text {
  margin: 0;
  max-width: 28rem;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .catalog-page__header-inner {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-md);
  }

  .catalog-page__container {
    padding: var(--space-md);
  }

  .catalog-page__main {
    gap: var(--space-md);
  }

  .catalog-page__main--both .catalog-page__groups-scroll {
    min-height: 120px;
  }
}
</style>
