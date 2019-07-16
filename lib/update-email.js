'use strict';

const fs = require('fs');
const path = require('path');
const escape = require('escape-html');
const { promisify } = require('util');

const fileManager = require('./file-manager');
const { updateRecord } = require('./helpers');

const readFileAsync = promisify(fs.readFile);

const htmlDirectory = path.join(__dirname, '../data/email/html');
const emailDirectory = path.join(__dirname, '../data/email/json');

const updateEmailTemplate = async (context, email) => {
  const { companyCode, state, product, name } = email;
  const htmlTemplatePath = `${htmlDirectory}/${name}`;
  const template = await readFileAsync(htmlTemplatePath, { encoding: 'utf8' });
  email.body = template;

  return updateRecord(context, 'emailtemplates',
    {
      companyCode, state, product, name
    },
    email
  );
};

const updateEmail = async context => {
  return context.taskPool.forEach(context, updateEmail.name,
    await fileManager.getFiles(context, emailDirectory),
    async emailFile => updateEmailTemplate(context, await emailFile.load())
  );
};

module.exports = { updateEmail };
