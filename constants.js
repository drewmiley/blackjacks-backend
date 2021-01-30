const RETRIEVAL_ID = 'retrieval_id';
const FIND_ONE = { retrieval_id: RETRIEVAL_ID };

const CARD_VALUES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const SUITS = [
    { name: 'Clubs', isBlack: true },
    { name: 'Spades', isBlack: true },
    { name: 'Hearts', isBlack: false },
    { name: 'Diamonds', isBlack: false }
];

module.exports = {
    RETRIEVAL_ID,
    FIND_ONE,
    CARD_VALUES,
    SUITS
}