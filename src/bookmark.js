import cuid from 'cuid';

const validateName = name => {
  if (!name) throw new TypeError('Name cannot be blank.');
};

const validateUrl = url => {
  if (!url) throw new TypeError('URL cannot be blank.');
  const urlPattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  console.log(urlPattern.test(url));
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