const sqliteConnection = require ("../../sqlite/index.js")
const createUsers = require("./createUsers")

async function migrationRun() {
 const schemas = [
  createUsers
 ].join('')

 sqliteConnection()
 .then(db => db.exec(schemas))
 .catch(error => console.log(error))
}

module.exports = migrationRun