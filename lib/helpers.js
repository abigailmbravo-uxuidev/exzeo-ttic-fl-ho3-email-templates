'use strict';

const moment = require('moment-timezone');

const db = require('./db');

const editedBy = ({ userId, userName }) => ({ userId, userName });
const editFields = ({ user }, doc = {}) => ({
  createdAt: doc.createdAt ? moment(doc.createdAt) : moment.utc().toDate(),
  createdBy: doc.createdBy || editedBy(user),
  updatedAt: moment.utc().toDate(),
  updatedBy: editedBy(user),
})

const updateRecord = (context, collection, query, data) =>
  db.connection.collection(collection).updateOne(
    query, 
    {
      $set: {
        ...data,
        ...editFields(context, data)
      }
    },
    {
      upsert: true
    }
  );

module.exports = {
  editFields,
  updateRecord
};
