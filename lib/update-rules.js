'use strict';

const path = require('path');
const moment = require('moment-timezone');
const fs = require('fs');
const _ = require('lodash');


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

  underwritingFiles.forEach((val, index) => {
    let underWritingFilePath = underwritingRulesDirectory + '/' + val.filePath;
    if(!fs.existsSync(underWritingFilePath) || fs.lstatSync(underWritingFilePath).isDirectory()){
      underwritingFiles.splice(index, 1);
    }
  });
  policyStateFiles.forEach((val, index) => {
    let policyStateFilePath = policyStateRulesDirectory + '/' + val.filePath;
    if(!fs.existsSync(policyStateFilePath) || fs.lstatSync(policyStateFilePath).isDirectory()){
      policyStateFiles.splice(index, 1);
    }
  });
  return context.taskPool.forEach(context, updateRules.name,
    underwritingFiles.concat(policyStateFiles),
    async ruleFile => updateRule(context, await ruleFile.load())
  );
};

module.exports = { updateRules };
