# Coffee Store — Нативный каталог (Electron + Vue 3)

Интерактивное desktop-приложение витрины кофейни (терминал самообслуживания).  
Акцент на производительность UI, изоляцию процессов (Context Bridge) и корректную работу с файловой системой в упакованном приложении (ASAR).

## Архитектурные решения

- **Безопасный IPC-мост.** `contextIsolation: true`, `nodeIntegration: false`. Renderer не имеет доступа к Node.js и `fs`. Справочник читается в Main-процессе (`fs.readFile`) и отдаётся в UI через `preload` / `contextBridge`.
- **Поиск без мусора в индексе.** Глобальный поиск по `name` + `description`. Технические поля (`unitType`, `id`, вес) в haystack не попадают — иначе запрос `"г"` совпадал бы со всеми позициями в граммах. Ввод не блокирует UI: локальный стейт инпута + debounce (300 ms) перед мутацией Pinia.
- **Доступ к товарам категории за O(1).** При загрузке однократно строится `Map<idGroup, items[]>`. Смена раздела — lookup по ключу, без линейного прохода / рекурсии по сырому массиву.
- **Защита от deep reactivity.** Тяжёлые сервисы (`CatalogSearch`, `CatalogTreeBuilder`) и индексы обёрнуты в `markRaw()` — без Proxy на Maps/классах и без лишней реактивности на больших справочниках.
- **Production-ready пути.** `catalog.json` вынесен в `extraResources` (вне asar). В runtime путь резолвится через `process.resourcesPath` (`AppPaths`) — справочник можно подменить без пересборки бинарника.

## Стек

| Слой | Технологии |
| --- | --- |
| Core | Electron **43**, Node.js >= 18 |
| UI | Vue 3 (Composition API), Pinia |
| Tooling | Vite 6, `unplugin-icons` (Iconify / Lucide) |
| UX | smooth-scrollbar, Transition/`mode="out-in"` |
| Tests | Vitest + Vue Test Utils |

## Запуск и разработка

```bash
npm install
```

**Режим разработки:**

```bash
npm run dev
```

Vite (HMR) + Electron. Изменения в `electron/` — автоперезапуск main/preload.

**Production-сборка:**

```bash
npm run dist
```

Бинарник / инсталлятор под текущую ОС → `release/`  
(Windows: `Coffee Store Setup *.exe`; для быстрой проверки без инсталлятора — `npm run pack` → `release/win-unpacked/`).

### Скрипты

| Команда | Описание |
| --- | --- |
| `npm run dev` | Vite + Electron |
| `npm run dev:debug` | То же + DevTools в renderer |
| `npm run preview` | `build` + локальный `electron .` (без packager) |
| `npm run pack` | Unpacked-сборка (`release/win-unpacked/`) |
| `npm run dist` | Полная сборка (NSIS / DMG / AppImage) |
| `npm test` | Unit/UI: дерево, поиск, SearchBar |

> **Windows:** в `package.json` отключена подпись (`signAndEditExecutable: false`), чтобы pack/dist работали без Developer Mode. Для продакшен-релиза нужен code signing.

## Структура проекта

```text
electron/          main process, preload, AppPaths
catalog/           справочник на диске (не бандлится в renderer)
src/
  pages/           CatalogPage
  components/      UI
  store/           Pinia (индексы + markRaw)
  services/        CatalogTreeBuilder, CatalogSearch, PriceFormatter
  api/             electronAPI → IPC
```

## Справочник

Файл читается с диска при старте (не `import` JSON в Vue-бандл).

- Dev: `<project>/catalog/catalog.json`
- Prod: `<install-dir>/resources/catalog/catalog.json`

<details>
<summary>Формат <code>catalog.json</code></summary>

```json
{
  "groups": [
    { "id": 1, "idParent": null, "name": "Напитки", "logo": "lucide:cup-soda" }
  ],
  "items": [
    {
      "id": 100,
      "idGroup": 1,
      "product": {
        "id": 1000,
        "name": "Капучино",
        "price": 29000,
        "description": "Баланс эспрессо и молока",
        "weight": 300,
        "unitType": "мл",
        "nutrition": { "calories": 120, "protein": 6.5, "fat": 5.2, "carbs": 10.8 }
      }
    }
  ]
}
```

`price` — в копейках. `logo` — ключ Iconify (`lucide:…`) для иконки раздела.

</details>
