'use strict';

const path = require('path');

const { getFiles, updateRecord } = require('exframe-company-package');
// const fileManager = require('./file-manager');
// const { updateRecord } = require('./helpers');

const rulesDirectory = path.join(__dirname, '../data/rules');

const updateRule = (context, rule) => {
  const { companyCode, state, product, code } = rule;

  return updateRecord(context, 'rules',
    {
      companyCode, state, product, code
    }, 
    rule
  );
};

const updateRules = async context => {
  return context.taskPool.forEach(context, updateRules.name,
    await getFiles(context, rulesDirectory),
    async ruleFile => updateRule(context, await ruleFile.load())
  );
};

module.exports = { updateRules };
