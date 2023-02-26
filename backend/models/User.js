const mongo = require( 'mongoose' );
const userSchema = new mongo.Schema( {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    savedPasswordsTxns: { type: Array, default: [] },
    algorandAddress: { type: String, default: "" },
    algorandSecretKey: { type: String, default: "" },
} )

module.exports = mongo.model( 'user', userSchema );