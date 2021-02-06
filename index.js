const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blackjacks');

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
    FIND_ONE,
    NUMBER_OF_CARDS_IN_INITIAL_HAND
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
    const gameTypeIndex = parseInt(req.body.gameTypeIndex);
    const shuffledDeck = getShuffledDeck();
    const players = req.body.players
        .map((name, i) => ({ name, hand: shuffledDeck.slice(NUMBER_OF_CARDS_IN_INITIAL_HAND * i, NUMBER_OF_CARDS_IN_INITIAL_HAND * (i + 1))}));
    const initialCard = shuffledDeck[NUMBER_OF_CARDS_IN_INITIAL_HAND * players.length];
    const deck = shuffledDeck.slice(NUMBER_OF_CARDS_IN_INITIAL_HAND * players.length + 1);
    const newGame = {
        retrieval_id: RETRIEVAL_ID,
        deck,
        lastCardsPlayed: [initialCard],
        players,
        turnIndex: 0,
        activeCards: getNextActiveCards([initialCard], { gameTypeIndex, two: 0, blackjacks: 0 })
    }
    const gameInProgress = await Game.findOne(FIND_ONE);
    if (!gameInProgress || req.body.clear) {
        if (gameInProgress && req.body.clear) {
            await Game.deleteOne(FIND_ONE);
        }
        const created = await Game.create(newGame);
        const players = created.players.map(player => player.name).join(', ');
        res.json({ message: `Game created successfully for players ${players}` });
    } else {
        const players = gameInProgress.players.map(player => player.name).join(', ');
        res.json({ message: `Game not created as one in progress for players ${players}` });
    }
})

router.delete('/clear', async (req, res) => {
    await Game.deleteOne(FIND_ONE);
    res.json({ message: 'Game cleared successfully' });
})

router.get('/state/:player', async (req, res) => {
    // TODO: Improve if game does not exist
    const gameState = await Game.findOne(FIND_ONE).lean();
    res.json(displayGameStateForPlayer(gameState, req.params.player));
})

router.post('/play/:player', async (req, res) => {
    const gameState = await Game.findOne(FIND_ONE).lean();
    const isPlayersTurn = gameState.players.findIndex(player => player.name === req.params.player) === gameState.turnIndex;
    if (isPlayersTurn) {
        const updatedGameState = calculateUpdatedGameState(gameState, req.params.player, req.body.cards, req.body.nomination);
        await Game.findOneAndUpdate(FIND_ONE, updatedGameState);
        const newGameState = await Game.findOne(FIND_ONE).lean();
        // TODO: Add cleanup on game end
        res.json(displayGameStateForPlayer(newGameState, req.params.player));
    } else {
        res.json(displayGameStateForPlayer(gameState, req.params.player));
    }
})

app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
