const addQueryStringParameter = (path, key, value) => {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = path.indexOf('?') !== -1 ? '&' : '?';
  
    if (path.match(re)) {
      return path.replace(re, '$1' + key + '=' + value + '$2');
    } 

    return path + separator + key + '=' + value;
};

module.exports = addQueryStringParameter