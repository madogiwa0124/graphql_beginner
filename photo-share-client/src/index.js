import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
import { ApolloProvider } from "react-apollo";

const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage,
});

if (localStorage["apollo-cache-persist"]) {
  let cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
}

const client = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql",
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem("token"),
      },
    }));
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
