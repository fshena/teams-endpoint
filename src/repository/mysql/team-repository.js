const { object: objHelper }   = require('@localleague/helpers');
const { Op }                  = require('sequelize');

const { query: { maxLimit } } = require('../../config/api-config');
const models                  = require('../../models');
const getTeamDto              = require('../../dto/get-dto');

/**
 * Get specific team entry.
 * @param {{teamId:numeric, fields:array}} payload
 * @return {Promise<Array<Model>>}
 */
exports.getTeamById = (payload) => {
    const sqlQuery = {
        where: {
            [Op.and]: {
                id: payload.teamId,
            },
        },
        raw: true,
    };
    if (payload.fields) {
        // get the mysql field names corresponding to the fields in the request
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getTeamDto.getMap(),
            payload.fields.split(',')
        );
    }
    return models.Team.findOne(sqlQuery);
};

/**
 * Get all teams.
 * @param {Object} req
 * @return {Promise<Array<Model>>}
 */
exports.getAllTeams = (req) => {
    const limit = parseInt(req.query.limit, 10) || maxLimit;
    const sqlQuery = {
        limit,
        offset: parseInt(req.query.offset, 10) * limit || 0,
        order: [
            [
                req.query.sort || models.Team.attributes.name,
                req.query.order || 'ASC',
            ],
        ],
        raw: true,
    };
    if (req.params.fields) {
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getTeamDto.getMap(),
            req.params.fields.split(',')
        );
    }
    return models.Team.findAndCountAll(sqlQuery);
};

/**
 * Create new team entry if the team doesn't already exist.
 * @param {Object} newTeam
 * @return {Promise<Model, created>}
 */
exports.createTeam = (newTeam) => {
    const conditions = {
        where: {
            [Op.and]: {
                name: newTeam.name,
            },
        },
        defaults: newTeam,
    };
    return models.Team.findOrCreate(conditions);
};

/**
 * Update team entry.
 * @param {integer} id
 * @param {Object} updateTeam
 * @return {Promise}
 */
exports.updateTeam = (id, updateTeam) => {
    const conditions = {
        where: {
            [Op.and]: {
                id,
            },
        },
    };
    return models.Team.update(updateTeam, conditions);
};

/**
 * Delete specific team entry.
 * @param {integer} id
 * @return {Promise}
 */
exports.deleteTeam = (id) => {
    const conditions = {
        where: {
            [Op.and]: {
                id,
            },
        },
    };
    return models.Team.destroy(conditions);
};
