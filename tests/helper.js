const {ApolloServer} = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const typeDefs = require('../src/typedefs')
const resolvers = require('../src/resolvers')

const createTestServer = ctx => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    mockEntireSchema: false,
    mocks: true,
    context: () => ctx
  })

  return createTestClient(server)
}

module.exports = createTestServer
