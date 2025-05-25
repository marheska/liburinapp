import { saveBookmark } from '../../utils/bookmark';
<<<<<<< HEAD
=======
import { saveStory } from '../../utils/idb';
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b

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
<<<<<<< HEAD
      // Ambil koordinat awal dari view, bukan langsung dari DOM
      const { lat, lon } = this.#view.getInitialCoordinates();
      if (!isNaN(lat) && !isNaN(lon)) {
        this.#view.addMarkerToMap(lat, lon, 'New Destination');
=======
      // Tambahkan marker default pada posisi awal dari input form
      const form = document.getElementById('new-form');
      if (form) {
        const lat = parseFloat(form.elements.namedItem('latitude').value);
        const lon = parseFloat(form.elements.namedItem('longitude').value);
        if (!isNaN(lat) && !isNaN(lon)) {
          this.#view.addMarkerToMap(lat, lon, 'New Destination');
        }
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
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
<<<<<<< HEAD

      // Ambil nama user dari localStorage atau token jika tidak ada getUser
=======
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
      let namaUser = 'Unknown';
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user && user.name) namaUser = user.name;
        }
      } catch (e) {}
<<<<<<< HEAD

=======
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
      const data = {
        name: title,
        description: description,
        photo: evidenceImages[0],
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
      };
<<<<<<< HEAD

      const response = await this.#model.postStory(data);

=======
      let response;
      try {
        response = await this.#model.postStory(data);
      } catch (err) {
        // Jika gagal online, simpan ke IndexedDB
        const offlineStory = {
          id: Date.now().toString(),
          title,
          description,
          reporter: { name: namaUser },
        };
        await saveStory(offlineStory);
        this.#view.storeSuccessfully('Cerita disimpan secara offline!', offlineStory);
        return;
      }
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
      if (response.error) {
        this.#view.storeFailed(response.message || 'Failed to post story');
        return;
      }
<<<<<<< HEAD

=======
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
      const newStory = {
        id: response.id,
        title: response.name,
        description: response.description,
        reporter: { name: namaUser },
      };
      saveBookmark(newStory);
<<<<<<< HEAD

=======
>>>>>>> 2177e4c4bb4a469a1bae21fdd50709e06dbbd36b
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
