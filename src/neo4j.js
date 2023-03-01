const neo4j = require("neo4j-driver");
const config = require("./config");

const driver = neo4j.driver(
  config.neo4j.url,
  neo4j.auth.basic(config.neo4j.username, config.neo4j.password)
);

const session = driver.session({ database: config.database });

module.exports = {
  write: (query) => {
    return session
      .run(query)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log("error >>>", e)
        throw e;
      });
  },
};
