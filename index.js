const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB || 'mongodb://localhost/blackjacks');

const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 8000;

const {
    RETRIEVAL_ID,
    FIND_ONE
} = require('./constants');
const Game = require('./Game');
const {
    getShuffledDeck,
    getNextActiveCards,
    displayGameStateForPlayer,
    calculateUpdatedGameState
} = require('./util');

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
        turnIndex: 0,
        activeCards: getNextActiveCards([initialCard])
    }
    // TODO: Fix this
    const gameInProgress = await Game.findOne(FIND_ONE);
    if (!gameInProgress) {
        const gameCreated = await Game.create(newGame);
        res.json({ message: 'Game created succesfully' });
    } else {
        res.json({ message: 'Game not created as one in progress'});
    }
})

router.get('/state/:player', async (req, res) => {
    const gameState = await Game.findOne(FIND_ONE).lean();
    res.json(displayGameStateForPlayer(gameState, req.params.player));
})

router.post('/play/:player', async (req, res) => {
    const gameState = await Game.findOne(FIND_ONE).lean();
    const isPlayersTurn = gameState.players.findIndex(player => player.name === req.params.player) === gameState.turnIndex;
    // TODO: Could check validity of cards being played
    if (isPlayersTurn) {
        const updatedGameState = calculateUpdatedGameState(gameState, req.params.player, req.body.cards, req.body.nomination);
        await Game.findOneAndUpdate(FIND_ONE, updatedGameState);
        const newGameState = await Game.findOne(FIND_ONE).lean();
        res.json(displayGameStateForPlayer(newGameState, req.params.player));
    } else {
        res.json(displayGameStateForPlayer(gameState, req.params.player));
    }
})

app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
