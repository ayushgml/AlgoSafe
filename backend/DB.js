const mongoose = require( 'mongoose' );
const mongoUri = 'MONGO_URI';

const connectToMongo = () => {
    mongoose.connect( mongoUri, () => {
        console.log( "Connected to MongoDB" );
    } );
}

module.exports = connectToMongo;
