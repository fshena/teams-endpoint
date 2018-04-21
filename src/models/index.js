const { db }          = require('@localleague/database');
const teamModel       = require('./team-model');
const teamPlayerModel = require('./team_player-model');

const models = [
    teamModel,
    teamPlayerModel
];

module.exports = db.loadModels(models);
