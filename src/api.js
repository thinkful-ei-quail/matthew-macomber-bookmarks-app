const BASE_URL = 'https://thinkful-list-api.herokuapp.com/matthewmacomber';


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
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

function createBookmark(bookmark) {
  const newBookmark = JSON.stringify(bookmark);
  return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
}

function updateBookmark(id, updateData) {
  const newItem = JSON.stringify(updateData);
  return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newItem
  });
}

function deleteBookmark(id) {
  return listApiFetch(BASE_URL + '/items/' + id, {
    method: 'DELETE'
  });
}

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};