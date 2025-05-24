import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  const currentPath = location.hash.replace('#', '') || '/';
  return `
    <li><a id="destination-list-button" class="destination-list-button ${currentPath === '/' ? 'active' : ''}" href="#/">Daftar Destinasi</a></li>
    <li><a id="bookmark-button" class="bookmark-button ${currentPath === '/bookmark' ? 'active' : ''}" href="#/bookmark">Destinasi Tersimpan</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Daftar</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-destination-button" class="btn new-destination-button" href="#/new">Tambah Destinasi <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateDestinationsListEmptyTemplate() {
  return `
    <div id="destinations-list-empty" class="destinations-list__empty">
      <h2>Tidak ada destinasi yang tersedia</h2>
      <p>Saat ini, tidak ada destinasi wisata yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateDestinationsListErrorTemplate(message) {
  return `
    <div id="destinations-list-error" class="destinations-list__error">
      <h2>Terjadi kesalahan pengambilan daftar destinasi</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateDestinationDetailErrorTemplate(message) {
  return `
    <div id="destination-detail-error" class="destination-detail__error">
      <h2>Terjadi kesalahan pengambilan detail destinasi</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateCommentsListEmptyTemplate() {
  return `
    <div id="destination-detail-comments-list-empty" class="destination-detail__comments-list__empty">
      <h2>Tidak ada komentar yang tersedia</h2>
      <p>Saat ini, tidak ada komentar yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateCommentsListErrorTemplate(message) {
  return `
    <div id="destination-detail-comments-list-error" class="destination-detail__comments-list__error">
      <h2>Terjadi kesalahan pengambilan daftar komentar</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateReportItemTemplate({ id, title, description, reporterName }) {
  return `
    <div class="report-item">
      <h3 class="report-item__title">
        <a href="#/reports/${id}">${title}</a>
      </h3>
      <p class="report-item__description">${description}</p>
      <p class="report-item__reporter">Dilaporkan oleh: ${reporterName}</p>
    </div>
  `;
}

export function generateReportsListEmptyTemplate() {
  return `
    <div class="reports-list__empty">
      <h2>Tidak ada laporan kerusakan</h2>
      <p>Saat ini belum ada laporan kerusakan yang masuk.</p>
    </div>
  `;
}

export function generateReportsListErrorTemplate(message) {
  return `
    <div class="reports-list__error">
      <h2>Terjadi kesalahan saat memuat laporan</h2>
      <p>${message || 'Silakan coba lagi nanti atau periksa koneksi Anda.'}</p>
    </div>
  `;
}

export function generateReportDetailTemplate({
  title,
  description,
  damageLevel,
  evidenceImages,
  location,
  reporterName,
  createdAt,
}) {
  return `
    <div class="report-detail__content">
      <h2 class="report-detail__title">${title}</h2>
      <p class="report-detail__info">
        <strong>Level Kerusakan:</strong> ${damageLevel} <br>
        <strong>Pelapor:</strong> ${reporterName} <br>
        <strong>Dibuat pada:</strong> ${showFormattedDate(createdAt, 'id-ID')}
      </p>
      <p class="report-detail__description">${description}</p>
      <div id="images" class="report-detail__images">
        ${evidenceImages.map((img) => `<img src="${img}" alt="Bukti">`).join('')}
      </div>
      <div id="map" class="report-detail__map-container">
        <div id="map-loading-container"></div>
      </div>
      <div id="save-actions-container" class="report-detail__actions"></div>
      <button id="report-detail-notify-me" class="btn">Beritahu Saya</button>
    </div>
  `;
}

export function generateReportDetailErrorTemplate(message) {
  return `
    <div class="report-detail__error">
      <h2>Terjadi kesalahan saat memuat detail laporan</h2>
      <p>${message || 'Silakan coba beberapa saat lagi.'}</p>
    </div>
  `;
}

export function generateReportCommentItemTemplate({ photoUrlCommenter, nameCommenter, body }) {
  return `
    <div class="report-detail__comment-item">
      <img src="${photoUrlCommenter}" alt="${nameCommenter}" class="comment-item__avatar" />
      <div class="comment-item__content">
        <strong class="comment-item__name">${nameCommenter}</strong>
        <p class="comment-item__body">${body}</p>
      </div>
    </div>
  `;
}

export function generateSaveReportButtonTemplate() {
  return `
    <button id="report-detail-save" class="btn">
      Simpan Laporan <i class="fas fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveReportButtonTemplate() {
  return `
    <button id="report-detail-remove" class="btn">
      Hapus dari Tersimpan <i class="fas fa-bookmark-slash"></i>
    </button>
  `;
}
