/* eslint-disable no-console */
import $ from 'jquery';
import store from './store';
import api from './api';
import bookmark from './bookmark';

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return o;
  }
});

const generateBookmarkElement = bookmark => {
  console.log('generateBookmarkElement Run.');
  if (bookmark.expanded){
    return generateOpenBookmarkElement(bookmark);
  } else {
    return generateClosedBookmarkElement(bookmark);
  }
};

const generateClosedBookmarkElement = bookmark => {
  let rating = '<span>★</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>';
  return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
      <div>${bookmark.title}</div>
      <div class="rating">
        ${rating}
      </div>
    </li>
  `;
};

const generateOpenBookmarkElement = bookmark => {
  return `
  <li class="js-bookmark-element open-bookmark" data-bookmark-id="${bookmark.id}">
    <section class="open-bookmark-title-bar">
      <div>${bookmark.title}</div>
      <button class="js-delete-button btn">
        🗑
      </button>
    </section>
    <div class="open-bookmark-url">
      <a href="${bookmark.url}"><button>Visit Site</button></a><span style="font-size:100%;color:blue;">${bookmark.rating}&bigstar;</span>
    </div>
    <div>
      ${bookmark.desc}
    </div
  </li>
  `;
};

const generateCreateBookmarkElement = () => {
  return `
    <label for="newURL">Add New Bookmark</label>
    <input type="url" name="newURL" id="newURL" placeholder="http://example.com"/>
    <input type="text" name="newTitle" id="newTitle" placeholder="My Example Title"/>
    <fieldset>
      <span class="star-cb-group">
        <input type="radio" id="rating-5" name="newRating" value="5"/>
        <label for="rating-5">5</label>
        <input type="radio" id="rating-4" name="newRating" value="4"/>
        <label for="rating-4">4</label>
        <input type="radio" id="rating-3" name="newRating" value="3"/>
        <label for="rating-3">3</label>
        <input type="radio" id="rating-2" name="newRating" value="2"/>
        <label for="rating-2">2</label>
        <input type="radio" id="rating-1" name="newRating" value="1" checked="checked"/>
        <label for="rating-1">1</label>
        <input type="radio" id="rating-0" name="newRating" value="0" class="star-cb-clear"/>
        <label for="rating-0">0</label>
      </span>
    </fieldset>
    <textarea name="newDesc" id="newDesc" placeholder="Add a description (optional)"/></textarea>
    <input type="submit" name="cancel" id="cancel" value="Cancel"/>
    <input type="submit" name="create" id="create" value="Create"/>
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
  $('#js-new-bookmark-form').on('click', '#cancel', event => {
    event.preventDefault();
    console.log('Cancle button clicked');
    store.adding = false;
    render();
  });
};

const handleCreateSubmit = () => {
  $('#js-new-bookmark-form').on('click', '#create', event => {
    event.preventDefault();
    console.log('Create button clicked');
    const newBookmark = $('#js-new-bookmark-form').serializeJson();
    // newBookmark object format: {"newURL":"http://www.google.com","newTitle":"My Awsome Google Titleasd","newDesc":"asdfasdfsdfs"}
    const formatedBookmark = {
      'title' : newBookmark['newTitle'],
      'url' : newBookmark['newURL'],
      'desc' : newBookmark['newDesc'],
      'rating' : parseInt(newBookmark['newRating'])
    };
    api.createBookmark(formatedBookmark)
      .then(bookmark => {
        store.addBookmark(bookmark);
        store.adding = false;
        render();
      })
      .catch(error => {
        store.setError(error.message);
        renderError();
      });
  });
};

const getBookmarkIdFromElement = bookmark => {
  return $(bookmark).closest('.js-bookmark-element').data('bookmark-id');
};

const handleDeleteBookmarkClicked = () => {
  $('.js-bookmarks-list').on('click', '.js-delete-button', event => {
    console.log('Delete bookmark button clicked.');
    const bookmarkID = getBookmarkIdFromElement(event.target);
    console.log(bookmarkID);
    api.deleteBookmark(bookmarkID)
      .then(() => {
        store.bookmarks = store.findAndDelete(bookmarkID);
        console.log('deleted then rendering');
        console.log(store.bookmarks);
        render();
      })
      .catch(error => {
        store.setError(error.message);
        renderError();
      });
  });
};

const handleEditBookmarkClicked = () => {};

const handleViewBookmarkClick = () => {
  $('.js-bookmarks-list').on('click', 'li', event => {
    console.log('Bookmark item clicked');
    const bookmarkID = getBookmarkIdFromElement(event.target);
    const currentBookmark = store.findById(bookmarkID);
    if (!currentBookmark.expanded) {
      console.log(currentBookmark);
      currentBookmark.expanded = true;
      render();
    }
  });
};

const bindEventListeners = () => {
  handleNewBookmarkSubmit();
  handleEditBookmarkClicked();
  handleDeleteBookmarkClicked();
  handleCancelButton();
  handleCreateSubmit();
  handleViewBookmarkClick();
  handleCloseError();
};

export default {
  render,
  bindEventListeners
};