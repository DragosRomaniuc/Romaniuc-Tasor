const { validationResult } = require('express-validator/check');

module.exports = wrappedFunction => (
  req,
  res,
  next,
  template = '',
  data = {}
) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);
  console.log('am ajuns in eroare')
  // If form values are invalid, send error.
  // Else, pass wrappedFunction.
  if (errors.isEmpty()) return wrappedFunction(req, res, next, template);
  // If template passed, this is a page request so render page with errors.
  // Else, this is an API request so send JSON error.
  if (template)
    return res.render(template, { account: req.body, errors: errors.array() });
  res.status(500).send({ ...data, errors: errors.array() });
};
