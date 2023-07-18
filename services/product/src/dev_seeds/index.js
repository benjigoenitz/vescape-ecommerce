const CleanUp = require('./cleanup');
const ProductSeeds = require('./product');
const db = require('../db/database');

async function devSeeds() {
  try {
    await CleanUp.run();
    await ProductSeeds.run();
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
