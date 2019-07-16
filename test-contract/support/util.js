'use strict';
const config = require('exframe-configuration').config;
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const db = require('../../lib/db');
const fileManager = require('../../lib/file-manager');

const taskPool = require('../../lib/task-pool').create();
taskPool.on('progress', ({ name, percentComplete }) => console.log(`${name} : ${percentComplete}% complete`));

const readFileAsync = promisify(fs.readFile);

const htmlTemplateDirectory = path.join(__dirname, '../../data/email/html');
const htmlTemplateTestDirectory = path.join(__dirname, '../data/email/html');
const emailDirectory = path.join(__dirname, '../../data/email/json');

const ISO_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z)?$/;

const formatPhone = (num) => {
	const formattedNumber = String(num).replace(/\D/g, '');
	if (Number.isNaN(formattedNumber) || formattedNumber.length !== 10) return num;
	const phoneFormat = formattedNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
	return (!phoneFormat) ? null : '(' + phoneFormat[1] + ') ' + phoneFormat[2] + '-' + phoneFormat[3];
};

const parseHtmlBody = (options, body) => {
	const replacements = options.variables;

	if (!body || !replacements) return body;

	let newBody = body;
	replacements.forEach((item) => {
		if (item.key && item.value) {
			const regex = new RegExp(`{{${item.key}}}`, 'g');

			if (ISO_REGEX.test(item.value)) {
				newBody = newBody.replace(regex, moment(item.value).format('MM/DD/YYYY'));
			}
			else if (String(item.key).toUpperCase().match(/PHONE/g)) {
				newBody = newBody.replace(regex, formatPhone(item.value));
			} else {
				newBody = newBody.replace(regex, item.value);
			}
		}
	});

	return newBody;
};

const sendRequest = (options) => {
	options.headers = { 'harmony-access-key': 'key', 'harmony-csp': 'TTIC:FL:HO3' };
	return axios(options);
};

const generateEmailMessage = (requestBody) => {
	const options = {
		method: 'POST',
		url: `${config.default.emailservice.url}:${config.default.emailservice.port}/v1/emailMessage`,
		data: requestBody
	};
	return sendRequest(options);
};

const getAllEmailTemplatesFromDB = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			db.connection.collection('emailtemplates').find({}).toArray((err, data) => err ? reject(err) : resolve(data));
		}, 500);
	});
};

const getEmailTemplate = async (context, email) => {
	const { name } = email;
	const htmlTemplatePath = `${context.htmlTemplateDir}/${name}`;
	const template = await readFileAsync(htmlTemplatePath, { encoding: 'utf8' });
	email.body = template;
	context.emailTemplates.push(email);
};

const getEmailTemplates = async (context) => {
	return context.taskPool.forEach(context, getEmailTemplates.name,
		await fileManager.getFiles(context, emailDirectory),
		async emailFile => getEmailTemplate(context, await emailFile.load())
	);
};

const getAllEmailTemplatesFromFiles = async () => {
	const context = { taskPool, htmlTemplateDir: htmlTemplateDirectory, emailTemplates: [] };
	await getEmailTemplates(context);
	return context.emailTemplates;
}

const getAllEmailTestTemplatesFromFiles = async () => {
	const context = { taskPool, htmlTemplateDir: htmlTemplateTestDirectory, emailTemplates: [] };
	await getEmailTemplates(context);
	return context.emailTemplates;
}

module.exports = {
	parseHtmlBody,
	generateEmailMessage,
	getAllEmailTemplatesFromDB,
	getAllEmailTemplatesFromFiles,
	getAllEmailTestTemplatesFromFiles
};
