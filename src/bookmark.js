import cuid from 'cuid';

const validateName = name => {
  if (!name) throw new TypeError('Name cannot be blank.');
};

const validateUrl = url => {
  if (!url) throw new TypeError('URL cannot be blank.');
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