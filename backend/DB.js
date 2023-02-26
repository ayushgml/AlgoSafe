const mongoose = require( 'mongoose' );
const mongoUri = 'mongodb+srv://ayush1606:Noobmaster69@cluster0.dszgc.mongodb.net/algosafe';

const connectToMongo = () => {
    mongoose.connect( mongoUri, () => {
        console.log( "Connected to MongoDB" );
    } );
}

module.exports = connectToMongo;