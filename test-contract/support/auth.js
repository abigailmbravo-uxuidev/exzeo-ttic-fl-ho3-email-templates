'use strict';

const axios = require('axios');
const shortid = require('shortid');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const tticH03Resources = [];

const securityUsers = new Map();

securityUsers.set('TTIC_CSR_HO3', {
  userType: 'CSR',
  profileProperties: {},
  securityResources: tticH03Resources
});

const getAccessToken = async (securityUserKey) => {
  const securityUser = securityUsers.get(securityUserKey);

  const { data: idToken } = await axios({
    method: 'POST',
    url: 'https://localhost:8888/profile/clone',
    data: {
      userType: securityUser.userType,
      profileProperties: { ...securityUser.profileProperties, sub: shortid.generate() },
      securityResources: securityUser.securityResources
    }
  });

  const { data: accessToken } = await axios({
    method: 'GET',
    url: 'http://localhost:8181/accessToken',
    headers: {
      authorization: `Bearer ${idToken}`
    }
  });

  return accessToken;
};

module.exports = { getAccessToken };
