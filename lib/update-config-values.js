'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const configurationValuesDirectory = path.join(__dirname, '../data/configurationvalues');

const updateConfigValue = (context, configValue) => {
    const { companyCode, state, product, version, key } = configValue;

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
