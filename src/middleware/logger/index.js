const logger = require('infra/logger');
const morgan = require('morgan');
const transport = {
  stream: logger.stream,
};

module.exports= morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ');
}, transport);
