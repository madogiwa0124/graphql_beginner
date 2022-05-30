import { gql } from "apollo-boost";
import React from "react";
import { Query, Mutation } from "react-apollo";
import { ROOT_QUERY } from "./App";

const ADD_FAKE_USER_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      name
      githubLogin
      avatar
      githubToken
    }
  }
`;

const AddFakeUser = () => {
  return (
    <Mutation mutation={ADD_FAKE_USER_MUTATION} variables={{ count: 1 }} refetchQueries={[{ query: ROOT_QUERY }]}>
      {(addFakeUsers) => <button onClick={addFakeUsers}>Add Fake User</button>}
    </Mutation>
  );
};
const Loading = () => <p>loading...</p>;
const UserListItem = ({ name }) => <li>{name}</li>;
const UserList = ({ count, users, refechUsers }) => (
  <div>
    <p>count: {count}</p>
    <button onClick={() => refechUsers()}>refechUsers</button>
    <AddFakeUser />
    <ul>
      {users.map((user) => (
        <UserListItem key={user.githubLogin} name={user.name} />
      ))}
    </ul>
  </div>
);

const Users = () => (
  <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
    {({ data, loading, refetch }) => {
      if (loading) return <Loading />;
      return <UserList count={data.totalUsers} users={data.allUsers} refechUsers={refetch}></UserList>;
    }}
  </Query>
);
export default Users;
