const koa = require('koa');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const cors = require('koa-cors');
const path = require('path');
const fs = require('fs');
const ws = require('./socketServer');
const hbs = require('koa-hbs');

/**
 * Setting config vars
 */
const staticPath = path.normalize(path.join(__dirname, '/../client/build'));
const assetsPath = path.normalize(path.join(__dirname, '/../client/images'));
const appPort = process.env.PORT || 3000;


const app = koa();
// require after models initialization to prevent errors
const appRouter = require('./routes/app.js');
const proxyRouter = require('./routes/proxy.js');
const coinsRouter = require('./routes/coins.js');
const eventsRouter = require('./routes/events.js');
const printerRouter = require('./routes/printer.js');

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(koaStatic(staticPath));
app.use(koaStatic(assetsPath));
app.use(hbs.middleware({
  viewPath: path.normalize(path.join(__dirname, '../views'))
}));

app.use(proxyRouter.routes());
app.use(coinsRouter.routes());
app.use(eventsRouter.routes());
app.use(printerRouter.routes());
app.use(appRouter.routes());

// Start app
if (!module.parent) {
  app.server = app.listen(appPort);
  ws.listen(app.server);
  console.log('Server started, listening on ports: ' + appPort);
}
