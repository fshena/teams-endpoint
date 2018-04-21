const objHelper = require('@localleague/helpers').object;

const objMapper = require('object-mapper');
const extract = require('extract');

const mapping = {
    id: 'id',
    name: 'name',
    logo: 'logo',
    is_active: 'isActive',
};

module.exports = {
    getMap: () => mapping,
    /**
     * The Team entity structure that will be returned in the response.
     * @param {Object} team
     * @param {Boolean} reverse
     * @return {*}
     */
    map: (team, reverse = false) => {
        // only map requested fields in order to avoid empty nested fields
        const mapFields = extract(mapping, Object.keys(team));
        const src = reverse ? objHelper.reverse(mapFields) : mapFields;
        return objMapper(team, src);
    },
};
