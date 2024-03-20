const mongoose = require('mongoose');
const uuidv4 = require('uuid');

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,required: true },
    username: {type: String,required: true},
    tokenId: {type: String, default: uuidv4, required: true },
    tokenName: {type: String,required: true},
    tokenLevel: {type: String,enum: ['bronze', 'silver', 'gold'],required: true},
    tokenImageReference: {type: String,required: true},
    tokenDescription: {type: String,required: true}
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
