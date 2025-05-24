import Map from '../utils/map';

export async function reportMapper(story) {
  const placeName = await Map.getPlaceNameByCoordinate(story.lat, story.lon);

  return {
    id: story.id,
    title: story.name,
    description: story.description,
    image: story.photoUrl,
    date: new Date(story.createdAt).toLocaleString(),
    location: {
      latitude: story.lat,
      longitude: story.lon,
      placeName: placeName,
    },
  };
}
