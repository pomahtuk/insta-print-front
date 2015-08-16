module.exports = function(sequelize, DataTypes) {
  var InstagramKey = sequelize.define('InstagramKey', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  });

  return InstagramKey;
};
