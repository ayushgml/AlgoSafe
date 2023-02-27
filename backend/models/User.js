const mongo = require( 'mongoose' );
const userSchema = new mongo.Schema( {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    savedPasswordsTxns: { type: Array, default: [] },
    algorandAccount: { type: Object, default: {} },
} )

const User = mongo.model( 'users', userSchema );
module.exports = User;