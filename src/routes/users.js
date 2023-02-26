const router = require("express").Router();

router.get("/hello-world", (req, res) => {
  res.status(200).send({
    message: "Welcome to UST NEO4J",
  });
});

router.post("/create-employee", async (req, res) => {
  const { name, age, doj } = req.body;
  try {
    if (name && age && doj) {
      const query = `CREATE (e:Employee {name: ${name}, age: ${age}, doj: ${doj} }) RETURN e`;
      const response = await req.neo4j.write(query);
      if (response) {
        res.status(200).send({
          message: "Record created successfully",
          data: response.records[0].get("e"),
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
    console.log('error >>', error)
  }
});

module.exports = router;
