'use strict';

const path = require('path');
const moment = require('moment-timezone');

const { getFiles, updateRecord } = require('exframe-company-package');

const rulesDirectory = path.join(__dirname, '../data/rules');

const updateRule = (context, rule) => {
  const { companyCode, state, product, code, effectiveDate, type } = rule;

  return updateRecord(context, 'rules',
    {
      companyCode, state, product, code, effectiveDate: moment(effectiveDate).toDate(), type
    }, 
    {
      ...rule,
      effectiveDate: moment(effectiveDate).toDate()
    }
  );
};

const updateRules = async context => {
  return context.taskPool.forEach(context, updateRules.name,
    await getFiles(context, rulesDirectory),
    async ruleFile => updateRule(context, await ruleFile.load())
  );
};

module.exports = { updateRules };
