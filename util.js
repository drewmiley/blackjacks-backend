const {
    CARD_VALUES,
    SUITS
} = require('./constants');

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

module.exports = {
    getShuffledDeck,
    getNextActiveCards,
    displayGameStateForPlayer,
    calculateUpdatedGameState
}