const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB || 'mongodb://localhost/test');
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
