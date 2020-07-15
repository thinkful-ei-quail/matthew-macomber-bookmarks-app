/* eslint-disable no-console */
import $ from 'jquery';
import store from './store';
import api from './api';
import bookmark from './bookmark';

const generateBookmarkElement = bookmark => {
  console.log('generateBookmarkElement Run.');
  if (bookmark.expanded){
    return generateOpenBookmarkElement(bookmark);
  } else {
    return generateClosedBookmarkElement(bookmark);
  }
};

const generateClosedBookmarkElement = bookmark => {
  console.log('generateClosedBookmarkElement Run.');
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
  console.log('generateOpenBookmarkElement Run.');
  return '<li>this is a open element placeholder</li>';
};

const generateCreateBookmarkElement = () => {
  console.log('generateCreateBookmarkElement Run.');
  return `
    <label for="newURL">Add New Bookmark</label>
    <input type="url" name="newURL" id="newURL" placeholder="http://example.com"/>
    <input type="text" name="newTitle" id="newTitle" placeholder="My Title Example"/>
    <p>Star Rating Placeholder<p>
    <textarea name="newDesc" id="newDesc" placeholder="Add a description (optional)"/></textarea>
    <input type="submit" name="cancel" id="cancel" value="Cancel"/>
    <input type="submit" name="create" id="create" valure="Create"/>
  `;
};

const generateBookmarkListForm = () => {
  return `
    <input type="submit" value="+ New"/>
    <select name="Filter By" id="filter">
        <option value="" selected disabled hidden>Filter By</option>
        <option value="name">Name</option>
        <option value="rating">Rating</option>
        <option value="date">Date Added</option>
    </select>
  `;
};

const generateBookmarksHtml = bookmarkList => {
  console.log('generateBookmarkHhml Run.');
  const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const generateError = message => {
  console.log('generateError Run.');
  return `
    <section class="error-content">
      ${message}
      <button id="close-error">X</button>
    </section>
  `;
};

const renderError = () => {
  console.log('renderError Run.');
  if (store.error) {
    const errorElement = generateError(store.error);
    $('.error-container').html(errorElement);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = () => {
  $('.error-container').on('click', '#close-error', () => {
    console.log('handleCloseError Run.');
    store.setError(null);
    renderError();
  });
};

const render = () => {
  console.log('render Run.');
  // Check for and render errors before other rendering.
  renderError();

  if (store.adding) {
    $('#js-new-bookmark-form').html(generateCreateBookmarkElement());
    $('#js-bookmark-list-form').empty();
    $('.js-bookmarks-list').empty();
  } else {
    let bookmarks = [...store.bookmarks];
    const bookmarksListHtml = generateBookmarksHtml(bookmarks);
    $('#js-new-bookmark-form').empty();
    $('#js-bookmark-list-form').html(generateBookmarkListForm());
    $('.js-bookmarks-list').html(bookmarksListHtml);
  }
};

const handleNewBookmarkSubmit = () => {
  $('#js-bookmark-list-form').submit(event => {
    event.preventDefault();
    store.adding = true;
    render();
  });
};

const handleCancelButton = () => {
  $('#js-new-bookmark-form').on('submit', '#cancel', even => {
    event.preventDefault();
    console.log('Cancle button clicked');
  });
};

const handleCreateSubmit = () => {};

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