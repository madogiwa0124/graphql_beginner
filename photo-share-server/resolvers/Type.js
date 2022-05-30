const { GraphQLScalarType } = require("graphql");
const { ObjectId } = require("mongodb");

module.exports = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
  User: {
    postedPhotos: (parent, args, { db }) => {
      return db.collection("photos").find({ postedBy: parent.githubLogin }).toArray();
    },
    inPhotos: async (parent, args, { db }) => {
      const tags = await db.collection("tags").find({ userID: parent.githubLogin }).toArray();
      //NOTE: 検索のためにmongoDBのidの文字列をIDオブジェクトに変換
      // https://www.mongodb.com/docs/manual/reference/method/ObjectId/
      const photoIds = tags.map((tag) => ObjectId(tag.photoID));
      return db
        .collection("photos")
        .find({ _id: { $in: photoIds } })
        .toArray();
    },
  },
  Photo: {
    // NOTE: parentが作成中のPhotoオブジェクトになる
    id: (parent) => parent.id || parent._id,
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
    postedBy: (parent, args, { db }) => {
      return db.collection("users").findOne({ githubLogin: parent.postedBy });
    },
    taggedUsers: async (parent, args, { db }) => {
      //NOTE: 検索のためにmongoDBのidオブジェクトを文字列に変換
      // https://www.mongodb.com/docs/manual/reference/method/ObjectId.toString/
      const photoID = parent._id.toString();
      const tags = await db.collection("tags").find({ photoID: photoID }).toArray();
      const userIds = tags.map((tag) => tag.userID);
      return db
        .collection("users")
        .find({ githubLogin: { $in: userIds } })
        .toArray();
    },
  },
};
