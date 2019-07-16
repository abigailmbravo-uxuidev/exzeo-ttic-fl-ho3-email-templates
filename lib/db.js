'use strict';

const { data: { mongoUrl } } = require('exframe-configuration').config.default;
const db = require('exframe-db');
const logger = require('./logger');

db.init({ logger, dbUrl: mongoUrl });

module.exports = db.mongoose;