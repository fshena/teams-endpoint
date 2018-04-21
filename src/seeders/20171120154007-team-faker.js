

const faker = require('faker');

module.exports = {
    up: (queryInterface) => {
        const teams = [];
        for (let i = 0; i < 100; i++) {
            teams.push({
                name: faker.internet.userName(),
                logo: faker.image.sports(),
                created_at: faker.date.past(),
                updated_at: faker.date.past(),
            });
        }

        return queryInterface.bulkInsert('team', teams, {});
    },

    down: queryInterface => queryInterface.bulkDelete('team', null, {}),
};
