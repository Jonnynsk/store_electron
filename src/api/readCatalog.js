export async function readCatalog() {
  if (window.electronAPI?.readCatalog) {
    return window.electronAPI.readCatalog();
  }

  const response = await fetch('/catalog/catalog.json');

  if (!response.ok) {
    throw new Error('Не удалось загрузить базу данных каталога');
  }

  return response.json();
}
