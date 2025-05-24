import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as LiburInAPI from '../../data/api';
import { getAllStories, deleteStory } from '../../utils/idb';

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
    // Tampilkan data offline dari IndexedDB jika ada
    this.showOfflineStories();
  }

  async showOfflineStories() {
    const offlineStories = await getAllStories();
    if (offlineStories && offlineStories.length > 0) {
      const html = offlineStories.reduce((acc, story) => {
        return acc + `
          <div class="report-item offline">
            <h3>${story.title} <span style="color:red; font-size:0.8em;">(Offline)</span></h3>
            <p>${story.description}</p>
            <button class="delete-offline-story" data-id="${story.id}">Hapus</button>
          </div>
        `;
      }, '');
      const container = document.createElement('div');
      container.innerHTML = `<h2>Data Offline</h2>${html}`;
      document.getElementById('reports-list').prepend(container);
      container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-offline-story')) {
          await deleteStory(e.target.dataset.id);
          container.remove();
          this.showOfflineStories();
        }
      });
    }
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
          ...report,
          reporterName: report.reporter?.name || 'Unknown',
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
