const logger = require('infra/logger');
const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;
const loggerMiddleware = require('middleware/logger');

app.use(loggerMiddleware);

// eslint-disable-next-line new-cap
const v1Router = express.Router();
app.use('/api/v1', v1Router);

httpServer.listen(port, function() {
  logger.info(`listening on *:${port}`);
});


module.exports = {
  httpServer,
  app,
  v1Router,
};
