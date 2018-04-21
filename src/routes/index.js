const { validator } = require('@localleague/middleware');
const getTeamDto    = require('../dto/get-dto');
const teams         = require('../controllers/team-controller');

module.exports = (server) => {
    server.get(
        { path: '/teams', name: 'getTeams' },
        validator.query,
        validator.fields(getTeamDto),
        teams.get
    );
    server.get(
        { path: '/teams/:id([0-9]+)', name: 'getTeamsById' },
        validator.query,
        validator.fields(getTeamDto),
        teams.getById
    );
    server.post(
        { path: '/teams', name: 'postTeams' },
        teams.post
    );
    server.put(
        { path: '/teams/:id([0-9]+)', name: 'putTeams' },
        teams.put
    );
    server.del(
        { path: '/teams/:id([0-9]+)', name: 'deleteTeams' },
        teams.delete
    );
    server.get(
        { path: '/teams/swagger.json', name: 'docsTeams' },
        teams.docs
    );
};
