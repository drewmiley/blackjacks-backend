const {
    CARD_VALUES,
    SUITS
} = require('./constants');

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
const getNextActiveCards = (lastCardsPlayed, currentActiveCards = { two: 0, blackjacks: 0 }, nomination = null) => {
    if (lastCardsPlayed && lastCardsPlayed.length) {
        const cardInPlay = lastCardsPlayed[lastCardsPlayed.length - 1];
        return {
            ...cardInPlay,
            king: cardInPlay.value === 'King',
            two: cardInPlay.value === 'Two' ? currentActiveCards.two + 1 : 0,
            blackjacks: (cardInPlay.value === 'Jack' && SUITS.find(suit => suit.name === cardInPlay.suit).isBlack)
                ? currentActiveCards.jack + 1 : 0
        }
    } else {
        return {
            value: currentActiveCards.value,
            suit: currentActiveCards.suit,
            king: false,
            two: 0,
            blackjacks: 0
        }
    }
}

const cardsToPickUp = ({ king, two, blackjacks }) => {
    if (king) {
        return 0;
    } else if (two) {
        return 2 * two;
    } else if (blackjacks) {
        return 7 * blackjacks;
    } else {
        return 1;
    }
}

const combinationsToPlay = (initialCards, hand, suitRunsOnly) => {
    // TODO: Implement
    return initialCards;
}

const possibleCardsToPlay = ({ value, suit, king, two, blackjacks }, hand) => {
    let initialCards;
    if (king) {
        initialCards = hand.filter(card => card.value === 'King');
    } else if (two) {
        initialCards = hand.filter(card => card.value === 'Two');
    } else if (blackjacks) {
        initialCards = hand.filter(card => card.value === 'Jack');
    } else {
        initialCards = hand
            .filter(card => card.value === value || card.suit === suit || (card.value === 'Ace' && value));
    }
    return combinationsToPlay(initialCards, hand, king || two || blackjacks);
}

const visibleViewOfPlayers = (players, activeCards, playerName) => {
    return players.map(player => {
        return {
            name: player.name,
            handSize: player.hand.length,
            // TODO: Implement isLastCard using combinationsToPlay
            isLastCard: null,
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
        // TODO: Split out pick up cards into subfunctions
        const numberOfCardsToPickUp = cardsToPickUp(currentGameState.activeCards);
        let cardsPickedUp;
        if (numberOfCardsToPickUp > deck.length) {
            const leftoverCardsToPickUp = numberOfCardsToPickUp - deck.length;
            const initialCardsPickedUp = deck;
            const notInDeck = currentGameState.players.flatMap(player => player.hand).concat(initialCardsPickedUp);
            const initialNewDeck = getShuffledDeck()
                .filter(card => !notInDeck.some(c => c.value === card.value && c.suit === card.suit));
            cardsPickedUp = initialNewDeck.splice(0, leftoverCardsToPickUp).concat(initialCardsPickedUp);
            newDeck = initialNewDeck.splice(leftoverCardsToPickUp);
        } else {
            cardsPickedUp = currentGameState.deck.splice(0, numberOfCardsToPickUp);
            newDeck = currentGameState.deck.splice(numberOfCardsToPickUp);
        }
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
                    ? player.hand.filter(card => !cardsPlayed.some(c => c.value === card.value && c.suit === card.suit))
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
