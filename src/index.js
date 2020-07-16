import $ from 'jquery';
import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';
import special from './special';


const main = () => {
  api.getBookmarks()
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      bookmarkList.render();
    });

  bookmarkList.bindEventListeners();
  bookmarkList.render();
  special.special();
};



$(main);
