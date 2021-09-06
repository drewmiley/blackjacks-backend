
// public abstract class Player {
//     private int playerIndex;
//     List<Card> hand;
//     List<Card> knownHand = new ArrayList<>();
//
//     List<List<Card>> possibleCardsToPlay(Rules rules, Pile pile) {
//         List<List<Card>> possibleCardsToPlay = new ArrayList<>();
//         final List<List<Card>>[] result = new List[]{new ArrayList<>()};
//         result[0] = hand.stream()
//                 .map(card -> Stream.of(card).collect(Collectors.toList()))
//                 .filter(card -> rules.isAllowedPlay(pile, card))
//                 .collect(Collectors.toList());
//         possibleCardsToPlay.addAll(result[0]);
//         IntStream.range(0, hand.size() - 1)
//                 .mapToObj(i -> hand)
//                 .flatMap(Collection::stream)
//                 .forEach(handCard -> {
//                     result[0] = result[0].stream()
//                             .filter(cards -> {
//                                 List<Card> cardPair = Stream.of(cards.get(cards.size() - 1), handCard)
//                                         .collect(Collectors.toList());
//                                 return !cards.contains(handCard) && rules.runValid(cardPair, pile);
//                             })
//                             .map(cards -> Stream.concat(
//                                             cards.stream(),
//                                             Stream.of(handCard).collect(Collectors.toList()).stream()
//                                     ).collect(Collectors.toList()))
//                             .collect(Collectors.toList());
//                     possibleCardsToPlay.addAll(result[0]);
//                 });
//         possibleCardsToPlay.add(new ArrayList<>());
//         return possibleCardsToPlay;
//     }
// }

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
//
//     private List<Card> unplayedCardsRemainingInGame(Pile pile, List<Card> hand) {
//         List<Card> cards = Stream.of(FaceValue.values())
//                 .flatMap(faceValue -> Stream.of(Suit.values()).map(suit -> new Card(faceValue, suit)))
//                 .collect(Collectors.toList());
//         cards.remove(pile.topCard());
//         cards.removeAll(pile.getCardsBelowTopCard());
//         cards.removeAll(hand);
//         return cards;
//     }
//
//     private Map<Suit, Double> suitProportionsAfterCardsPlayed(List<Card> unplayedCardsRemainingInGame,
//                                                             List<Card> hand,
//                                                             List<Card> cardsToPlay,
//                                                             List<FaceValue> faceValuesToIgnore) {
//         List<Card> unPlayedCardsIgnoringFaceValues = unplayedCardsRemainingInGame.stream()
//                 .filter(card -> !faceValuesToIgnore.contains(card.getFaceValue()))
//                 .collect(Collectors.toList());
//         return Arrays.stream(Suit.values())
//                 .collect(Collectors.toMap(s -> s,
//                         s -> {
//                             Double suitLeftInHand = (double) hand.stream()
//                                     .filter(card -> !faceValuesToIgnore.contains(card.getFaceValue()) && !cardsToPlay.contains(card))
//                                     .filter(card -> card.getSuit() == s)
//                                     .count();
//                             Double suitLeftInGame = (double) unPlayedCardsIgnoringFaceValues.stream()
//                                     .filter(card -> card.getSuit() == s)
//                                     .count();
//                             return suitLeftInHand / suitLeftInGame;
//                         })
//                 );
//     }
// }

const playCards = gameState => {
    return { cards: null, nomination: null };
}

const aiPlayer = { playCards };

module.exports = aiPlayer;
