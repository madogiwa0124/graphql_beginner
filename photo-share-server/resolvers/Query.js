module.exports = {
  totalPhotos: async (parent, args, { db }) => {
    return db.collection("photos").estimatedDocumentCount();
  },
  allPhotos: (_parent, args, { db }) => {
    return db.collection("photos").find().toArray();
  },
  totalUsers: (parent, args, { db }) => {
    return db.collection("users").estimatedDocumentCount();
  },
  allUsers: (_parent, args, { db }) => {
    return db.collection("users").find().toArray();
  },
  allTags: (_parent, args, { db }) => {
    return db.collection("tags").find().toArray();
  },
  me: (_parent, args, { currentUser }) => currentUser,
};
