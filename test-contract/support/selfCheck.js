'use strict';

const axios = require('axios');
const { URL } = require('url');

const { config: { default: { ruleservice: { port } } } } = require('exframe-configuration');

const selfCheck = ({ accessToken }) => {
  const url = new URL(`http://localhost:${port}/selfCheck`);

  return axios({
    method: 'post',
    url: url.toString(),
    headers: {
      'harmony-access-key': accessToken
    },
    validateStatus: null
  });
};

module.exports = { selfCheck };
