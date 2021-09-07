const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    value: String,
    suit: String
});

const PlayerSchema = new Schema({
    name: String,
    hand: [CardSchema],
    isAI: Boolean
});

// TODO: Move to generalise this into mix and match rules
const ActiveCardsSchema = new Schema({
    value: String,
    suit: String,
    king: Boolean,
    eight: Boolean,
    two: Number,
    blackjacks: Number,
    gameTypeIndex: Number
});

const GameSchema = new Schema({
    // retrieval_id used only for simple retrieval and deletion
    retrieval_id: String,
    deck: [CardSchema],
    lastCardsPlayed: [CardSchema],
    players: [PlayerSchema],
    turnIndex: Number,
    activeCards: ActiveCardsSchema
});
const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
