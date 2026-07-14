import { describe, expect, it } from 'vitest';
import {
  CatalogSearch,
  CatalogTreeBuilder,
  PriceFormatter,
} from '@/services/CatalogService';

const groups = [
  { id: 1, idParent: null, name: 'Root A' },
  { id: 2, idParent: 1, name: 'Child A1' },
  { id: 3, idParent: null, name: 'Root B' },
];

const items = [
  {
    id: 10,
    idGroup: 2,
    product: {
      id: 100,
      name: 'Капучино',
      price: 29000,
      description: 'Молочный кофе',
    },
  },
  {
    id: 11,
    idGroup: 2,
    product: {
      id: 101,
      name: 'Латте',
      price: 32000,
      description: 'Нежный напиток',
    },
  },
];

describe('CatalogTreeBuilder', () => {
  it('builds nested tree', () => {
    const builder = new CatalogTreeBuilder(groups);
    const tree = builder.buildTree();

    expect(tree).toHaveLength(2);
    expect(tree[0].children[0].name).toBe('Child A1');
  });

  it('returns breadcrumb path', () => {
    const builder = new CatalogTreeBuilder(groups);
    expect(builder.getPath(2).map((group) => group.name)).toEqual(['Root A', 'Child A1']);
  });
});

describe('CatalogSearch', () => {
  it('finds products by query', () => {
    const search = new CatalogSearch(items);
    expect(search.search('лат')).toHaveLength(1);
    expect(search.search('кофе')).toHaveLength(1);
  });

  it('does not match technical unitType in index', () => {
    const search = new CatalogSearch([
      {
        id: 20,
        idGroup: 1,
        product: {
          id: 200,
          name: 'Сэндвич',
          description: 'С хлебом',
          unitType: 'г',
        },
      },
      {
        id: 21,
        idGroup: 1,
        product: {
          id: 201,
          name: 'Латте',
          description: 'Напиток',
          unitType: 'мл',
        },
      },
    ]);

    expect(search.search('г')).toHaveLength(0);
    expect(search.search('мл')).toHaveLength(0);
    expect(search.search('бергамот')).toHaveLength(0);
  });

  it('finds products by description', () => {
    const search = new CatalogSearch([
      {
        id: 22,
        idGroup: 1,
        product: {
          id: 202,
          name: 'Earl Grey',
          description: 'Чёрный чай с бергамотом',
          unitType: 'мл',
        },
      },
    ]);

    expect(search.search('бергамот')).toHaveLength(1);
  });
});

describe('PriceFormatter', () => {
  it('formats kopecks as rubles', () => {
    expect(PriceFormatter.formatKopecks(29000)).toContain('290');
  });
});
