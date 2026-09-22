const path = require('node:path');
const appRoot = require('app-root-path');

/**
 * As per API Guidelines
 * Endpoint Return Values
 *   GET: 200: Object with pagination element, and results array,
 *   POST: 200: Singular object which is created
 *   PUT: 200: Singular object which was updated
 *   PATCH: 200: Singular object which was updated
 *   DELETE: 204: No body
 *
 * @param {*} err
 * @param {*} data
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.handleResponse = (err, data, req, res, next) => {
  if (data) {
    let status;
    switch (req.method) {
      case 'GET':
      case 'PUT':
      case 'PATCH':
        status = 200;
        break;
      case 'POST':
        status = 200;
        break;
      case 'DELETE':
        status = 200;
        break;
      default:
        status = res.statusCode || 200;
        break;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(status).send(data);
  } else {
    return next(err);
  }
};

/**
 * As per API Guidelines
 * Endpoint Return Values
 *   GET: 200: Object with pagination element, and results array,
 *   POST: 200: Singular object which is created
 *   PUT: 200: Singular object which was updated
 *   PATCH: 200: Singular object which was updated
 *   DELETE: 204: No body
 *
 * @param {*} err
 * @param {*} file
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.handleFileResponse = (err, file, req, res, next) => {
  if (file) {
    const status = 200;

    // To create the absolute path of file if file path is relative
    if (!path.isAbsolute(file)) {
      file = `${appRoot}/${file}`;
    }
    res.status(status).sendFile(file);
  } else {
    return next(err);
  }
};