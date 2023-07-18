const CleanUpSeeds = require('./cleanup');
const db = require('../db/database');

async function devSeeds() {
  try {
    await CleanUpSeeds.run();
  } catch (err) {
    console.log(err);
  }
}

async function runTasks() {
  if (process.argv.slice(2).indexOf('--clear') !== -1) {
    await CleanUpSeeds.run();
    return;
  }

  await devSeeds();
}

Promise.resolve()
  .then(() => runTasks())
  .then(() => db.close());
