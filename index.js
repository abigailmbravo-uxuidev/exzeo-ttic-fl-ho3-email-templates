'use strict';

const service = require('exframe-service');
const taskPool = require('exframe-task-pool').create();

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 update rules', '(updates rules)')
  .example('$0 update email', '(updates email templates)')
  .example('$0 update config', '(updates configuration values templates)')
  .example('$0 update coverage', '(updates coverage details templates)')
  .example('$0 update form', '(updates form fields templates)')
  .example('$0 update documentevents', '(updates document event configurations)')
  .example('$0 update documentpackets', '(updates document packet configurations)')
  .example('$0 update noteTypes', '(updates note types)')
  .example('$0 update engines', '(updates rating engines)')
  .example('$0 update costengineequations', '(updates cost-engine equations)')
  .example('$0 update costengineselect', '(updates cost-engine select)')
  .example('$0 update costfactoradjustments', '(updates cost-engine adjustments)')
  .example('$0 update costfactordeductibles', '(updates cost-engine deductibles)')
  .example('$0 update costfactors', '(updates cost-engine factors)')
  .example('$0 update questions', '(updates questions)')
  .example('$0 update --all', '(updates all templates: email, rules, config, coverage, document events, document packets, form fields, costengineequations, costengineselect, costfactoradjustments, costfactordeductibles, questions, and costfactors)')
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
const updateNoteTypes = (updateAll) || (updateCommand && argv._.includes('noteTypes'));
const updateRatingEngines = (updateAll) || (updateCommand && argv._.includes('engines'));
const updateCostEngineEquations = (updateAll) || (updateCommand && argv._.includes('costengineequations'));
const updateCostEngineSelect = (updateAll) || (updateCommand && argv._.includes('costengineselect'));
const updateCostFactorAdjustments = (updateAll) || (updateCommand && argv._.includes('costfactoradjustments'));
const updateCostFactorDeductibles = (updateAll) || (updateCommand && argv._.includes('costfactordeductibles'));
const updateCostFactors = (updateAll) || (updateCommand && argv._.includes('costfactors'));
const updateQuestions = (updateAll) || (updateCommand && argv._.includes('questions'));


service.init({ logger: require('./lib/logger'), timeout: 0 });
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
  updateDocumentPackets && require('./lib/update-documentpackets').updatePackets(context),
  updateNoteTypes && require('./lib/update-noteTypes').updateNoteTypes(context),
  updateRatingEngines && require('./lib/update-engines').updateRatingEngines(context),
  updateCostEngineEquations && require('./lib/update-cost-engine').updateCostEngineEquations(context),
  updateCostEngineSelect && require('./lib/update-cost-engine').updateCostEngineSelections(context),
  updateCostFactorAdjustments && require('./lib/update-cost-engine').updateCostFactorAdjustments(context),
  updateCostFactorDeductibles && require('./lib/update-cost-engine').updateCostFactorDeductibles(context),
  updateCostFactors && require('./lib/update-cost-engine').updateCostFactors(context),
  updateQuestions && require('./lib/update-questions').updateQuestions(context)
])
  .then(() => service.gracefulShutdown());
