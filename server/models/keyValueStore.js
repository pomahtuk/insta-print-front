module.exports = function(sequelize, DataTypes) {
  var keyValueStore = sequelize.define('keyValueStore', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  });

  return keyValueStore;
};
