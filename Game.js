const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    value: String,
    suit: String
});

const PlayerSchema = new Schema({
    name: String,
    hand: [CardSchema]
});

// TODO: Create JacksTwoAndEightsActiveSchema
// TODO: Move to generalise this into mix and match rules
const BlackJacksActiveCardsSchema = new Schema({
    value: String,
    suit: String,
    king: Boolean,
    two: Number,
    blackjacks: Number
});

const GameSchema = new Schema({
    // retrieval_id used only for simple retrieval and deletion
    retrieval_id: String,
    deck: [CardSchema],
    lastCardsPlayed: [CardSchema],
    players: [PlayerSchema],
    turnIndex: Number,
    activeCards: BlackJacksActiveCardsSchema,
    gameTypeIndex: Number
});
const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
