import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as LiburInAPI from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;
  #stories = [];

  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Cerita</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: LiburInAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateReportsList(message, reports) {
    this.#stories = reports;
    
    if (reports.length <= 0) {
      this.populateReportsListEmpty();
      return;
    }
    
    const html = reports.reduce((accumulator, report) => {
      return accumulator.concat(
        generateReportItemTemplate({
          id: report.id,
          title: report.title || report.name, // pastikan ambil judul cerita, fallback ke name jika title kosong
          description: report.description,
          reporterName: report.reporter?.name || 'Unknown',
          photo: report.photo || (report.evidenceImages ? report.evidenceImages[0] : undefined),
          photoUrl: report.photoUrl,
          image: report.image,
          evidenceImages: report.evidenceImages,
        }),
      );
    }, '');
    
    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }

  getStoryById(id) {
    return this.#stories.find(story => story.id === id);
  }

  populateReportsListEmpty() {
    document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
  }

  populateReportsListError(message) {
    document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  showLoading() {
    const loadingEl = document.getElementById('reports-list-loading-container');
    if (loadingEl) {
      loadingEl.innerHTML = generateLoaderAbsoluteTemplate();
    }
  }

  hideLoading() {
    const loadingEl = document.getElementById('reports-list-loading-container');
    if (loadingEl) {
      loadingEl.innerHTML = '';
    }
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });
  }

  addMarkerToMap(coordinate, markerOptions = {}, popupOptions = null) {
    if (this.#map) {
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    }
  }
}
