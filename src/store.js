const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const findById = id => {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = newBookmark => {
  bookmarks.push(newBookmark);
};

const findAndUpdate = (id, newData) => {
  const bookmark = this.findById(id);
  Object.assign(bookmark, newData);
};

const findAndDelete = id => {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const setError = error => {
  this.error = error;
};

export default {
  bookmarks,
  error,
  adding,
  filter,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  setError
};