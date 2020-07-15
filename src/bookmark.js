import cuid from 'cuid';

const validateName = name => {
  if (!name) throw new TypeError('Name cannot be blank.');
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
0};

export default {
  validateName,
  create
};