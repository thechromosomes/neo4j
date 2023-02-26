module.exports = {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',

    rounds:  process.env.NODE_ENV === 'production' ? parseInt(process.env.ROUNDS) :10,

    neo4j: {
        url: 'neo4j+s://dfe8d234.databases.neo4j.io',
        username: 'neo4j',
        password: '3QSt9dAEM5jvDR7',
        database: 'neo4j',
    },
  };