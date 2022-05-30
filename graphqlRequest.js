const { request } = require("graphql-request");

const allUsers = `
  query listUsers {
    allUsers {
      name
    }
  }
`;
const population = `
  mutation population($count: Int) {
    addFakeUsers(count: $count) {
      githubLogin
      name
    }
  }
`;

const requestGraphQL = async () => {
  const allUsersRes = await request("http://localhost:4000/graphql", allUsers);
  console.log(allUsersRes.allUsers.map((user) => user.name));
  const populationRes = await request("http://localhost:4000/graphql", population, { count: 3 });
  console.log(populationRes);
};

requestGraphQL();
