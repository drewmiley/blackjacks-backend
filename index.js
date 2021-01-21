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

const router = express.Router();
router.use((req, res, next) => {
    console.log('Making request');
    next();
});

router.post('/init', async (req, res) => {
    // Add Game to DB
    console.log(req.body.players);
    const newDeck = CARD_VALUES
        .flatMap(value => SUITS.map(suit => ({ value, suit: suit.name })));
    const shuffledDeck = newDeck
        .map(card => ({...card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(card => ({ value: card.value, suit: card.suit }));
    const newGame = {
        retrieval_id: RETRIEVAL_ID,
        // TODO: Fill in null values
        deck: shuffledDeck,
        lastCardsPlayed: null,
        players: null,
        turn: null,
        activeCards: {
            value: null,
            suit: null,
            king: null,
            two: null,
            blackjacks: null
        }
    }
    const gameCreated = await Game.create(newGame);
    res.json({ message: 'game created' });
})

router.get('/state/:player', async (req, res) => {
    // Get Game Data from DB as views by Player
    console.log(req.params.player);
    const gameState = await Game.findOne(FIND_ONE);
    // TODO: Modify to show only what player can see
    res.json(gameState);
    // res.json({ message: `returning state for ${req.params.player}` });
})

router.post('/play/:player', async (req, res) => {
    // Validate whether valid set of cards, and update game situation in DB
    // Return /state/:player response
    console.log(req.params.player);
    console.log(req.body.cards);
    // FOR NOMINATION CARDS
    console.log(req.body.nomination);
    // TODO: Modify current game state with played cards
    const currentGameState = await Game.findOne(FIND_ONE);
    // Need to use https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    await Game.findOneAndUpdate(FIND_ONE, currentGameState);
    const newGameState = await Game.findOne(FIND_ONE);
    // TODO: Modify to show only what player can see
    res.json(newGameState);
    // res.json({ message: `playing ${req.body.cards} cards for ${req.params.player}` });
})

app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
