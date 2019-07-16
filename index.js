'use strict';

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 update rules', '(updates rules)')
  .example('$0 update email', '(updates email templates)')
  .example('$0 update -all', '(updates rules and email templates)')
  .help('h')
  .alias('h', 'help')
  .argv;

const updateCommand = argv._.includes('update');
const updateAll = updateCommand ? (argv.all || false) : false;
const updateRules = (updateAll) || (updateCommand && argv._.includes('rules'));
const updateEmail = (updateAll) || (updateCommand && argv._.includes('email'));

const service = require('exframe-service');
service.init({ logger: require('./lib/logger'), timeout: 0 });

const taskPool = require('./lib/task-pool').create();
taskPool.on('progress', ({ name, percentComplete }) => console.log(`${name}: ${percentComplete}`));

const user = { userId: 'mpardue', userName: 'mpardue' };

const context = {
  user,
  taskPool
};

console.log(argv);

Promise.all([
  updateRules && require('./lib/update-rules').updateRules(context),
  updateEmail && require('./lib/update-email').updateEmail(context)
])
  .then(() => service.gracefulShutdown());
