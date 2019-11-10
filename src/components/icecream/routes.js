const express = require('express');
const logger = require('infra/logger');
// eslint-disable-next-line new-cap
const router = express.Router();

module.exports = (services) => {
  router.get('/top5', async (req, res) => {
    try {
      res.send(await services.top5());
    } catch (error) {
      logger.error(error);
      res.status(500).send({
        name: 'DataRequestError',
        message: 'Sorry, we were unable to fetch the required',
      });
    }
  });
  return router;
};
