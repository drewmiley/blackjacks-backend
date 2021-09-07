const {
    AI_PLAYER,
    SUITS
} = require('./constants');

const {
    gameTypeIndexIsBlackjack,
    gameTypeIndexIsJackTwosAndEights,
    possibleCardsToPlay
} = require('./util');

const getUnplayedCardsRemainingInGame = ({ deck, players }) => {
    return deck.concat(players.find(player => player.name !== AI_PLAYER).hand);
}

const getSuitProportionsAfterCardsPlayed = (unplayedCardsRemainingInGame, hand, cardsToPlay, faceValuesToIgnore) => {
    const unPlayedCardsIgnoringFaceValues = unplayedCardsRemainingInGame.filter(card => !faceValuesToIgnore.includes(card.value));
    return SUITS.map(suit => {
        const suitLeftInHand = hand
            .filter(card => !faceValuesToIgnore.includes(card.value) && !cardsToPlay.find(cardToPlay => cardToPlay.value == card.value && cardToPlay.suit === card.suit))
            .filter(card => card.suit === suit).length;
        const suitLeftInGame = unPlayedCardsIgnoringFaceValuesfilter(card => card.suit === suit).length;
        return { name: suit, proportion: suitLeftInHand / suitLeftInGame };
    })
}

const cardsToPlay = ({ deck, players, activeCards }) => {
    const aiPlayer = players.find(player => player.name === AI_PLAYER);
    const possibleCards = possibleCardsToPlay(activeCards, aiPlayer.hand);
    if (possibleCards.length === 1) {
        return possibleCards[0];
    }
    const unplayedCardsRemainingInGame = getUnplayedCardsRemainingInGame({ deck, players });
    const maxPlaySize = (possibleCards.sort((a, b) => a.length - b.length)[0]).length;
    let faceValuesToIgnore = [];
    if (gameTypeIndexIsBlackjack(activeCards.gameTypeIndex)) {
        faceValuesToIgnore = ['Two', 'King'];
    } else if (gameTypeIndexIsJackTwosAndEights(activeCards.gameTypeIndex)) {
        faceValuesToIgnore = ['Two', 'Jack'];
    }
    const maxPlayCards = possibleCards.filter(cards => cards.length === maxPlaySize);
    const maxSuitProportions = maxPlayCards
        .map(cards => {
            const suitProportions = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, aiPlayer.hand, cards, faceValuesToIgnore);
            const isNomination = gameTypeIndexIsBlackjack(activeCards.gameTypeIndex) && (cards[cards.length - 1]).value === 'King' ||
                gameTypeIndexIsJackTwosAndEights(activeCards.gameTypeIndex) && (cards[cards.length - 1]).value === 'Jack';
            const proportion = isNomination ?
                (suitProportions.sort((a, b) => b.proportion - a.proportion)[0]).proportion :
                suitProportions.find(suitProportion => suitProportion.suit === (cards[cards.length - 1]).suit).proportion;
            return { cards, proportion }
        });
    return (maxSuitProportions.sort((a, b) => a.proportion - b.proportion)[0]).cards;
}

const nominationToPlay = ({ deck, players, activeCards }) => {
    const hand = players.find(player => player.name === AI_PLAYER).hand;
    const unplayedCardsRemainingInGame = getUnplayedCardsRemainingInGame({ deck, players });
    let faceValuesToIgnore = [];
    if (gameTypeIndexIsBlackjack(activeCards.gameTypeIndex)) {
        faceValuesToIgnore = ['Ace'];
    } else if (gameTypeIndexIsJackTwosAndEights(activeCards.gameTypeIndex)) {
        faceValuesToIgnore = ['Jack'];
    }
    const suitProportionsAfterCardsPlayed = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, hand, [], faceValuesToIgnore);
    return (suitProportions.sort((a, b) => a.proportion - b.proportion)[0]).suit;
}

const playCards = gameState => {
    const cards = cardsToPlay(gameState);
    const isNomination = gameTypeIndexIsBlackjack(gameState.activeCards.gameTypeIndex) && (cards[cards.length - 1]).value === 'King' ||
        gameTypeIndexIsJackTwosAndEights(gameState.activeCards.gameTypeIndex) && (cards[cards.length - 1]).value === 'Jack';
    const nomination = isNomination ? nominationToPlay(gameState) : null;
    return { cards, nomination };
}

module.exports = { playCards };
