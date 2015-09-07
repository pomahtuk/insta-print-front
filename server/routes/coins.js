const ws = require('../socketServer');
const router = require('koa-router')();
const models = require('../models');
const keyValueStore = models.keyValueStore;
const Event = models.Event;
const constants = require('../constants');

function* getCoinsStore() {
  var store = yield keyValueStore.findOrCreate({
    where: {key: constants.COIN_KEY}
  });
  return store[0] || {};
}

function* writeEvent(value) {
  yield Event.create({
    eventType: constants.EVENT_TYPES.COIN_ACCEPTED,
    data: value
  });
}

function* coinAcceptorHandler() {
  try {
    var payload = this.query;
    var value = payload.value;
    var store = yield getCoinsStore();
    var storeValue = ~~store.value;
    var newValue = storeValue + ~~value;

    this.status = 200;
    this.body = newValue;

    yield writeEvent(value);
    yield store.update({value: newValue.toString()});

    ws.notify('money.updated', value);

  } catch (err) {
    // write failure event
    this.throw(err);
  }

}

module.exports = coinAcceptorHandler;
