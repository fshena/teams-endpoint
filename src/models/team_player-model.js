
module.exports = (sequelize, DataTypes) => {
    const teamPlayer = sequelize.define('TeamPlayer', {
        team_id: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        player_id: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        freezeTableName: true,
        tableName: 'team_player',
        underscored: true,
    });
    return teamPlayer;
};
