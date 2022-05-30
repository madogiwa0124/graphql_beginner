import { gql } from "apollo-boost";
import { BrowserRouter } from "react-router-dom";
import Users from "./Users";
import AuthorizedUser from "./AuthorizedUser";

export const ROOT_QUERY = gql`
  {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }
  fragment userInfo on User {
    githubLogin
    name
  }
`;

const App = () => (
  <BrowserRouter>
    <AuthorizedUser />
    <Users />
  </BrowserRouter>
);

export default App;
