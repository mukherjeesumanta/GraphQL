const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema')

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

const port = 4000;
app.listen(port, () => {
    console.log('Listening on port: ', port);
})