const {
    AI_PLAYER,
    SUITS
} = require('./constants');

const {
    gameTypeIndexIsBlackjack,
    gameTypeIndexIsJackTwosAndEights,
    possibleCardsToPlay
} = require('./util');

const getUnplayedCardsRemainingInGame = ({ deck, players }) => deck.concat(players.find(player => player.name !== AI_PLAYER).hand);

const getSuitProportionsAfterCardsPlayed = (unplayedCardsRemainingInGame, hand, cardsToPlay, faceValuesToIgnore) => {
    const unPlayedCardsIgnoringFaceValues = unplayedCardsRemainingInGame.filter(card => !faceValuesToIgnore.includes(card.value));
    return SUITS.map(suit => {
        const suitLeftInHand = hand
            .filter(card => !faceValuesToIgnore.includes(card.value) && !cardsToPlay.find(cardToPlay => cardToPlay.value == card.value && cardToPlay.suit === card.suit))
            .filter(card => card.suit === suit.name).length;
        const suitLeftInGame = unPlayedCardsIgnoringFaceValues.filter(card => card.suit === suit.name).length;
        const proportion = !suitLeftInHand ? 0 : suitLeftInHand / suitLeftInGame;
        return { suit: suit.name, proportion };
    })
}

const cardsToPlay = ({ deck, players, activeCards }, nominationValue) => {
    const aiPlayer = players.find(player => player.name === AI_PLAYER);
    const possibleCards = possibleCardsToPlay(activeCards, aiPlayer.hand);
    if (possibleCards.length === 1) {
        return possibleCards[0];
    }
    const unplayedCardsRemainingInGame = getUnplayedCardsRemainingInGame({ deck, players });
    const maxPlaySize = possibleCards.sort((a, b) => b.length - a.length)[0].length;
    const maxPlayCards = possibleCards.filter(cards => cards.length === maxPlaySize);
    const maxSuitProportions = maxPlayCards
        .map(cards => {
            const suitProportions = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, aiPlayer.hand, cards, ['Two', nominationValue]);
            const proportion = cards[cards.length - 1].value === nominationValue ?
                suitProportions.sort((a, b) => b.proportion - a.proportion)[0].proportion :
                suitProportions.find(suitProportion => suitProportion.suit === cards[cards.length - 1].suit).proportion;
            return { cards, proportion };
        });
    return maxSuitProportions.sort((a, b) => a.proportion - b.proportion)[0].cards;
}

const nominationToPlay = ({ deck, players }, nominationValue) => {
    const hand = players.find(player => player.name === AI_PLAYER).hand;
    const unplayedCardsRemainingInGame = getUnplayedCardsRemainingInGame({ deck, players });
    const suitProportions = getSuitProportionsAfterCardsPlayed(unplayedCardsRemainingInGame, hand, [], [nominationValue]);
    return suitProportions.sort((a, b) => a.proportion - b.proportion)[0].suit;
}

const playCards = gameState => {
    let nominationValue;
    if (gameTypeIndexIsBlackjack) {
        nominationValue = 'Ace';
    } else if (gameTypeIndexIsJackTwosAndEights) {
        nominationValue = 'Jack';
    }
    const cards = cardsToPlay(gameState, nominationValue);
    const nomination = cards.length && cards[cards.length - 1].value === nominationValue ? nominationToPlay(gameState, nominationValue) : null;
    return { cards, nomination };
}

module.exports = { playCards };
