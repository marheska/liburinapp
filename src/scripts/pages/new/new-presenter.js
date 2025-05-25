import { saveBookmark } from '../../utils/bookmark';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
      // Ambil koordinat awal dari view, bukan langsung dari DOM
      const { lat, lon } = this.#view.getInitialCoordinates();
      if (!isNaN(lat) && !isNaN(lon)) {
        this.#view.addMarkerToMap(lat, lon, 'New Destination');
      }
      await this.showStoriesOnMap(); // Tampilkan story di peta
      this.initMapClickListener();   // Pasang listener klik peta
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoriesOnMap() {
    try {
      const stories = await this.#model.getStories();
      stories.forEach(story => {
        this.#view.addMarkerToMap(story.lat, story.lon, story.title, () => {
          this.#view.showPopup(story);
        });
      });
    } catch (error) {
      console.error('showStoriesOnMap: error:', error);
    }
  }

  async postNewReport({ title, description, evidenceImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
      if (!evidenceImages || evidenceImages.length === 0) {
        this.#view.storeFailed('Please add at least one photo');
        return;
      }

      // Ambil nama user dari localStorage atau token jika tidak ada getUser
      let namaUser = 'Unknown';
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user && user.name) namaUser = user.name;
        }
      } catch (e) {}

      const data = {
        name: title,
        description: description,
        photo: evidenceImages[0],
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
      };

      const response = await this.#model.postStory(data);

      if (response.error) {
        this.#view.storeFailed(response.message || 'Failed to post story');
        return;
      }

      const newStory = {
        id: response.id,
        title: response.name,
        description: response.description,
        reporter: { name: namaUser },
      };
      saveBookmark(newStory);

      this.#view.storeSuccessfully('Story posted successfully', response);
    } catch (error) {
      console.error('postNewReport: error:', error);
      this.#view.storeFailed(error.message || 'Failed to post story');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  initMapClickListener() {
    this.#view.onMapClick((lat, lon) => {
      this.#view.addMarkerToMap(lat, lon, 'New Destination');
      this.#view.setCoordinates(lat, lon);
    });
  }
}
