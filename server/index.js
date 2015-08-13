const koa = require('koa');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const cors = require('koa-cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const ws = require('./socketServer');
const hbs = require('koa-hbs');

/**
 * Setting config vars
 */
const staticPath = path.normalize(path.join(__dirname, '/../client/build'));
const assetsPath = path.normalize(path.join(__dirname, '/../client/images'));
const modelsPath = path.normalize(path.join(__dirname, '/models'));
const appPort = process.env.PORT || 3000;

/**
 * Connect to database
 */
const mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/insta-print';

mongoose.connect(mongoURI);
mongoose.connection.on('error', function(err) {
  console.log(err);
});

/**
 * Load the models
 */
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf('js')) {
    require(modelsPath + '/' + file);
  }
});


const app = koa();
// require after models initialization to prevent errors
const appRouter = require('./routes/app.js');
const proxyRouter = require('./routes/proxy.js');
const coinsRouter = require('./routes/coins.js');
const eventsRouter = require('./routes/events.js');

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
app.use(appRouter.routes());

// Start app
if (!module.parent) {
  app.server = app.listen(appPort);
  ws.listen(app.server);
  console.log('Server started, listening on ports: ' + appPort);
}
