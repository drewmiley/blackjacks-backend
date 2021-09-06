const RETRIEVAL_ID = 'retrieval_id';
const FIND_ONE = { retrieval_id: RETRIEVAL_ID };

const AI_PLAYER = 'AI_PLAYER';
const CARD_VALUES = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const SUITS = [
    { name: 'Clubs', isBlack: true },
    { name: 'Spades', isBlack: true },
    { name: 'Hearts', isBlack: false },
    { name: 'Diamonds', isBlack: false }
]
const NUMBER_OF_CARDS_IN_INITIAL_HAND = 7;
const BLACKJACKS = 'blackjacks';
const JACK_TWO_EIGHT = 'jackstwosandeights';
const GAME_TYPE = [BLACKJACKS, JACK_TWO_EIGHT];

module.exports = {
    RETRIEVAL_ID,
    FIND_ONE,
    AI_PLAYER,
    CARD_VALUES,
    SUITS,
    NUMBER_OF_CARDS_IN_INITIAL_HAND,
    BLACKJACKS,
    JACK_TWO_EIGHT,
    GAME_TYPE
}
