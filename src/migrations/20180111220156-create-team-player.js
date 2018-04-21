
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('team_player', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        team_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false,
        },
        player_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    down: queryInterface => queryInterface.dropTable('team_player'),
};
