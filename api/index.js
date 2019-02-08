const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mariadb = require('mariadb');

const halfDay = 43200
const measurementsQuery = `SELECT * FROM observations WHERE (identifier = 'k' OR identifier IS NULL)
                           AND timestamp >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 1 DAY))`

// MariaDB pool
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'writer',
    password: 'writer',
    database: 'observations',
    connectionLimit: 5
});

// Define schema for graphql
const schema = buildSchema(`
        type Data {
            temperature: Int,
            pressure: Int,
            relativehumidity: Int,
            timestamp: Int
            date: String,
            time: String
        }
        type Query {
            measurements: [Data],
        }
`
);

function querySQL(query) {
    return new Promise(function (resolve, reject) {
        pool
           .query(query)
           .then(res => {
               const stringify = JSON.stringify(res)
               const json = JSON.parse(stringify)
               resolve(json);
           })
           .catch(err => {
           //handle error
           })
    });
}
async function queryMeasurements(){
    const values = await querySQL(measurementsQuery);
    return values;
}
// Define functions for graphql
const root = {
    measurements: queryMeasurements
}

// Inside temperature
insideTemp = "";

// conn = pool.getConnection();
pool.query("SELECT temperature FROM observations WHERE identifier = 'w' ORDER BY date DESC, time DESC LIMIT 1")
    .then(res => {
        insideTemp = res[0].temperature;
    });

const app = express()

app.set('view engine', 'ejs');
// app.use(express.static('../frontend'))
/* app.get('/hello', function (req, res) {
  res.send('Hello World!')
}) */
app.use("/css",express.static(__dirname + "/views/css"));

app.get('/', function(req, res){ 
    res.render('index', {body: insideTemp, title:"homepage"});
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: root,
}));

app.listen(4000);

console.log('Running')
