import cuid from 'cuid';

const validateName = name => {
  if (!name) throw new TypeError('Name cannot be blank.');
};

const validateUrl = url => {
  if (!url) throw new TypeError('URL cannot be blank.');
  const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (!urlPattern.test(url)) throw new TypeError('URL needs to be a valid URL.');
};

const create = (name, rating, url, desc) => {
  return {
    id : cuid(),
    title : name,
    rating : rating,
    url : url,
    description : desc,
    expanded : false
  };
};

export default {
  validateName,
  validateUrl,
  create
};