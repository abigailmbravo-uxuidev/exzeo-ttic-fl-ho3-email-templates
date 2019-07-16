'use strict';

const EventEmitter = require('events');

function TaskPool({ maxConcurrent = 5 } = {}) {
  const waiting = [];
  let locked = 0;
  const wait = () => {
    if (locked >= maxConcurrent) {
      return new Promise(resolve => {
        waiting.push(resolve);
      });
    }

    locked++;
  }

  const release = () => {
    if (waiting.length > 0) {
      const resume = waiting.shift();
      return resume();
    }
    --locked;
  }

  const taskPool = {
    async forEach(context, name, array, callback) {
      let done;
      let percentComplete = 0;
      const complete = new Promise(resolve => {
        let count = 0;
        done = () => {
          if (++count >= array.length) {
            resolve();
          }
          if (percentComplete < 100) {
            percentComplete = Math.min(100, Math.trunc((count / array.length) * 100));
            this.emit('progress', { name, percentComplete, total: array.length });
          }
        }
      });

      for (let i = 0; i < array.length; ++i) {
        await wait();

        callback(array[i], i)
          .catch(ex => console.error(ex))
          .then(release)
          .then(done)
      }

      return complete;
    }
  }

  EventEmitter.call(taskPool);
  Object.assign(taskPool, EventEmitter.prototype);

  return taskPool;
}

module.exports = { create: TaskPool };
