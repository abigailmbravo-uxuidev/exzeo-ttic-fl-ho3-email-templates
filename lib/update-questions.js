'use strict';

const path = require('path');

const { getFiles, updateRecord } = require('exframe-company-package');

const dataDirectory = path.join(__dirname, '../data/questions');

const updateData = (context, data) => {
  const { companyCode, state, product, name } = data;

  return updateRecord(
    context,
    'questions',
    {
      companyCode, state, product, name
    },
    data
  );
};

const updateQuestions = async context => {
  const dataFiles = await getFiles(context, dataDirectory);
  return context.taskPool.forEach(
    context,
    updateData.name,
    dataFiles,
    async dataFile => updateData(context, await dataFile.load())
  );
};

module.exports = { updateQuestions };
