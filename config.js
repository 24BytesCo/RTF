require("dotenv").config();
module.exports = {
  api: {
    port: process.env.API_PORT || 3000,
  },
  jwt: {
    secreto: process.env.SECRETO_JWT,
  },
};
