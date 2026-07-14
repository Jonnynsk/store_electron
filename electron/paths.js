const { app } = require('electron');
const path = require('path');

/**
 * Централизованное разрешение путей для dev и packaged-сборки.
 * catalog.json — в extraResources (вне asar), UI — внутри asar/dist.
 */
class AppPaths {
  static get isDev() {
    return !app.isPackaged;
  }

  static get appRoot() {
    return app.getAppPath();
  }

  static get preloadPath() {
    return path.join(__dirname, 'preload.js');
  }

  static get rendererIndexPath() {
    return path.join(this.appRoot, 'dist', 'index.html');
  }

  /**
   * Справочник лежит вне asar (extraResources), чтобы его можно было подменить.
   * Dev: <project>/catalog/catalog.json
   * Prod: <resources>/catalog/catalog.json  (рядом с app.asar)
   */
  static get catalogPath() {
    if (this.isDev) {
      return path.join(this.appRoot, 'catalog', 'catalog.json');
    }

    return path.join(process.resourcesPath, 'catalog', 'catalog.json');
  }
}

module.exports = { AppPaths };
