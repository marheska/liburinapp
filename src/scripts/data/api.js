const BASE_URL = 'https://story-api.dicoding.dev/v1';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
};

async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json(); // hasil: { loginResult: { token, name, userId }, message }
}

async function getStories(token) {
  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.listStory.map(story => ({
    id: story.id,
    title: story.name,
    description: story.description,
    image: story.photoUrl,
    date: new Date(story.createdAt).toLocaleString(),
    location: {
      latitude: story.lat,
      longitude: story.lon,
    },
    reporter: { name: story.name },
  }));
}

async function postStory({ name, description, photo, lat, lon }) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  formData.append('lat', lat);
  formData.append('lon', lon);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response.json();
}

export async function getReportById(token, id) {
  try {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response || !response.ok) throw new Error('Gagal mengambil detail laporan');
    return await response.json();
  } catch (error) {
    console.error('getReportById error:', error);
    return null;
  }
}

export async function getAllCommentsByReportId(token, id) {
  // Jika API tidak support komentar, return array kosong
  return [];
}

export { register, login, getStories, postStory };
