const nano = require('nanoid')

const createModel = (db, table) => ({
  findOne(filter = {}) {
    if (!filter) {
      db.get(table)
        .head()
        .value()
    }

    return db.get(table)
      .find(filter)
      .value()
  },
  findMany(filter) {
    if (!filter) {
      return db.get(table)
        .orderBy(['createdAt'], ['desc'])
        .value()
    }

    return db.get(table)
      .filter(filter)
      .orderBy(['createdAt'], ['desc'])
      .value()
  },
  updateOne(filter, update) {
    const match = db.get(table)
      .find(filter)
      .value()

    db.get(table)
      .find(filter)
      .assign(update)
      .write()

    return db.get(table).find({id: match.id}).value()
  },
  remove(filter){
    return db.get(table)
      .remove(filter)
      .write()
  },
  createOne(fields){
    const item = {...fields, createdAt: Date.now(), id: nano()}
    db.get(table)
      .push(item)
      .write()

    return db.get(table).find({id: item.id}).value()
  },
  createMany(toCreate) {
    const manyToCreate = (Array.isArray(toCreate) ?
      toCreate :
      [toCreate]).map(item => ({
        ...item, createdAt: Date.now(), id: nano()
      }))

    return db.get(table)
      .push(...manyToCreate)
      .write()
  }
})

module.exports = createModel
