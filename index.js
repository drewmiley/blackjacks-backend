const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB || 'mongodb://localhost/blackjacks');
const Schema = mongoose.Schema;

const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 8000;

const RETRIEVAL_ID = 'retrieval_id';
const FIND_ONE = { retrieval_id: RETRIEVAL_ID };

const CARD_VALUES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const SUITS = [
    { name: 'Clubs', isBlack: true },
    { name: 'Spades', isBlack: true },
    { name: 'Hearts', isBlack: false },
    { name: 'Diamonds', isBlack: false }
]

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
    turn: String,
    activeCards: BlackJacksActiveCardsSchema
});
const Game = mongoose.model('Game', GameSchema);

const getShuffledDeck = () => {
    const newDeck = CARD_VALUES
        .flatMap(value => SUITS.map(suit => ({ value, suit: suit.name })));
    return newDeck
        .map(card => ({...card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(card => ({ value: card.value, suit: card.suit }));
}

// TODO: Make work for JacksTwosAndEights
// TODO: Move to generalise this into mix and match rules
const getNextActiveCards = (lastCardsPlayed, currentActiveCards = null) => {
    // TODO: Implement
    return {
        value: null,
        suit: null,
        king: null,
        two: null,
        blackjacks: null
    }
}

const displayGameStateForPlayer = (gameState, playerName) => {
    // TODO: Implement
    return null;
}

const calculateUpdatedGameState = (currentGameState, playerName, cardsPlayed, nomination = null) => {
    // TODO: Implement
    return null;
}

const router = express.Router();
router.use((req, res, next) => {
    console.log('Making request');
    next();
});

router.post('/init', async (req, res) => {
    const shuffledDeck = getShuffledDeck();
    const players = req.body.players.map((name, i) => ({ name, hand: shuffledDeck.slice(7 * i, 7 * (i + 1))}));
    const initialCard = shuffledDeck[7 * players.length];
    const deck = shuffledDeck.slice(7 * players.length + 1);
    const newGame = {
        retrieval_id: RETRIEVAL_ID,
        deck,
        lastCardsPlayed: [initialCard],
        players,
        turn: players[0],
        activeCards: getNextActiveCards([initialCard])
    }
    const gameCreated = await Game.create(newGame);
    res.json({ message: 'Game created succesfully' });
})

router.get('/state/:player', async (req, res) => {
    const gameState = await Game.findOne(FIND_ONE);
    res.json(displayGameStateForPlayer(gameState, req.params.player));
})

router.post('/play/:player', async (req, res) => {
    const currentGameState = await Game.findOne(FIND_ONE);
    const updatedGameState = calculateUpdatedGameState(currentGameState, req.params.player, req.body.cards, req.body.nomination);
    await Game.findOneAndUpdate(FIND_ONE, updatedGameState);
    const newGameState = await Game.findOne(FIND_ONE);
    res.json(displayGameStateForPlayer(newGameState, req.params.player));
})

app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
