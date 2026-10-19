const { isValidObjectId } = require('mongoose');
const { getMongooseConnection } = require('../../config/database.config');
const JobMatchSchema = require('./job-match.schema');
const ResumeSchema = require('../resume/resume.schema');

/**
 * Returns the JobMatch model bound to the active mongoose connection.
 * @returns {Model}
 */
const getJobMatchModel = () => {
  const connection = getMongooseConnection();
  return connection.model('JobMatch', JobMatchSchema);
};

/**
 * Returns the Resume model bound to the active mongoose connection.
 * @returns {Model}
 */
const getResumeModel = () => {
  const connection = getMongooseConnection();
  return connection.model('Resume', ResumeSchema);
};

/**
 * Fields needed to render a job match card in the history list. The heavy
 * analysis payload and the raw job description are only sent by the
 * single-match endpoint.
 */
const LIST_PROJECTION = {
  resume_id: 1,
  created_at: 1,
  'analysis.match_score': 1,
  'analysis.match_label': 1,
  'analysis.job': 1,
};

/**
 * Loads the resumes referenced by job matches, keyed by resume id. A match
 * may reference a resume that has since been deleted; those are omitted from
 * the map so callers can fall back to a "resume unavailable" state.
 * @param {String[]} resumeIds
 * @returns {Promise<Map<String, {id: String, file_name: String}>>}
 */
const loadResumesByIds = async (resumeIds) => {
  const validIds = [...new Set(resumeIds)].filter((id) => id && isValidObjectId(id));
  if (!validIds.length) {
    return new Map();
  }
  const Resume = getResumeModel();
  const resumes = await Resume.find({ _id: { $in: validIds } }, { file_name: 1 });
  return new Map(
    resumes.map((resume) => [
      resume._id.toString(),
      { id: resume._id.toString(), file_name: resume.file_name },
    ]),
  );
};

/**
 * Attaches the `resume` reference (`{ id, file_name }` or null) each match was
 * analyzed against, so the UI can show which resume was used.
 * @param {Object[]} matches - plain job match objects
 * @returns {Promise<Object[]>}
 */
const withResumeRef = async (matches) => {
  const resumesById = await loadResumesByIds(matches.map((match) => match.resume_id));
  return matches.map((match) => ({
    ...match,
    resume: resumesById.get(match.resume_id) || null,
  }));
};

/**
 * Method to get all job matches of a user from the database, newest first,
 * with only the summary fields the history cards need.
 * @param {Object} query - supports user_id filter
 * @param {*} callback
 */
exports.getJobMatches = (query, callback) => {
  const JobMatch = getJobMatchModel();
  const filter = {};
  if (query && query.user_id) {
    filter.user_id = query.user_id;
  }
  JobMatch.find(filter, LIST_PROJECTION)
    .sort({ created_at: -1 })
    .lean()
    .then((data) => withResumeRef(data))
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

/**
 * Method to get a single job match (full analysis) by document id.
 * @param {String} id
 * @param {*} callback
 */
exports.getJobMatchById = (id, callback) => {
  const JobMatch = getJobMatchModel();
  JobMatch.findById(id)
    .lean()
    .then(async (data) => {
      if (!data) {
        return null;
      }
      const [match] = await withResumeRef([data]);
      return match;
    })
    .then((data) => {
      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};
