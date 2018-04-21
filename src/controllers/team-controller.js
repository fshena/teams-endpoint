const { paginationLinks }     = require('@localleague/helpers');
const httpStatus              = require('http-status-codes');
const yaml                    = require('yamljs');

const { query: { maxLimit } } = require('../config/api-config');
const teamMySqlRepository     = require('../repository/mysql/team-repository');
const errorController         = require('./error-controller');
const getTeamDto              = require('../dto/get-dto');
const postTeamDto             = require('../dto/post-dto');
const putTeamDto              = require('../dto/put-dto');
const teamCollectionDto       = require('../dto/collection-dto');

/**
 * Query database for using team id.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.getById = (req, res, next) => {
    const sendResponse = (team) => {
        const status = team ? httpStatus.OK : httpStatus.NOT_FOUND;
        res.status(status);
        if (status === httpStatus.NOT_FOUND) {
            return res.json();
        }
        return res.json(getTeamDto.map(team));
    };
    teamMySqlRepository
        .getTeamById({ teamId: req.params.id, fields: req.params.fields })
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Get all teams form the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.get = (req, res, next) => {
    const sendResponse = (teams) => {
        res.set({
            Link: paginationLinks(req, teams.count, maxLimit),
            'X-Total-Count': teams.count,
        });
        res.status(httpStatus.OK);
        res.json(teamCollectionDto(teams.rows));
    };
    teamMySqlRepository
        .getAllTeams(req)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Save teams in the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.post = (req, res, next) => {
    const sendResponse = (team, created) => {
        const createdTeam = team.get({ plain: true });
        let status = httpStatus.CREATED;
        // If no new team was created because it already exists.
        if (!created && createdTeam) {
            status = httpStatus.NOT_MODIFIED;
        }
        // The link where to find the new team or the existing one.
        res.header('Content-Location', `${req.route.path}/${createdTeam.id}`);
        res.status(status);
        res.json(getTeamDto.map(createdTeam));
    };
    teamMySqlRepository
        .createTeam(postTeamDto(req.body))
        .spread(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Update teams data.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.put = (req, res, next) => {
    const sendResponse = (updated) => {
        const status = updated[0] > 0
            ? httpStatus.NO_CONTENT
            : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    teamMySqlRepository
        .updateTeam(req.params.id, putTeamDto(req.body))
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Delete team from the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.delete = (req, res, next) => {
    const sendResponse = (deleted) => {
        // Send different status if record for deletion exists or not.
        const status = deleted ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    teamMySqlRepository
        .deleteTeam(req.params.id)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};


/**
 * Send a json representation of the swagger file.
 * @param {Object} req
 * @param {Object} res
 */
exports.docs = (req, res) => {
    const nativeObj = yaml.load(`${__dirname}/../../docs/swagger.yaml`);
    res.json(nativeObj);
};
