/**
 * @typedef {Object} Group
 * @property {number|string} id
 * @property {number|string|null} idParent
 * @property {string} name
 * @property {string|null} [logo]  lucide:icon-name или null
 */

/**
 * @typedef {Object} Nutrition
 * @property {number} calories
 * @property {number} protein
 * @property {number} fat
 * @property {number} carbs
 */

/**
 * @typedef {Object} Product
 * @property {number|string} id
 * @property {string} name
 * @property {number|null} [price]       
 * @property {string|null} [description]
 * @property {number|null} [weight]
 * @property {string|null} [unitType]
 * @property {Nutrition|null} [nutrition]
 */

/**
 * @typedef {Object} CatalogItem
 * @property {number|string} id
 * @property {number|string|null} idGroup
 * @property {Product} product
 */

export class PriceFormatter {
  static formatKopecks(kopecks) {
    if (kopecks == null) {
      return '—';
    }

    const numeric = Number(kopecks);
    if (!Number.isFinite(numeric)) {
      return '—';
    }

    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numeric / 100);
  }
}

export class CatalogTreeBuilder {
  /** @param {Group[]} groups */
  constructor(groups = []) {
    this.groups = groups;
    this.groupMap = new Map(groups.map((group) => [group.id, group]));
    this.childrenMap = new Map();

    for (const group of groups) {
      const parentId = group.idParent ?? null;
      const key = parentId === '' ? null : parentId;

      if (!this.childrenMap.has(key)) {
        this.childrenMap.set(key, []);
      }

      this.childrenMap.get(key).push(group);
    }

    if (!this.childrenMap.has(null)) {
      this.childrenMap.set(null, []);
    }
  }

  getChildren(parentId = null) {
    const key = parentId == null || parentId === '' ? null : parentId;
    return this.childrenMap.get(key) ?? [];
  }

  getGroup(groupId) {
    return this.groupMap.get(groupId) ?? null;
  }

  getPath(groupId) {
    const path = [];
    let currentId = groupId;

    while (currentId != null) {
      const group = this.groupMap.get(currentId);
      if (!group) {
        break;
      }

      path.unshift(group);
      currentId = group.idParent;
    }

    return path;
  }

  buildTree() {
    const map = new Map();
    const roots = [];

    for (const group of this.groups) {
      map.set(group.id, { ...group, children: [] });
    }

    for (const group of this.groups) {
      const node = map.get(group.id);

      if (group.idParent == null || !map.has(group.idParent)) {
        roots.push(node);
      } else {
        const parent = map.get(group.idParent);
        if (!parent) {
          roots.push(node);
          continue;
        }

        parent.children.push(node);
      }
    }

    return roots;
  }
}

export class CatalogSearch {
  /** @param {CatalogItem[]} items */
  constructor(items = []) {
    this.items = items;
    this.index = items.map((item) => {
      const product = item.product ?? {};

      return [
        product.name,
        product.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    });
  }

  search(query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const results = [];

    for (let i = 0; i < this.items.length; i += 1) {
      if (this.index[i].includes(normalizedQuery)) {
        results.push(this.items[i]);
      }
    }

    return results;
  }
}
