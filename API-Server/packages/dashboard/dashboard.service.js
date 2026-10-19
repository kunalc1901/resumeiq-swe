const { getMongooseConnection } = require('../../config/database.config');
const ResumeSchema = require('../resume/resume.schema');

/**
 * Returns the Resume model bound to the active mongoose connection.
 * @returns {Model}
 */
const getResumeModel = () => {
  const connection = getMongooseConnection();
  return connection.model('Resume', ResumeSchema);
};

/**
 * Method to get the latest analysed resume of a user. "Latest" means the most
 * recently uploaded resume that has an analysis attached.
 * @param {Object} query - supports user_id filter
 * @param {*} callback
 */
exports.getLatestAnalyzedResume = (query, callback) => {
  const Resume = getResumeModel();
  const filter = { analysis: { $ne: null } };
  if (query && query.user_id) {
    filter.user_id = query.user_id;
  }
  Resume.findOne(filter)
    .sort({ uploaded_at: -1 })
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};
