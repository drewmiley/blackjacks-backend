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
    // TODO: Implement
    return [];
}

const visibleViewOfPlayers = (players, activeCards, playerName) => {
    return players.map(player => {
        return {
            name: player.name,
            handSize: player.hand.length,
            // TODO: Implement isLastCard
            ...(player.name === playerName && {hand: player.hand}),
            ...(player.name === playerName && {possibleCardsToPlay: possibleCardsToPlay(activeCards, player.hand)})
        }
    })
}

const displayGameStateForPlayer = (gameState, playerName) => {
    return {
        lastCardsPlayed: gameState.lastCardsPlayed,
        turnIndex: gameState.turnIndex,
        activeCards: gameState.activeCards,
        players: visibleViewOfPlayers(gameState.players, gameState.activeCards, playerName)
    };
}

const calculateUpdatedGameState = (currentGameState, playerName, cardsPlayed, nomination = null) => {
    // HACK - Assume cardsPlayed are valid thanks to util giving possible options
    let newDeck = null;
    let newPlayers = null;
    if (!cardsPlayed) {
        // TODO: Implement for special cards
        const numberOfCardsToPickUp = 1;
        // TODO: Implement when deck.length < cardsToPickUp
        const cardsPickedUp = currentGameState.deck.splice(0, numberOfCardsToPickUp);
        newDeck = currentGameState.deck.splice(numberOfCardsToPickUp);
        newPlayers = currentGameState.player.map(player => {
            return {
                name: player.name,
                hand: player.name === playerName
                    ? player.hand.concat(cardsPickedUp)
                    : player.hand
            }
        });
    } else {
        newDeck = currentGameState.deck;
        newPlayers = currentGameState.players.map(player => {
            return {
                name: player.name,
                hand: player.name === playerName
                    ? player.hand.filter(card => !cardsPlayed.some(d => d._id === card._id))
                    : player.hand
            }
        });
    }
    return {
        deck: newDeck,
        lastCardsPlayed: cardsPlayed,
        players: newPlayers,
        turnIndex: (currentGameState.turnIndex + 1) % currentGameState.players.length,
        activeCards: getNextActiveCards(cardsPlayed, currentGameState.activeCards, nomination)
    };
}

module.exports = {
    getShuffledDeck,
    getNextActiveCards,
    displayGameStateForPlayer,
    calculateUpdatedGameState
}
