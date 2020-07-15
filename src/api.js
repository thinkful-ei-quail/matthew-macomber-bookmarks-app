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

function getItems() {
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

function createItem(name) {
  const newItem = JSON.stringify({name});
  return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newItem
  });
}

function updateItem(id, updateData) {
  const newItem = JSON.stringify(updateData);
  return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newItem
  });
}

function deleteItem(id) {
  return listApiFetch(BASE_URL + '/items/' + id, {
    method: 'DELETE'
  });
}

export default {
  getItems,
  createItem,
  updateItem,
  deleteItem
};