/**
 * Function for checking the access level of the user
 * @param {Object} request
 * @param {Object} response
 * @param {Function} fn Function to be called if access level is admin
 */
export function accessChecker(request, response, fn) {
  const user = request.user;

  if (user.admin && typeof fn === 'function') {
    fn();
  } else {
    response.status(403).send('Forbidden');
  }
}

/**
 * Function for generating callback functions to queries to MongoDB
 * @param {Object} response Response object
 * @param {Function=} customCallback Custom callback for the query, not the trivial one
 * @returns {Function}
 */
export function responseErrorHandler(response, customCallback) {
  function callbackHandler(err, data) {
    if (err) {
      response.send(err);
    }

    response.json(data);
  }

  return typeof customCallback === 'function' ? customCallback : callbackHandler;
}

