module.exports = (sequelize, DataTypes) => {
    return sequelize.define('file', {
        host: DataTypes.STRING,
        path: DataTypes.STRING,

        name: DataTypes.STRING,
        directory: DataTypes.STRING,
        extension: DataTypes.STRING,
        container: DataTypes.STRING,

        videoCodec: DataTypes.STRING,
        audioCodec: DataTypes.STRING,

        duration: DataTypes.DOUBLE,

        hash: DataTypes.STRING

    });
};
