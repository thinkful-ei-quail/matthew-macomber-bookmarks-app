const BASE_URL = 'https://thinkful-list-api.herokuapp.com/';
let user = 'matthewmacomber';

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

function getBookmarks() {
  return listApiFetch(`${BASE_URL}${user}/bookmarks`);
}

function createBookmark(bookmark) {
  const newBookmark = JSON.stringify(bookmark);
  return listApiFetch(`${BASE_URL}${user}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
}

function updateBookmark(id, updateData) {
  const newItem = JSON.stringify(updateData);
  return listApiFetch(`${BASE_URL}${user}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newItem
  });
}

function deleteBookmark(id) {
  return listApiFetch(`${BASE_URL}${user}/bookmarks/${id}`, {
    method: 'DELETE'
  });
}

function changeUser(newUser) {
  user = newUser;
  this.user = user;
  return user;
}

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  changeUser,
  user
};