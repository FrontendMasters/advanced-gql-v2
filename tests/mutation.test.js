const gql = require("graphql-tag");
const createTestServer = require("./helper");

const CREATE_POST = gql`
  mutation {
    createPost(input: { message: "hello" }) {
      message
    }
  }
`;

describe("mutation", () => {
  test("createPost", async () => {
    const { mutate } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          createOne() {
            return {
              message: "hello"
            };
          }
        },
        user: { id: 1 }
      }
    });

    const res = await mutate({ query: CREATE_POST });
    expect(res).toMatchSnapshot();
  });
});
