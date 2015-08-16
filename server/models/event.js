module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    eventType: DataTypes.STRING,
    timeStamp: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    data: DataTypes.STRING
  });

  return Event;
};
