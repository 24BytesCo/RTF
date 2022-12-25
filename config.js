require("dotenv").config();
module.exports = {
  api: {
    port: process.env.API_PORT || 3000,
  },
  jwt: {
    secreto: process.env.SECRETO_JWT,
  },
  mysql: {
    host: process.env.MYSQL_HOST || "",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASS || "",
    dataBase: process.env.MYSQL_DATA_BASE || "",
  },
};
