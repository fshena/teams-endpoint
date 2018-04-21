const getTeamDto = require('./get-dto');

/**
 * The Team entity collection structure that
 * will be returned in the response.
 * @param {Object[]} teams
 * @return {*}
 */
module.exports = (teams) => {
    const teamsDto = [];
    teams.forEach((team, index) => {
        teamsDto[index] = getTeamDto.map(team);
    });
    return teamsDto;
};
