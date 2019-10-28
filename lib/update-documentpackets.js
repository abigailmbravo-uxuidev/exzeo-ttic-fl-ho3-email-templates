'use strict';

const path = require('path');

const { getFiles, updateRecord } = require('exframe-company-package');

const packetsDirectory = path.join(__dirname, '../data/documents/packets');

const updatePacket = (context, packet) => {
  const { companyCode, state, product, name } = packet;

  return updateRecord(
    context,
    'documentpackets',
    {
      companyCode, state, product, name
    },
    packet
  );
};

const updatePackets = async context => {
  return context.taskPool.forEach(
    context,
    updatePackets.name,
    await getFiles(context, packetsDirectory),
    async packetFile => updatePacket(context, await packetFile.load())
  );
};

module.exports = { updatePackets };
