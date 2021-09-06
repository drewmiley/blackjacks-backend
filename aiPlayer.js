const {
    AI_PLAYER,
    CARD_VALUES,
    SUITS
} = require('./constants');

const {
    getShuffledDeck,
    possibleCardsToPlay
} = require('./util');

// class ProportionalPlayer extends Player {
//
//     @Override
//     public List<Card> cardsToPlay(Rules rules, Deck deck, Pile pile, List<VisiblePlayer> visiblePlayers) {
//         List<List<Card>> possibleCardsToPlay = this.possibleCardsToPlay(rules, pile);
//         List<Card> unplayedCardsRemainingInGame = unplayedCardsRemainingInGame(pile, hand);
//         Long maxCardsToPlaySize = possibleCardsToPlay.stream()
//                 .mapToLong(List::size)
//                 .max()
//                 .getAsLong();
//         if (maxCardsToPlaySize == 0) {
//             return new ArrayList<>();
//         }
//         Map<List<Card>, Double> maxSuitProportions = possibleCardsToPlay.stream()
//                 .filter(cards -> cards.size() == maxCardsToPlaySize)
//                 .collect(Collectors.toMap(c -> c,
//                     c -> {
//                         Map<Suit, Double> suitProportions = suitProportionsAfterCardsPlayed(
//                                 unplayedCardsRemainingInGame,
//                                 hand,
//                                 c,
//                                 Arrays.asList(FaceValue.TWO, FaceValue.JACK)
//                         );
//                         return c.get(c.size() - 1).getFaceValue() == rules.NOMINATE_SUIT ?
//                                 suitProportions.entrySet().stream()
//                                     .min(Comparator.comparingDouble(Map.Entry::getValue))
//                                     .get()
//                                     .getValue() :
//                                 suitProportions.get(c.get(c.size() - 1).getSuit());
//
//                     })
//                 );
//         return maxSuitProportions.entrySet().stream()
//                 .max(Comparator.comparingDouble(Map.Entry::getValue))
//                 .get()
//                 .getKey();
//     }
//
//     @Override
//     public Suit nomination(Rules rules, Deck deck, Pile pile, List<VisiblePlayer> visiblePlayers) {
//         List<Card> unplayedCardsRemainingInGame = unplayedCardsRemainingInGame(pile, hand);
//         Map<Suit, Double> suitProportions = suitProportionsAfterCardsPlayed(
//                 unplayedCardsRemainingInGame,
//                 hand,
//                 new ArrayList<>(),
//                 Collections.singletonList(FaceValue.JACK)
//         );
//         return suitProportions.entrySet().stream()
//                 .max(Comparator.comparingDouble(Map.Entry::getValue))
//                 .get()
//                 .getKey();
//     }

const unplayedCardsRemainingInGame = ({ deck, players }) => {
    return deck.concat(players.find(player => player.name !== AI_PLAYER).hand);
}

const suitProportionsAfterCardsPlayed = (unplayedCardsRemainingInGame, hand, cardsToPlay, faceValuesToIgnore) => {
    const unPlayedCardsIgnoringFaceValues = unplayedCardsRemainingInGame.filter(card => !faceValuesToIgnore.includes(card.value));
    // TODO: Implement cardsToPlay includes
    return SUITS.map(suit => {
        const suitLeftInHand = hand
            .filter(card => !faceValuesToIgnore.includes(card.value) && !cardsToPlay.includes(card))
            .filter(card => card.suit === suit).length;
        const suitLeftInGame = unPlayedCardsIgnoringFaceValuesfilter(card => card.suit === suit).length;
        return { name: suit, proportion: suitLeftInHand / suitLeftInGame };
    })
}

const cardsToPlay = ({ deck, lastCardsPlayed, players, turnIndex, activeCards }) => {
    const aiPlayer = players.find(player => player.name === AI_PLAYER);
    const possibleCards = possibleCardsToPlay(activeCards, aiPlayer.hand);
    console.log(possibleCards);
    const cards = [];
    return cards;
}

const nomination = ({ deck, lastCardsPlayed, players, turnIndex, activeCards }) => {
    const nomination = null;
    return nomination;
}

const playCards = gameState => {
    console.log(gameState);
    const cards = cardsToPlay(gameState);
    return { cards, nomination };
}

module.exports = { playCards };
