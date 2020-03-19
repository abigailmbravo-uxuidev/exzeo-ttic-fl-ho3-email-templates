'use strict';

const path = require('path');
const moment = require('moment-timezone');
const { system } = require('exframe-configuration').config.default;

const { getFiles, updateRecord } = require('exframe-company-package');

const configurationValuesDirectory = path.join(__dirname, '../data/configurationvalues');

const updateConfigValue = (context, configValue) => {
  const { companyCode, state, product, version, key } = configValue;

  if (configValue.environment) {
    const environmentValue = configValue.environment[system.environment];
    if (environmentValue === undefined) {
      throw new Error(`config [${key}] is not defined for environment [${system.environment}]`);
    }
    configValue.value = configValue.environment[system.environment];
    delete configValue.environment;
  }

  return updateRecord(context, 'configurationvalues',
    {
      companyCode, state, product, version: moment(version).toDate(), key
    },
    {
      ...configValue,
      version: moment(version).toDate()
    }
  );
};

const updateConfigValues = async context => {
  const configurationValuesFiles = await getFiles(context, configurationValuesDirectory);
  return context.taskPool.forEach(context, updateConfigValues.name,
    configurationValuesFiles,
    async ruleFile => updateConfigValue(context, await ruleFile.load())
  );
};

module.exports = { updateConfigValues };
