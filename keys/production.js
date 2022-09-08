module.exports = {
    // MONGO_URI: "mongodb://localhost:27017/digitalShop",
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ROLES_LIST: {
      user:"user",
      admin:"admin",
      editor:"editor"
    },
  };
  