const ws = require('../socketServer');
const router = require('koa-router')();
const models = require('../models');
const Event = models.Event;
const constants = require('../constants');

router.get('/coins', function* () {
  try {
    var payload = this.query;
    var value = payload.value;

    this.status = 200;
    this.body = value;

    var dbRecord = yield Event.create({
      eventType: constants.EVENT_TYPES.COIN_ACCEPTED,
      data: value
    });

    ws.notify('money.updated', value);

  } catch (err) {
    this.throw(err);
  }

});

module.exports = router;
