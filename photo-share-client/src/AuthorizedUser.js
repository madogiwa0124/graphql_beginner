import { gql } from "apollo-boost";
import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import { ROOT_QUERY } from "./App";
import { withRouter } from "react-router-dom";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;
const CurrentUser = ({ user, logout }) => {
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const Me = ({ signingIn, requestCode, logout }) => {
  return (
    <Query query={ROOT_QUERY} fetchPolicy="cache-only">
      {({ loading, data }) => {
        if (data.me) return <CurrentUser user={data.me} logout={logout} />;
        if (loading) return <p>loading...</p>;

        return (
          <button onClick={requestCode} disabled={signingIn}>
            Sign In with GitHub
          </button>
        );
      }}
    </Query>
  );
};

class AuthorizedUser extends Component {
  state = { signingIn: false };

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace("?code=", "");
      console.log("componentDidMount");
      this.githubAuthMutation({ variables: { code } });
    }
  }

  requestCode() {
    const clientID = process.env.REACT_APP_GITHUB_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }

  AuthorizeComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    this.props.history.replace("/");
    this.setState({ signingIn: false });
  };

  logout = () => {
    localStorage.removeItem("token");
  };

  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.AuthorizeComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation;
          return <Me signingIn={this.state.signingIn} requestCode={this.requestCode} logout={this.logout} />;
        }}
      </Mutation>
    );
  }
}

export default withRouter(AuthorizedUser);
