import $ from 'jquery';
import api from './api';
import bookmarkList from './bookmark-list';
import store from './store';

const generateSpecial = () => {
  return `
    <form class="js-special-form">
      <label for="special">Special:</label>
      <input type="text" name="special" id="specialVal" placeholder="Special ;-)"/>
      <input type="submit" name"specialBtn" id="specialBtn" value="Special"/>
    </form>
  `;
};

const specialEvent = () => {
  if ( window.addEventListener ) {
    var kkeys = [], konami = '38,38,40,40,37,39,37,39,66,65';
    window.addEventListener('keydown', function(e){
      kkeys.push( e.keyCode );
      if ( kkeys.toString().indexOf( konami ) >= 0 )  {
        kkeys = [];
        $('.user').html(generateSpecial());
      }
    }, true);
  }
};

const handleSpecialInput = () => {
  $('.user').on('click', '#specialBtn', event => {
    event.preventDefault();
    api.user = api.changeUser($('#specialVal').val());
    $('.user').html('');
    api.getBookmarks()
      .then((items) => {
        items.forEach((item) => store.addBookmark(item));
        bookmarkList.render();
      });
  });
};

const special = () => {
  specialEvent();
  handleSpecialInput();
};

export default {
  special
};