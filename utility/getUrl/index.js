const baseUrl =
  process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '';
module.exports = req => req.protocol + '://' + req.get('host') + baseUrl;
