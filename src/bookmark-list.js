import $ from 'jquery';
import store from './store';
import api from './api';
import bookmark from './bookmark';

const generateBookmarkElement = bookmark => {
  if (bookmark.expanded){
    return generateOpenBookmarkElement(bookmark);
  } else {
    return generateClosedBookmarkElement(bookmark);
  }
};

const generateClosedBookmarkElement = bookmark => {
  let rating = '<span>★</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>';
  return `
    <li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <div class="rating">
        ${rating}
      </div>
    </li>
  `;
};

const generateOpenBookmarkElement = bookmark => {
  return '<li>this is a open element placeholder</li>';
};

const generateBookmarksString = bookmarkList => {
  const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const generateError = message => {
  return `
    <section class="error-content">
      <button id="close-error">X</button>
    </section>
  `;
};

const renderError = () => {
  if (store.error) {
    const errorElement = generateError(store.error);
    $('.error-container').html(errorElement);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = () => {
  $('.error-container').on('click', '#close-error', () => {
    store.setError(null);
    renderError();
  });
};

const render = () => {
  // Check for and render errors before other rendering.
  renderError();

  let bookmarks = [...store.bookmarks];
  const bookmarksListHtml = generateBookmarksString(bookmarks);
  $('.js-bookmarks-list').html(bookmarksListHtml);
};

const handleNewBookmarkSubmit = () => {
  $('.js-bookmarks-list-form').submit(event => {
    event.preventDefault();
  });
};

const getBookmarkIdFromElement = bookmark => {};

const handleDeleteBookmarkClicked = () => {};

const handleEditBookmarkClicked = () => {};

const bindEventListeners = () => {
  handleNewBookmarkSubmit();
  handleEditBookmarkClicked();
  handleDeleteBookmarkClicked();
  handleCloseError();
};

export default {
  render,
  bindEventListeners
};