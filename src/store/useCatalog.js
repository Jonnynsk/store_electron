import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { readCatalog } from '@/api/readCatalog';
import {
  CatalogSearch,
  CatalogTreeBuilder,
} from '@/services/CatalogService';

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    rawGroups: [],
    rawItems: [],
    currentGroupId: null,
    searchQuery: '',
    selectedProduct: null,
    isLoading: false,
    error: null,

    _itemsMap: markRaw(new Map()),
    _searchService: null,
    _treeService: null,
  }),

  getters: {
    isSearchMode(state) {
      return state.searchQuery.trim().length > 0;
    },

    breadcrumb() {
      if (this.currentGroupId == null || !this._treeService) {
        return [];
      }

      return this._treeService.getPath(this.currentGroupId);
    },

    currentGroup() {
      if (this.currentGroupId == null || !this._treeService) {
        return null;
      }

      return this._treeService.getGroup(this.currentGroupId);
    },

    childGroups() {
      if (!this._treeService) {
        return [];
      }

      return this._treeService.getChildren(this.currentGroupId);
    },

    currentItems(state) {
      if (this.isSearchMode && state._searchService) {
        return state._searchService.search(state.searchQuery);
      }

      if (state.currentGroupId == null) {
        return [];
      }

      return state._itemsMap.get(state.currentGroupId) ?? [];
    },

    orphanItems(state) {
      return state._itemsMap.get(null) ?? [];
    },

    topLevelGroups(state) {
      if (!state._treeService) {
        return [];
      }

      return state._treeService.getChildren(null);
    },

    groupNameById(state) {
      return (groupId) => {
        if (groupId == null) {
          return 'Вне разделов';
        }

        if (!state._treeService) {
          return 'Неизвестная группа';
        }

        return state._treeService.getGroup(groupId)?.name ?? 'Неизвестная группа';
      };
    },
  },

  actions: {
    async fetchCatalog() {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await readCatalog();

        this.rawGroups = data.groups ?? [];
        this.rawItems = data.items ?? [];

        this._searchService = markRaw(new CatalogSearch(this.rawItems));
        this._treeService = markRaw(new CatalogTreeBuilder(this.rawGroups));
        this._buildItemsIndex();
      } catch (err) {
        this.error = err.message ?? 'Неизвестная ошибка';
      } finally {
        this.isLoading = false;
      }
    },

    _buildItemsIndex() {
      const map = new Map();
      map.set(null, []);

      for (const item of this.rawItems) {
        const key = item.idGroup;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(item);
      }

      this._itemsMap = markRaw(map);
    },

    enterGroup(groupId) {
      this.currentGroupId = groupId;
      this.searchQuery = '';
      this.selectedProduct = null;
    },

    goToRoot() {
      this.currentGroupId = null;
      this.searchQuery = '';
      this.selectedProduct = null;
    },

    goToGroup(groupId) {
      this.currentGroupId = groupId;
      this.selectedProduct = null;
    },

    setSearchQuery(query) {
      this.searchQuery = query;
      this.selectedProduct = null;
    },

    openProduct(item) {
      this.selectedProduct = item;
    },

    closeProduct() {
      this.selectedProduct = null;
    },
  },
});
