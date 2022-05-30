const fetch = require("node-fetch");

const authorizeWithGitHub = async (credencials) => {
  const { access_token } = await requestGitHubToken(credencials);
  const githubUser = await requestGitHubUserAccount(access_token);
  return { ...githubUser, access_token };
};
module.exports.authorizeWithGitHub = authorizeWithGitHub;

const GITHUN_TOKEN_ENDPOINT = "https://github.com/login/oauth/access_token";
const requestGitHubToken = (credencials) => {
  return fetch(GITHUN_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credencials),
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(JSON.stringify(error));
    });
};

const GITHUN_ACCOUNT_ENDPOINT = "https://api.github.com/user";
const requestGitHubUserAccount = (token) => {
  return fetch(GITHUN_ACCOUNT_ENDPOINT, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(JSON.stringify(error));
    });
};

const requestRamdomUserApi = (count) => {
  const randomUserApiEndpoint = `https://randomuser.me/api/?results=${count}`;
  return fetch(randomUserApiEndpoint).then((res) => res.json());
};
module.exports.requestRamdomUserApi = requestRamdomUserApi;
