const {
    CARD_VALUES,
    SUITS
} = require('./constants');

// TODO : Special cards

const newDeck = () => {
    return CARD_VALUES
        .flatMap(value => SUITS.map(suit => ({ value, suit: suit.name })));
}

const getShuffledDeck = () => {
    return newDeck()
        .map(card => ({...card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(card => ({ value: card.value, suit: card.suit }));
}

// TODO: Make work for JacksTwosAndEights
// TODO: Move to generalise this into mix and match rules
const getNextActiveCards = (lastCardsPlayed, currentActiveCards = null, nomination = null) => {
    // TODO: Implement special cards
    const cardInPlay = lastCardsPlayed[lastCardsPlayed.length - 1];
    return {
        ...cardInPlay,
        king: null,
        two: null,
        blackjacks: null
    }
}

const possibleCardsToPlay = (activeCards, hand) => {
    return [];
}

const displayGameStateForPlayer = (gameState, playerName) => {
    // TODO: Implement
    // If turn, display possible cards to play
    return null;
}

const calculateUpdatedGameState = (currentGameState, playerName, cardsPlayed, nomination = null) => {
    // TODO: Implement
    // HACK - Assume cardsPlayed are valid thanks to util giving possible options
    return null;
}

module.exports = {
    getShuffledDeck,
    getNextActiveCards,
    displayGameStateForPlayer,
    calculateUpdatedGameState
}