// basic graphql schema and apollo server exercise. not related to main projecti in src folder

const {
  ApolloServer,
  PubSub,
  AuthenticationError,
  UserInputError,
  ApolloError,
  SchemaDirectiveVisitor
} = require("apollo-server");
const { defaultFieldResolver, GraphQLString } = require("graphql");
const gql = require("graphql-tag");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    field.args.push({
      type: GraphQLString,
      name: "message"
    });

    field.resolve = (root, { message, ...rest }, ctx, info) => {
      const { message: schemaMessage } = this.args;

      console.log("hello", message || schemaMessage);
      return resolver.apply(this, root, rest, ctx, info);
    };
  }
}

// schema
const typeDefs = gql`
  directive @log(message: String = "my message") on FIELD_DEFINITION

  type User {
    id: ID! @log(message: "id here")
    error: String! @deprecated(reason: "use this other field") #adds meta data to let client know if a field is no longer supported or has been replaced
    username: String!
    createdAt: String!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Item {
    task: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings!
    createItem(task: String!): Item!
  }

  type Subscription {
    newItem: Item!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: "3939291",
        username: "me",
        createdAt: 39492010393
      };
    },
    settings(_, { user }) {
      return {
        user,
        them: "Light"
      };
    }
  },
  Mutation: {
    settings(_, { input }) {
      return input;
    },
    createItem(_, { task }) {
      const item = { task };
      pubSub.publish(NEW_ITEM, { newItem: item });
      return item;
    }
  },

  Subscription: {
    newItem: {
      Subscription: () => PubSub.asyncIterator()
    }
  },

  Settings: {
    user(settings) {
      return {
        id: "3939291",
        username: "me",
        createdAt: 39492010393
      };
    }
  },
  User: {
    error() {
      //custom error handling thru apollo
      //throw new UserInputError('missing fields')
      throw new AuthenticationError("not authorized");
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    log: LogDirective
  },
  // formatError(err) {
  //   console.log(err instanceof ApolloError);
  //   //return err;
  //   // or you can override with custom err
  //   //return new Error("custom error message");
  // },
  context({ connection, req }) {
    if (connection) {
      return { ...connection.context };
    }
  },
  subscriptions: {
    onConnnect(params) {}
  }
});

server.listen().then(({ url }) => console.log(`server at ${url}`));
