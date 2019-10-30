'use strict';

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 update rules', '(updates rules)')
  .example('$0 update email', '(updates email templates)')
  .example('$0 update config', '(updates configuration values templates)')
  .example('$0 update coverage', '(updates coverage details templates)')
  .example('$0 update form', '(updates form fields templates)')
  .example('$0 update documentevents', '(updates document event configurations)')
  .example('$0 update documentpackets', '(updates document packet configurations)')
  .example('$0 update --all', '(updates all templates: email, rules, config, coverage, document events, document packets, and form fields)')
  .help('h')
  .alias('h', 'help')
  .argv;

const updateCommand = argv._.includes('update');
const updateAll = updateCommand ? (argv.all || false) : false;
const updateRules = (updateAll) || (updateCommand && argv._.includes('rules'));
const updateEmail = (updateAll) || (updateCommand && argv._.includes('email'));
const updateConfigValues = (updateAll) || (updateCommand && argv._.includes('config'));
const updateCoverageDetails = (updateAll) || (updateCommand && argv._.includes('coverage'));
const updateFormFields = (updateAll) || (updateCommand && argv._.includes('form'));
const updateDocumentEvents = (updateAll) || (updateCommand && argv._.includes('documentevents'));
const updateDocumentPackets = (updateAll) || (updateCommand && argv._.includes('documentpackets'));

const service = require('exframe-service');
service.init({ logger: require('./lib/logger'), timeout: 0 });

const taskPool = require('exframe-task-pool').create();
taskPool.on('progress', ({ name, percentComplete }) => console.log(`${name}: ${percentComplete}`));

const user = { userId: 'mpardue', userName: 'mpardue' };

const context = {
  user,
  taskPool
};

console.log(argv);

Promise.all([
  updateRules && require('./lib/update-rules').updateRules(context),
  updateEmail && require('./lib/update-email').updateEmail(context),
  updateConfigValues && require('./lib/update-config-values').updateConfigValues(context),
  updateCoverageDetails && require('./lib/update-coverage-details').updateCoverageDetails(context),
  updateFormFields && require('./lib/update-form-fields').updateFormFields(context),
  updateDocumentEvents && require('./lib/update-documentevents').updateEvents(context),
  updateDocumentPackets && require('./lib/update-documentpackets').updatePackets(context)
])
  .then(() => service.gracefulShutdown());
