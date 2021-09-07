const {
    AI_PLAYER,
    SUITS
} = require('./constants');

const {
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
    const maxPlayCards = possibleCards.filter(cards => cards.length === maxPlaySize);
    const maxSuitProportions = maxPlayCards
        .map(cards => {
            const suitProportions = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, aiPlayer.hand, cards, ['Two', 'Jack']);
            const proportion = (cards[cards.length - 1]).value === 'Jack' ?
                (suitProportions.sort((a, b) => b.proportion - a.proportion)[0]).proportion :
                suitProportions.find(suitProportion => suitProportion.suit === (cards[cards.length - 1]).suit).proportion;
            return { cards, proportion };
        });
    return (maxSuitProportions.sort((a, b) => a.proportion - b.proportion)[0]).cards;
}

const nominationToPlay = ({ deck, players }) => {
    const hand = players.find(player => player.name === AI_PLAYER).hand;
    const unplayedCardsRemainingInGame = getUnplayedCardsRemainingInGame({ deck, players });
    const suitProportionsAfterCardsPlayed = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, hand, [], ['Jack']);
    return (suitProportions.sort((a, b) => a.proportion - b.proportion)[0]).suit;
}

const playCards = gameState => {
    const cards = cardsToPlay(gameState);
    const nomination = (cards[cards.length - 1]).value === 'Jack' ? nominationToPlay(gameState) : null;
    return { cards, nomination };
}

module.exports = { playCards };
