const {
  SchemaDirectiveVisitor,
  AuthenticationError
} = require("apollo-server");
const { defaultFieldResolver, GraphQLString } = require("graphql");
const { formatDate } = require("./utils");

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format: defaultFormat } = this.args;

    field.args.push({
      name: "format",
      type: GraphQLString
    });

    field.resolve = async (root, { format, ...rest }, ctx, info) => {
      const result = await resolver.call(this, root, rest, ctx, info);
      return formatDate(result, format || defaultFormat);
    };
    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError("not authorized");
      }
      return resolver(root, args, ctx, info);
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { role } = this.args;

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user.role !== role) {
        throw new AuthenticationError("wrong role");
      }
      return resolver(root, args, ctx, info);
    };
  }
}

module.exports = {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective
};
