const router = require("express").Router();

router.get("/hello-world", (req, res) => {
  res.status(200).send({
    message: "Welcome to UST NEO4J",
  });
});

router.post("/create-employee", async (req, res) => {
  const { name, age, doj, reportsTo } = req.body;
  try {
    if (name && age && doj) {
      let query;
      if (reportsTo != null && reportsTo != "") {
        query = `MATCH (manager:Manager {name: '${reportsTo}'})
        CREATE (employee:Employee {name: '${name}', age: ${age}, doj: ${doj} })
        CREATE (employee)-[:REPORTS_TO]->(manager)
        RETURN employee, manager
        `;
      } else {
        query = `CREATE (e:Employee {name: '${name}', age: ${age}, doj: ${doj} }) RETURN e`;
      }
      const response = await req.neo4j.write(query);
      if (response) {
        res.status(200).send({
          message: "Record created successfully",
          data: response.records,
        });
      } else {
        res.status(400).send({
          message: "Incorrect Information",
          data: [],
        });
      }
    } else {
      res.status(400).send({
        message: "Incorrect Information",
        data: [],
      });
    }
  } catch (error) {
    console.log("error >>", error);
  }
});

router.post("/create-manager", async (req, res) => {
  const { name, age, doj, reportsTo } = req.body;
  try {
    if (name && age && doj) {
      let query;
      if (reportsTo != null && reportsTo != "") {
        query = `MATCH (manager:Manager {name: '${reportsTo}'})
        CREATE (mangerNew:Manager {name: '${name}', age: ${age}, doj: ${doj} })
        CREATE (mangerNew)-[:REPORTS_TO]->(manager)
        RETURN mangerNew, manager
        `;
      } else {
        query = `CREATE (e:Manager {name: '${name}', age: ${age}, doj: ${doj} }) RETURN e`;
      }

      const response = await req.neo4j.write(query);
      if (response) {
        res.status(200).send({
          message: "Record created successfully",
          data: response.records,
        });
      } else {
        res.status(400).send({
          message: "Incorrect Information",
          data: [],
        });
      }
    } else {
      res.status(400).send({
        message: "Incorrect Information",
        data: [],
      });
    }
  } catch (error) {
    console.log("error >>", error);
  }
});

router.get("/get-all", async (req, res) => {
  const query = `MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m, labels(n), labels(m)`;
  try {
    const response = await req.neo4j.write(query);
    if (response) {
      const nodes = response.records.map((record) => {
        return {
          data: {
            id: record.get("n").identity.low.toString(),
            name: record.get("n").properties.name,
            labels: record.get("n").labels,
          },
        };
      });
      const rels = response.records
        .map((record) => {
          if (record.get("r") && record.get("r").end && record.get("r").start) {
            return {
              data: {
                id:
                  record.get("r").start.low.toString() +
                  record.get("r").end.low.toString(),
                source: record.get("r").start.low.toString(),
                target: record.get("r").end.low.toString(),
                labels: record.get("r").labels,
              },
            };
          } else {
            return false;
          }
        })
        .filter((e) => e != false);

      const data = [...nodes, ...rels];
      res.status(200).send({
        message: "Records fetched successfully",
        data: data,
      });
    } else {
      res.status(400).send({
        message: "Error while fetching data",
        data: [],
      });
    }
  } catch (error) {
    console.log("error >>", error);
  }
});

router.post("/get-all-by-name", async (req, res) => {
  try {
    if (req.body.name) {
      const query = `MATCH (n {name: '${req.body.name}'})-[r]-(m)
      RETURN n, r, m`;
      const response = await req.neo4j.write(query);

      if (response) {
        let nodesTemp = response.records.map((record) => {
          return {
            data: {
              id: record.get("n").identity.low.toString(),
              name: record.get("n").properties.name,
              labels: record.get("n").labels,
            },
          };
        });
        nodesTemp = Object.values(
          nodesTemp.reduce((acc, obj) => {
            acc[obj.id] = obj;
            return acc;
          }, {})
        );
        const mangerNode = response.records.map((record) => {
          return {
            data: {
              id: record.get("m").identity.low.toString(),
              name: record.get("m").properties.name,
              labels: record.get("m").labels,
            },
          };
        });
        const nodes = [...nodesTemp, ...mangerNode];
        const rels = response.records
          .map((record) => {
            if (
              record.get("r") &&
              record.get("r").end &&
              record.get("r").start
            ) {
              return {
                data: {
                  id:
                    record.get("r").start.low.toString() +
                    record.get("r").end.low.toString(),
                  source: record.get("r").start.low.toString(),
                  target: record.get("r").end.low.toString(),
                },
              };
            } else {
              return false;
            }
          })
          .filter((e) => e != false);

        const data = [...nodes, ...rels];
        res.status(200).send({
          message: "Records fetched successfully",
          data: data,
        });
      }
    } else {
      res.status(400).send({
        message: "Error while fetching data",
        data: [],
      });
    }
  } catch (error) {
    console.log("error >>", error);
  }
});

router.get("/get-all-manager", async (req, res) => {
  const query = `MATCH (manager:Manager)
  RETURN manager
  `;
  try {
    const response = await req.neo4j.write(query);
    if (response) {
      const users = response.records.map((record) => {
        return {
          name: record.get("manager").properties.name,
          id: record.get("manager").identity.toInt(),
        };
      });
      res.status(200).send({
        message: "Records fetched successfully",
        data: users,
      });
    } else {
      res.status(400).send({
        message: "Error while fetching data",
        data: [],
      });
    }
  } catch (error) {
    console.log("error >>", error);
  }
});

module.exports = router;
