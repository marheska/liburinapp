const BOOKMARK_KEY = 'bookmarked_stories';

export function getBookmarkedStories() {
  try {
    const bookmarkedStories = localStorage.getItem(BOOKMARK_KEY);
    return bookmarkedStories ? JSON.parse(bookmarkedStories) : [];
  } catch (error) {
    console.error('getBookmarkedStories: error:', error);
    return [];
  }
}

export function saveBookmark(story) {
  try {
    const bookmarkedStories = getBookmarkedStories();
    const isAlreadyBookmarked = bookmarkedStories.some((bookmarked) => bookmarked.id === story.id);

    if (isAlreadyBookmarked) {
      return false;
    }

    bookmarkedStories.push(story);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkedStories));
    return true;
  } catch (error) {
    console.error('saveBookmark: error:', error);
    return false;
  }
}

export function removeBookmark(storyId) {
  try {
    const bookmarkedStories = getBookmarkedStories();
    const filteredStories = bookmarkedStories.filter((story) => story.id !== storyId);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(filteredStories));
    return true;
  } catch (error) {
    console.error('removeBookmark: error:', error);
    return false;
  }
}

export function isStoryBookmarked(storyId) {
  try {
    const bookmarkedStories = getBookmarkedStories();
    return bookmarkedStories.some((story) => story.id === storyId);
  } catch (error) {
    console.error('isStoryBookmarked: error:', error);
    return false;
  }
} 