import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as LiburInAPI from '../../data/api';
import { saveBookmark, isStoryBookmarked, removeBookmark } from '../../utils/bookmark';
import { saveData } from '../../utils/db';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>
      
      <section class="container">
        <hr>
        <div class="report-detail__comments__container">
          <div class="report-detail__comments-form__container">
            <h2 class="report-detail__comments-form__title">Beri Tanggapan</h2>
            <form id="comments-list-form" class="report-detail__comments-form__form">
              <textarea name="body" placeholder="Beri tanggapan terkait laporan."></textarea>
              <div id="submit-button-container">
                <button class="btn" type="submit">Tanggapi</button>
              </div>
            </form>
          </div>
          <hr>
          <div class="report-detail__comments-list__container">
            <div id="report-detail-comments-list"></div>
            <div id="comments-list-loading-container"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: LiburInAPI,
    });

    this.#setupForm();

    this.#presenter.showReportDetail();
    this.#presenter.getCommentsList();

    // Tambahkan tombol simpan ke offline (IndexedDB)
    setTimeout(() => {
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Simpan ke Offline';
      saveBtn.className = 'btn btn-save-offline';
      saveBtn.addEventListener('click', async () => {
        const detailContainer = document.getElementById('report-detail');
        const title = detailContainer.querySelector('.report-detail__title')?.textContent || '';
        const description = detailContainer.querySelector('.report-detail__description')?.textContent || '';
        // Ambil id dari URL
        const id = parseActivePathname().id;
        await saveData({ id, title, description });
        saveBtn.textContent = 'Tersimpan!';
        saveBtn.disabled = true;
      });
      const detailContainer = document.getElementById('report-detail');
      if (detailContainer) detailContainer.appendChild(saveBtn);
    }, 500);
  }

  async populateReportDetailAndInitialMap(message, report) {
    document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
      title: report.title,
      description: report.description,
      damageLevel: report.damageLevel,
      evidenceImages: report.evidenceImages,
      location: report.location,
      reporterName: report.reporter.name,
      createdAt: report.createdAt,
    });

    // Carousel images
    createCarousel(document.getElementById('images'));

    // Map
    await this.#presenter.showReportDetailMap();
    if (this.#map) {
      const reportCoordinate = [report.location.latitude, report.location.longitude];
      const markerOptions = { alt: report.title };
      const popupOptions = { content: report.title };
      
      this.#map.changeCamera(reportCoordinate);
      this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
    }

    // Actions buttons
    this.renderBookmarkButton(report);
    this.addNotifyMeEventListener();
  }

  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }

  populateReportDetailComments(message, comments) {
    if (comments.length <= 0) {
      this.populateCommentsListEmpty();
      return;
    }

    const html = comments.reduce(
      (accumulator, comment) =>
        accumulator.concat(
          generateReportCommentItemTemplate({
            photoUrlCommenter: comment.commenter.photoUrl,
            nameCommenter: comment.commenter.name,
            body: comment.body,
          }),
        ),
      '',
    );

    document.getElementById('report-detail-comments-list').innerHTML = `
      <div class="report-detail__comments-list">${html}</div>
    `;
  }

  populateCommentsListEmpty() {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListEmptyTemplate();
  }

  populateCommentsListError(message) {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  #setupForm() {
    this.#form = document.getElementById('comments-list-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        body: this.#form.elements.namedItem('body').value,
      };
      await this.#presenter.postNewComment(data);
    });
  }

  postNewCommentSuccessfully(message) {
    console.log(message);

    this.#presenter.getCommentsList();
    this.clearForm();

    const newStory = {
      id: response.id,
      title: response.name,
      description: response.description,
      reporter: { name: response.name },
    };
    saveBookmark(newStory);

    location.hash = '/bookmark';
  }

  postNewCommentFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  renderBookmarkButton(report) {
    const isBookmarked = isStoryBookmarked(report.id);
    document.getElementById('save-actions-container').innerHTML = `
      <button id="bookmark-btn" class="btn">
        ${isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
      </button>
    `;
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        if (isStoryBookmarked(report.id)) {
          removeBookmark(report.id);
          bookmarkBtn.textContent = 'Simpan ke Bookmark';
        } else {
          if (report && report.id) {
            saveBookmark(report);
          }
          bookmarkBtn.textContent = 'Hapus dari Bookmark';
        }
      });
    }
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      alert('Fitur simpan laporan akan segera hadir!');
    });
  }

  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      alert('Fitur notifikasi laporan akan segera hadir!');
    });
  }

  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }

  storeSuccessfully(message, response) {
    const newStory = {
      id: response.id,
      title: response.name,
      description: response.description,
      reporter: { name: response.name },
    };
    saveBookmark(newStory);

    location.hash = '/bookmark';
  }
}
