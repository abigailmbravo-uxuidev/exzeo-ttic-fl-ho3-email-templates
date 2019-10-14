'use strict';

const path = require('path');
const moment = require('moment-timezone');


const { getFiles, updateRecord } = require('exframe-company-package');

const formFieldsDirectory = path.join(__dirname, '../data/formfields');

const updateFormField = (context, formFields) => {
    const { companyCode, state, product, version, path, documents} = formFields;

    return updateRecord(context, 'formfields',
        {
            companyCode, state, product, version: moment(version).toDate(), path, documents
        },
        {
            ...formFields,
            version: moment(version).toDate()
        }
    );
};

const updateFormFields = async context => {
    const formFieldsFiles = await  getFiles(context, formFieldsDirectory);
    return context.taskPool.forEach(context, updateFormFields.name,
        formFieldsFiles,
        async ruleFile => updateFormField(context, await ruleFile.load())
    );
};

module.exports = { updateFormFields };
