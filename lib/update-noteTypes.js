'use strict';

const path = require('path');

const { getFiles, updateRecord } = require('exframe-company-package');

const noteTypesDirectory = path.join(__dirname, '../data/noteTypes');

const updateNoteType = (context, noteTypeData) => {
  const { companyCode, state, product, noteType } = noteTypeData;

  return updateRecord(
    context,
    'master',
    {
      companyCode, state, product, noteType
    },
    noteTypeData
  );
};

const updateNoteTypes = async context => {
  const noteTypeFiles = await getFiles(context, noteTypesDirectory);
  return context.taskPool.forEach(
    context,
    updateNoteType.noteType,
    noteTypeFiles,
    async ruleFile => updateNoteType(context, await ruleFile.load())
  );
};

module.exports = { updateNoteTypes };
