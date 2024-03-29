const {
    CARD_VALUES,
    SUITS,
    GAME_TYPE,
    BLACKJACKS,
    JACK_TWO_EIGHT
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

const gameTypeIndexIsBlackjack = gameTypeIndex => GAME_TYPE[parseInt(gameTypeIndex)] === BLACKJACKS;
const gameTypeIndexIsJackTwosAndEights = gameTypeIndex => GAME_TYPE[parseInt(gameTypeIndex)] === JACK_TWO_EIGHT;

// TODO: Move to generalise this into mix and match rules
const getNextActiveCards = (lastCardsPlayed, { value, suit, two, blackjacks, gameTypeIndex }, nomination = null) => {
    const isBlackjacks = gameTypeIndexIsBlackjack(gameTypeIndex);
    const isJackTwosAndEights = gameTypeIndexIsJackTwosAndEights(gameTypeIndex);
    if (lastCardsPlayed && lastCardsPlayed.length) {
        const cardInPlay = lastCardsPlayed[lastCardsPlayed.length - 1];
        if (isBlackjacks) {
            if (cardInPlay.value === 'Ace') {
                return {
                    value: null,
                    suit: nomination,
                    king: false,
                    two: 0,
                    blackjacks: 0,
                    gameTypeIndex
                }
            } else {
                return {
                    ...cardInPlay,
                    king: cardInPlay.value === 'King',
                    two: cardInPlay.value === '2' ? two + 1 : 0,
                    blackjacks: (cardInPlay.value === 'Jack' && SUITS.find(suit => suit.name === cardInPlay.suit).isBlack) ? blackjacks + 1 : 0,
                    gameTypeIndex
                }
            }
        }
        if (isJackTwosAndEights) {
            if (cardInPlay.value === 'Jack') {
                return {
                    value: null,
                    suit: nomination,
                    two: 0,
                    eight: false,
                    gameTypeIndex
                }
            } else {
                return {
                    ...cardInPlay,
                    eight: cardInPlay.value === '8',
                    two: cardInPlay.value === '2' ? two + 1 : 0,
                    gameTypeIndex
                }
            }
        }
    } else {
        return {
            value,
            suit,
            king: false,
            eight: false,
            two: 0,
            blackjacks: 0,
            gameTypeIndex
        }
    }
}

const cardsToPickUp = ({ king, eight, two, blackjacks, gameTypeIndex }) => {
    const isBlackjacks = gameTypeIndexIsBlackjack(gameTypeIndex);
    const isJackTwosAndEights = gameTypeIndexIsJackTwosAndEights(gameTypeIndex);
    if (isBlackjacks) {
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
    if (isJackTwosAndEights) {
        if (eight) {
            return 0;
        } else if (two) {
            return 2 * two;
        } else {
            return 1;
        }
    }
}

const isOneUpOrDown = (firstCardValue, seconCardValue) => {
    const firstIndex = CARD_VALUES.findIndex(cardValue => cardValue === firstCardValue);
    const secondIndex = CARD_VALUES.findIndex(cardValue => cardValue === seconCardValue);
    return (firstIndex + 1) % CARD_VALUES.length === secondIndex || (secondIndex + 1) % CARD_VALUES.length === firstIndex;
}

const combinationsToPlay = (initialCardArrays, hand, valueRunsOnly, savedCombinations = []) => {
    // STOP: Check this funky function
    const newInitialCardsArrays = initialCardArrays.flatMap(initialCardArray => {
        const lastCard = initialCardArray[initialCardArray.length - 1];
        const cardsLeftInHand = hand
            .filter(card => !initialCardArray.some(c => c.value === card.value && c.suit === card.suit));
        const cardsCanPlay = cardsLeftInHand.filter(handCard => {
            return handCard.value === lastCard.value
                || (!valueRunsOnly && handCard.suit === lastCard.suit && isOneUpOrDown(handCard.value, lastCard.value))
        });
        return cardsCanPlay.map(card => initialCardArray.concat([card]));
    });
    if (newInitialCardsArrays.length) {
        return combinationsToPlay(newInitialCardsArrays, hand, valueRunsOnly, savedCombinations.concat(initialCardArrays));
    } else {
        return savedCombinations.concat(initialCardArrays);
    }
}

const possibleCardsToPlay = ({ value, suit, king, eight, two, blackjacks, gameTypeIndex }, hand) => {
    const isBlackjacks = gameTypeIndexIsBlackjack(gameTypeIndex);
    const isJackTwosAndEights = gameTypeIndexIsJackTwosAndEights(gameTypeIndex);
    let initialCards;
    if (isBlackjacks) {
        if (king) {
            initialCards = hand.filter(card => card.value === 'King');
        } else if (two) {
            initialCards = hand.filter(card => card.value === '2');
        } else if (blackjacks) {
            initialCards = hand.filter(card => card.value === 'Jack');
        } else if (!value && !suit) {
            initialCards = hand;
        } else {
            initialCards = hand
                .filter(card => card.value === value || (card.suit === suit && card.value !== 'Ace'));
        }
        const acesInHand = hand.filter(card => card.value === 'Ace');
        const nominationSavedCombinations = (king || two || blackjacks) ?
            [[]] : combinationsToPlay(acesInHand.map(card => [card]), acesInHand, true, [[]]);
        return combinationsToPlay(initialCards.map(card => [card]), hand, king || two || blackjacks, nominationSavedCombinations);
    }
    if (isJackTwosAndEights) {
        if (two) {
            initialCards = hand.filter(card => card.value === '2');
        } else if (eight) {
            initialCards = []
        } else if (!value && !suit) {
            initialCards = hand;
        } else {
            initialCards = hand
                .filter(card => card.value === value || (card.suit === suit && card.value !== 'Jack'));
        }
        const jacksInHand = hand.filter(card => card.value === 'Jack');
        const nominationSavedCombinations = two ?
            [[]] : combinationsToPlay(jacksInHand.map(card => [card]), jacksInHand, true, [[]]);
        return combinationsToPlay(initialCards.map(card => [card]), hand, two, nominationSavedCombinations);
    }
}

const visibleViewOfPlayers = (players, activeCards, playerName) => {
    return players.map(player => {
        return {
            name: player.name,
            handSize: player.hand.length,
            isLastCard: combinationsToPlay(player.hand.map(card => [card]), player.hand, false, [[]]).filter(cards => cards.length === player.hand.length).length > 0,
            ...(player.name === playerName && { hand: player.hand }),
            ...(player.name === playerName && { possibleCardsToPlay: possibleCardsToPlay(activeCards, player.hand).reverse() })
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

const cardsAreSame = (a, b) => {
    if (a.length !== b.length) {
        return false;
    }
    return a.every((_, i) => a[i].value === b[i].value && a[i].suit === b[i].suit);
}

const calculateUpdatedGameState = ({ activeCards, deck, lastCardsPlayed, players, turnIndex }, playerName, cardsPlayed, nomination = null) => {
    const playerHand = players.find(player => player.name === playerName).hand;
    if (!possibleCardsToPlay(activeCards, playerHand).find(cards => cardsAreSame(cards, cardsPlayed))) {
        return { activeCards, deck, lastCardsPlayed, players, turnIndex };
    }
    let newDeck = null;
    let newPlayers = null;
    if (!cardsPlayed || !cardsPlayed.length) {
        // TODO: Split out pick up cards into subfunctions
        const numberOfCardsToPickUp = cardsToPickUp(activeCards);
        let cardsPickedUp;
        if (numberOfCardsToPickUp > deck.length) {
            const leftoverCardsToPickUp = numberOfCardsToPickUp - deck.length;
            const initialCardsPickedUp = deck;
            const notInDeck = players.flatMap(player => player.hand).concat(initialCardsPickedUp);
            const initialNewDeck = getShuffledDeck()
                .filter(card => !notInDeck.some(c => c.value === card.value && c.suit === card.suit));
            cardsPickedUp = initialNewDeck.splice(0, leftoverCardsToPickUp).concat(initialCardsPickedUp);
            newDeck = initialNewDeck.splice(leftoverCardsToPickUp);
        } else {
            cardsPickedUp = deck.splice(0, numberOfCardsToPickUp);
            newDeck = deck.splice(numberOfCardsToPickUp);
        }
        newPlayers = players.map(player => {
            return {
                name: player.name,
                isAI: player.isAI,
                hand: player.name === playerName
                    ? player.hand.concat(cardsPickedUp)
                    : player.hand
            }
        });
    } else {
        newDeck = deck;
        newPlayers = players.map(player => {
            return {
                name: player.name,
                isAI: player.isAI,
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
        turnIndex: (turnIndex + 1) % players.length,
        activeCards: getNextActiveCards(cardsPlayed, activeCards, nomination)
    };
}

module.exports = {
    getShuffledDeck,
    gameTypeIndexIsBlackjack,
    gameTypeIndexIsJackTwosAndEights,
    getNextActiveCards,
    possibleCardsToPlay,
    displayGameStateForPlayer,
    calculateUpdatedGameState
}
