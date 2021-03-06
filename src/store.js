let bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let filterRating = 1;

const findById = id => {
  return bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = newBookmark => {
  bookmarks.push(newBookmark);
};

const findAndUpdate = (id, newData) => {
  const bookmark = this.findById(id);
  Object.assign(bookmark, newData);
};

const findAndDelete = id => {
  bookmarks = bookmarks.filter(currentBookmark => currentBookmark.id !== id);
  return bookmarks;
};

const setError = newError => {
  error = newError;
  return error;
};

const closeAllBookmarks = () => {
  bookmarks.map(bookmark => bookmark.expanded = false);
};

export default {
  bookmarks,
  error,
  adding,
  filter,
  filterRating,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  setError,
  closeAllBookmarks
};