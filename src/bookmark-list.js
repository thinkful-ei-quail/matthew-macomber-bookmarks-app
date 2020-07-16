/* eslint-disable no-fallthrough */
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
  if (bookmark.expanded){
    return generateOpenBookmarkElement(bookmark);
  } else {
    return generateClosedBookmarkElement(bookmark);
  }
};

const generateClosedBookmarkElement = bookmark => {
  let starOne = '☆',starTwo = '☆',starThree = '☆',starFour = '☆',starFive = '☆';
  switch(bookmark.rating) {
  case 5:
    starFive = '★';
  case 4:
    starFour = '★';
  case 3:
    starThree = '★';
  case 2:
    starTwo = '★';
  case 1:
    starOne = '★';
  }
  let rating = `${starOne} ${starTwo} ${starThree} ${starFour} ${starFive}`;
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
      <a href="${bookmark.url}"><button>Visit Site</button></a><span>${bookmark.rating}&bigstar;</span>
    </div>
    <div class="open-bookmark-desc">
      ${bookmark.desc}
    </div>
  </li>
  `;
};

const generateCreateBookmarkElement = () => {
  return `
    <label for="newURL">Add New Bookmark</label>
    <input type="url" name="newURL" id="newURL" placeholder="http://example.com"/>
    <input type="text" name="newTitle" id="newTitle" placeholder="My Example Title"/>
    <div class="newRating-form">
      <label id="ratingLabel" for="newRating">Rating:</label>
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
    </div>
    <textarea name="newDesc" id="newDesc" placeholder="Add a description (optional)"/></textarea>
    <div class="form-buttons">
      <input type="submit" name="cancel" id="cancel" value="Cancel"/>
      <input type="submit" name="create" id="create" value="Create"/>
    </div>
  `;
};

const generateFilterForm= () => {
  let starOne, starTwo, starThree, starFour, starFive;
  starOne, starTwo, starThree, starFour, starFive = '';
  switch(store.filterRating)
  {
  case 1:
    starOne = ' checked="checked"';
    break;
  case 2:
    starTwo = ' checked="checked"';
    break;
  case 3:
    starThree = ' checked="checked"';
    break;
  case 4:
    starFour = ' checked="checked"';
    break;
  case 5:
    starFive = ' checked="checked"';
    break;
  }
  return `
    <fieldset>
      <span class="star-cb-group">
        <input type="radio" id="rating-5" name="filterRating" value="5"${starFive}/>
        <label for="rating-5">5</label>
        <input type="radio" id="rating-4" name="filterRating" value="4"${starFour}/>
        <label for="rating-4">4</label>
        <input type="radio" id="rating-3" name="filterRating" value="3"${starThree}/>
        <label for="rating-3">3</label>
        <input type="radio" id="rating-2" name="filterRating" value="2"${starTwo}/>
        <label for="rating-2">2</label>
        <input type="radio" id="rating-1" name="filterRating" value="1"${starOne}/>
        <label for="rating-1">1</label>
        <input type="radio" id="rating-0" name="filterRating" value="0" class="star-cb-clear"/>
        <label for="rating-0">0</label>
      </span>
    </fieldset>
  `;
};

const generateBookmarkListForm = () => {
  return `
    <input type="submit" name="New Bookmark" value="+ New"/>
    <select name="Filter By" id="filter">
        <option value="" selected disabled hidden>Filter By</option>
        <option value="rating">Minimum Rating</option>
    </select>
  `;
};

const generateBookmarksHtml = bookmarkList => {
  const filteredBookmarkList = bookmarkList.filter(bookmark => bookmark.rating >= store.filterRating);
  const bookmarks = filteredBookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const generateError = message => {
  return `
    <section class="error-content">
      ${message}
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
  $('.error-container').on('click', '#close-error', event => {
    event.preventDefault();
    store.error = store.setError(null);
    renderError();
  });
};

const renderFilterForm = () => {
  if (store.filter === 1) {
    $('#js-bookmark-filter-form').html(generateFilterForm());
  } else {
    $('#js-bookmark-filter-form').empty();
  }
};

const render = () => {
  // Check for and render errors before other rendering.
  renderError();

  if (store.adding) {
    $('#js-new-bookmark-form').html(generateCreateBookmarkElement());
    $('#js-bookmark-list-form').empty();
    store.filter = 0;
    renderFilterForm();
    $('#js-bookmarks-list').empty();
  } else {
    let bookmarks = [...store.bookmarks];
    const bookmarksListHtml = generateBookmarksHtml(bookmarks);
    $('#js-new-bookmark-form').empty();
    $('#js-bookmark-list-form').html(generateBookmarkListForm());
    renderFilterForm();
    $('#js-bookmarks-list').html(bookmarksListHtml);
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
    const newBookmark = $('#js-new-bookmark-form').serializeJson();
    // newBookmark object format: {"newURL":"http://www.google.com","newTitle":"My Awsome Google Titleasd","newDesc":"asdfasdfsdfs"}
    try {
      bookmark.validateName(newBookmark['newTitle']);
      bookmark.validateUrl(newBookmark['newURL']);
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
          new Error(error.message);
        });
    } catch (error) {
      store.error = store.setError(error.message);
      renderError();
    }
  });
};

const getBookmarkIdFromElement = bookmark => {
  return $(bookmark).closest('.js-bookmark-element').data('bookmark-id');
};

const handleDeleteBookmarkClicked = () => {
  $('#js-bookmarks-list').on('click', '.js-delete-button', event => {
    const bookmarkID = getBookmarkIdFromElement(event.target);
    api.deleteBookmark(bookmarkID)
      .then(() => {
        store.bookmarks = store.findAndDelete(bookmarkID);
        render();
      })
      .catch(error => {
        store.error = store.setError(error.message);
        renderError();
      });
  });
};

const handleViewBookmarkClick = () => {
  $('#js-bookmarks-list').on('click', 'li', event => {
    const bookmarkID = getBookmarkIdFromElement(event.target);
    const currentBookmark = store.findById(bookmarkID);
    store.closeAllBookmarks();
    if (!currentBookmark.expanded) {
      currentBookmark.expanded = true;
      render();
    }
  });
};

const handleFilterSelected = () => {
  $('#js-bookmark-list-form').change(() => {
    store.filter = 1;
    render();
  });
};

const handleFilterByRating = () => {
  $('#js-bookmark-filter-form').on('click', 'input', event => {
    store.filterRating = parseInt($(event.target).val());
    render();
  });
};

const handleEditBookmarkClicked = () => {};

const bindEventListeners = () => {
  handleNewBookmarkSubmit();
  handleEditBookmarkClicked();
  handleDeleteBookmarkClicked();
  handleCancelButton();
  handleCreateSubmit();
  handleViewBookmarkClick();
  handleCloseError();
  handleFilterSelected();
  handleFilterByRating ();
};

export default {
  render,
  bindEventListeners
};