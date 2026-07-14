import IconArchive from '~icons/lucide/archive';
import IconCake from '~icons/lucide/cake';
import IconCoffee from '~icons/lucide/coffee';
import IconCookie from '~icons/lucide/cookie';
import IconCupSoda from '~icons/lucide/cup-soda';
import IconEggFried from '~icons/lucide/egg-fried';
import IconFolder from '~icons/lucide/folder';
import IconLeaf from '~icons/lucide/leaf';
import IconMilk from '~icons/lucide/milk';
import IconSandwich from '~icons/lucide/sandwich';
import IconSnowflake from '~icons/lucide/snowflake';
import IconSparkles from '~icons/lucide/sparkles';
import IconUtensilsCrossed from '~icons/lucide/utensils-crossed';

const ICON_BY_KEY = {
  'cup-soda': IconCupSoda,
  'utensils-crossed': IconUtensilsCrossed,
  cake: IconCake,
  coffee: IconCoffee,
  leaf: IconLeaf,
  sparkles: IconSparkles,
  milk: IconMilk,
  snowflake: IconSnowflake,
  'egg-fried': IconEggFried,
  sandwich: IconSandwich,
  cookie: IconCookie,
  folder: IconFolder,
  archive: IconArchive,
};

const KEYWORD_ICON_KEYS = [
  { keys: ['эспресс', 'кофе', 'капуч', 'латте', 'раф'], icon: 'coffee' },
  { keys: ['молоч'], icon: 'milk' },
  { keys: ['холод'], icon: 'snowflake' },
  { keys: ['чай', 'чёрн', 'черн', 'зелён', 'зелен'], icon: 'leaf' },
  { keys: ['автор'], icon: 'sparkles' },
  { keys: ['напит'], icon: 'cup-soda' },
  { keys: ['завтрак'], icon: 'egg-fried' },
  { keys: ['сэндвич', 'бургер'], icon: 'sandwich' },
  { keys: ['еда'], icon: 'utensils-crossed' },
  { keys: ['торт'], icon: 'cake' },
  { keys: ['пирож', 'десерт', 'выпеч'], icon: 'cookie' },
];

function resolveIconKey(group) {
  const logo = group?.logo;

  if (typeof logo === 'string' && logo.startsWith('lucide:')) {
    return logo.slice('lucide:'.length);
  }

  const lower = (group?.name ?? '').toLowerCase();

  for (const { keys, icon } of KEYWORD_ICON_KEYS) {
    if (keys.some((key) => lower.includes(key))) {
      return icon;
    }
  }

  return 'folder';
}

export function resolveGroupIcon(group) {
  const key = resolveIconKey(group);
  return ICON_BY_KEY[key] ?? IconFolder;
}

export { IconCoffee, IconArchive };
