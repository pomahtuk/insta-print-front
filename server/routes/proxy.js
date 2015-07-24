const router = require('koa-router')();
const request = require('koa-request');

// pass everything to react
router.get('/proxy', function* () {
  try {
    var payload = this.query;
    var url = payload.url;
    delete payload.url;

    var options = {
      method: 'GET',
      uri: url,
      qs: payload
    };

    var result = yield request(options);

    this.status = 200;
    this.body = result.body;

  } catch (err) {
    this.throw(err);
  }

});

module.exports = router;
