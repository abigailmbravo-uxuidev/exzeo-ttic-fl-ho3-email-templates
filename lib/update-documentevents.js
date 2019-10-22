'use strict';

const path = require('path');
const { getFiles, updateRecord } = require('exframe-company-package');

const eventsDirectory = path.join(__dirname, '../data/documents/events');

const updateEvent = (context, documentEvent) => {
  const { companyCode, state, product, name } = documentEvent;

  return updateRecord(
    context,
    'documentevents',
    {
      companyCode, state, product, name
    },
    documentEvent
  );
};

const updateEvents = async context => {
  return context.taskPool.forEach(
    context,
    updateEvents.name,
    await getFiles(context, eventsDirectory),
    async eventFile => updateEvent(context, await eventFile.load())
  );
};

module.exports = { updateEvents };
