const connectToMongo = require( './DB' );
const express = require( 'express' );
var cors = require('cors')

connectToMongo();
const app = express();
const port = 6060;

app.use(cors())
app.use( express.json() );

app.use( '/', require( './routes/userRoutes' ) );
app.listen( port, () => console.log( `Server running on port ${port}` ) );