const objMapper = require('object-mapper');

/**
 * The Team json structure needed for storing a new entry.
 * @param {Object} team
 * @return {*}
 */
module.exports = (team) => {
    const src = {
        name: 'name',
        logo: 'logo',
        isActive: 'is_active',
    };
    return objMapper(team, src);
};
