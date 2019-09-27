'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const underwritingRulesDirectory = path.join(__dirname, '../data/rules');
const policyStateRulesDirectory = path.join(__dirname, '../data/rules/policyState');

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
  const underwritingFiles = await getFiles(context, underwritingRulesDirectory);
  const policyStateFiles = await  getFiles(context, policyStateRulesDirectory);
  return context.taskPool.forEach(context, updateRules.name,
    underwritingFiles.concat(policyStateFiles),
    async ruleFile => updateRule(context, await ruleFile.load())
  );
};

module.exports = { updateRules };