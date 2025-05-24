import { getBookmarkedStories } from '../../utils/bookmark';
import { generateReportItemTemplate } from '../../templates';

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
    const bookmarkedStories = getBookmarkedStories();
    const savedDestinationsContainer = document.getElementById('saved-destinations');

    if (bookmarkedStories.length === 0) {
      savedDestinationsContainer.innerHTML = `
        <div class="empty-bookmark">
          <h2>Belum ada destinasi yang disimpan</h2>
          <p>Anda belum menyimpan destinasi apapun. Mulai jelajahi dan simpan destinasi favorit Anda!</p>
        </div>
      `;
      return;
    }

    const html = bookmarkedStories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateReportItemTemplate({
          id: story.id,
          title: story.title,
          description: story.description,
          reporterName: story.reporter?.name || story.reporterName || 'Unknown',
        }),
      );
    }, '');

    savedDestinationsContainer.innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }
}
