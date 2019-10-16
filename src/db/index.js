const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const createModel = require('./models')

const adapter = new FileSync('src/db/db.json')
const db = low(adapter)

db.defaults({ posts: [], users: [], settings: [] })

module.exports = {
  models: {
    Settings: createModel(db, 'settings'),
    Post: createModel(db, 'posts'),
    User: createModel(db, 'users')
  },
  db
}
