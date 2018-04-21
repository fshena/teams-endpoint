
module.exports = (sequelize, DataTypes) => {
    const team = sequelize.define('Team', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                is: ['^[a-zA-Z0-9-. ]+$', 'i'],
                len: [3, 100],
                notEmpty: true,
            },
        },
        logo: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                is: [
                    '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)',
                    'i'],
            },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                isBoolean: true,
                notEmpty: true,
            },
        },
    }, {
        freezeTableName: true,
        tableName: 'team',
        underscored: true,
    });
    return team;
};
