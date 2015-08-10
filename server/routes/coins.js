const ws = require('../socketServer');
const router = require('koa-router')();

router.get('/coins', function* () {
  try {
    var payload = this.query;
    var value = payload.value;

    this.status = 200;
    this.body = value;

    ws.notify('money.updated', value);

  } catch (err) {
    this.throw(err);
  }

});

module.exports = router;
