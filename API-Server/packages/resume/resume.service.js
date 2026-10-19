const { getMongooseConnection } = require('../../config/database.config');
const ResumeSchema = require('./resume.schema');

/**
 * Returns the Resume model bound to the active mongoose connection.
 * @returns {Model}
 */
const getResumeModel = () => {
  const connection = getMongooseConnection();
  return connection.model('Resume', ResumeSchema);
};

/**
 * Method to get resumes for a user from the database, newest first.
 * @param {Object} query - supports user_id filter
 * @param {*} callback
 */
exports.getResumes = (query, callback) => {
  const Resume = getResumeModel();
  const filter = {};
  if (query && query.user_id) {
    filter.user_id = query.user_id;
  }
  Resume.find(filter)
    .sort({ uploaded_at: -1 })
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};
