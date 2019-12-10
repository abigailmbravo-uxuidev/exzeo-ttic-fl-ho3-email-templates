'use strict';

const path = require('path');

const { getFiles, updateRecord } = require('exframe-company-package');

const engineDirectory = path.join(__dirname, '../data/engines');

const updateEngine = async (context, engine) => {
  const { companyCode, state, product, rateCode } = engine;

  return updateRecord(context, 'engines',
    {
      companyCode, state, product, rateCode
    },
    engine);
};

const updateRatingEngines = async context => {
  return context.taskPool.forEach(context, updateRatingEngines.name,
    await getFiles(context, engineDirectory),
    async engineFile => updateEngine(context, await engineFile.load()));
};

module.exports = { updateRatingEngines };
