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

const router = express.Router();
router.use((req, res, next) => {
    console.log('Making request');
    next();
});

router.get('/', (req, res) => {
    res.json({ message: 'blackjacks backend is running' });
});

router.post('/init', (req, res) => {
    // Add Game to DB
    console.log(req.body.players);
    res.json({ message: req.body.players });
})

router.get('/state/:player', (req, res) => {
    // Get Game Data from DB as views by Player
    console.log(req.params.player);
    res.json({ message: `returning state for ${req.params.player}` });
})

router.post('/play/:player', (req, res) => {
    // Validate whether valid set of cards, and update game situation in DB
    // Return /state/:player response
    console.log(req.params.player);
    console.log(req.body.cards);
    res.json({ message: `playing ${req.body.cards} cards for ${req.params.player}` });
})

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
// const Card = mongoose.model('Card', CardSchema);

const PlayerSchema = new Schema({
    name: String,
    hand: [CardSchema]
});
// const Player = mongoose.model('Player', PlayerSchema);

// TODO: Create JacksTwoAndEightsActiveSchema
const BlackJacksActiveCardsSchema = new Schema({
    value: String,
    suit: String,
    king: Boolean,
    two: Number,
    blackjacks: Number
});
// const BlackJacksActiveCards = mongoose.model('BlackJacksActiveCards', BlackJacksActiveCardsSchema);

const GameSchema = new Schema({
    deck: [CardSchema],
    lastCardsPlayed: [CardSchema],
    players: [PlayerSchema],
    turn: String,
    activeCards: BlackJacksActiveCardsSchema
});
const Deck = mongoose.model('Deck', DeckSchema);


// const QuizSchema = new Schema({
//     code: String,
//     questions: [{
//         category: String,
//         questionType: String,
//         difficulty: String,
//         question: String,
//         answer: String,
//         incorrectAnswers: [String]
//     }]
// });
// const Quiz = mongoose.model('Quiz', QuizSchema);
//
// router.route('/newquiz')
//     .post(async (req, res) => {
//         Quiz.create(quiz, err => {
//             if (err) {
//                 res.send(err);
//             }
//         });
//     });
// router.route('/quiz/:code')
//     .get((req, res) => {
//         Quiz.findOne({ 'code': req.params.code }, (err, quiz) => {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(util.transformDBQuizToAPIQuiz(quiz));
//         });
//     });

app.use('/api', router);
app.listen(port);
console.log(`Starting server on port ${ port }`);
