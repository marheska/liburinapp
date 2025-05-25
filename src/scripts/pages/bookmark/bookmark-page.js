import { getAllData, deleteData } from '../../utils/db';

export default class BookmarkPage {
  async render() {
    return `
      <section class="bookmark-page container">
        <h1 class="section-title">Destinasi Tersimpan</h1>
        <div id="saved-destinations" class="saved-destinations-list"></div>
      </section>
    `;
  }

  async afterRender() {
    // Tampilkan data dari IndexedDB
    const savedDestinationsContainer = document.getElementById('saved-destinations');
    const savedData = await getAllData();
    if (savedData.length === 0) {
      savedDestinationsContainer.innerHTML = `
        <div class="empty-bookmark">
          <h2>Belum ada destinasi yang disimpan</h2>
          <p>Anda belum menyimpan destinasi apapun. Mulai jelajahi dan simpan destinasi favorit Anda!</p>
        </div>
      `;
      return;
    }
    const html = savedData.map((item) => `
      <div class="saved-item">
        <img src="src/public/images/logo.png" alt="${item.title}" class="saved-item__image"/>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <button class="delete-saved" data-id="${item.id}">Hapus</button>
      </div>
    `).join('');
    savedDestinationsContainer.innerHTML = `<div class="reports-list">${html}</div>`;
    // Event hapus data
    document.querySelectorAll('.delete-saved').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        await deleteData(id);
        this.afterRender();
      });
    });
  }
}
