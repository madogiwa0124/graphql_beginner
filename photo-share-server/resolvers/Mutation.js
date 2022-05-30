const { authorizeWithGitHub, requestRamdomUserApi } = require("../lib");

module.exports = {
  postPhoto: async (parent, args, { db, currentUser }) => {
    if (!currentUser) throw new Error(`only an authorized user can post a photo.`);
    const newPhoto = { ...args.input, postedBy: currentUser.githubLogin, created: new Date() };
    const insertedIds = await db.collection("photos").insertOne(newPhoto);
    return { ...newPhoto, id: insertedIds[0] };
  },
  postTag: async (parent, args, { db, currentUser }) => {
    if (!currentUser) throw new Error(`only an authorized user can post a photo.`);
    const newTag = { ...args.input };
    await db.collection("tags").insertOne(newTag);
    return newTag;
  },
  githubAuth: async (parent, { code }, { db }) => {
    let { message, access_token, avatar_url, login, name } = await authorizeWithGitHub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    if (message) throw new Error(message);

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    await db.collection("users").replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
    const user = await db.collection("users").findOne({ githubLogin: login });
    return { user, token: access_token };
  },
  addFakeUsers: async (root, { count }, { db }) => {
    const { results } = await requestRamdomUserApi(count);
    const users = results.map((result) => ({
      githubLogin: result.login.username,
      name: `${result.name.first} ${result.name.last}`,
      avatar: result.picture.thumbnail,
      githubToken: result.login.sha1,
    }));
    await db.collection("users").insertMany(users);
    return users;
  },
  fakeUserAuth: async (parent, { githubLogin }, { db }) => {
    const user = await db.collection("users").findOne({ githubLogin });
    if (!user) throw new Error(`Cannot find user with githubLogin: ${githubLogin}`);
    return { user, token: user.githubToken };
  },
};
