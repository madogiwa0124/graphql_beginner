const { MongoClient } = require("mongodb");
const initDatabase = async (config) => {
  const client = await MongoClient.connect(config, { useNewUrlParser: true });
  return client.db();
};

const exec = async () => {
  const db = await initDatabase(process.env.DB_HOST);
  let latestUserInfo = {
    name: "sample user",
    githubLogin: "foo_bar",
    githubToken: "bar_baz",
    avatar: "http://example.com/avatar.png",
  };
  const users = await db.collection("users").find().toArray();
  console.log(users);
};

// exec();
