const {v1Router} = require('interfaces/http');
const axios = require('axios');
const services = require('./services')(axios);
const routes = require('./routes')(services);
v1Router.use('/icecream', routes);

