const CleanUp = require('./cleanup');
const UserSeeds = require('./user');
const db = require('../db/database');

async function devSeeds() {
  try {
    await CleanUp.run();
    await UserSeeds.run();
  } catch (err) {
    console.log(err);
  }
}

async function runTasks() {
  if (process.argv.slice(2).indexOf('--clear') !== -1) {
    await CleanUp.run();
    return;
  }

  await devSeeds();
}

Promise.resolve()
  .then(() => runTasks())
  .then(() => db.close());
