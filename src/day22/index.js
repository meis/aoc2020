const fs = require('fs');

module.exports = function(inputFile) {
  const [player1, player2] = parseFile(inputFile);

  const game1 = new Combat(player1, player2).play();
  const game2 = new RecursiveCombat(player1, player2).play();

  console.log("The 'Combat' winning player's score is:", game1.score);
  console.log("The 'Recursive Combat' winning player's score is:", game2.score);
};

class GameResult {
  constructor(player, cards) {
    this.player = player;
    this.score = [...cards]
      .reverse()
      .map((card, index) => card * (index + 1))
      .reduce((a, b) => a + b, 0);
  }
}

class Combat {
  constructor(player1, player2) {
    this.player1 = [...player1];
    this.player2 = [...player2];
  }

  play() {
    while(this.player1.length > 0 && this.player2.length > 0) {
      const play1 = this.player1.shift();
      const play2 = this.player2.shift();
      const receiver = play1 > play2 ? this.player1 : this.player2;
      receiver.push(...[play1, play2].sort((a, b) => b - a));
    }

    const winner = this.player1.length == 0 ? this.player2 : this.player1;

    return new GameResult(winner == this.player1 ? 1 : 2, winner);
  }
}

class RecursiveCombat {
  constructor(player1, player2) {
    this.player1 = [...player1];
    this.player2 = [...player2];
    this.previousRounds = {};
  }

  play() {
    while(this.player1.length > 0 && this.player2.length > 0) {
      // Before either player deals a card, if there was a previous round in this
      // game that had exactly the same cards in the same order in the same
      // players' decks, the game instantly ends in a win for player 1.
      if (this.sameCardsThanPreviousRound()) {
        return new GameResult(1, this.player1);
      }
      const play1 = this.player1.shift();
      const play2 = this.player2.shift();

      // If both players have at least as many cards remaining in their deck as
      // the value of the card they just drew, the winner of the round is
      // determined by playing a new game of Recursive Combat.
      if (this.player1.length >= play1 && this.player2.length >= play2) {
        const subDeck1 = this.player1.slice(0, play1);
        const subDeck2 = this.player2.slice(0, play2);
        const result = new RecursiveCombat(subDeck1, subDeck2).play();

        if (result.player == 1) {
          this.player1.push(play1, play2);
        }
        else {
          this.player2.push(play2, play1);
        }
      }
      // Otherwise, at least one player must not have enough cards left in their
      // deck to recurse; the winner of the round is the player with the higher-value card
      else {
        const receiver = play1 > play2 ? this.player1 : this.player2;
        receiver.push(...[play1, play2].sort((a, b) => b - a));
      }
    }

    const winner = this.player1.length == 0 ? this.player2 : this.player1;

    return new GameResult(winner == this.player1 ? 1 : 2, winner);
  }

  sameCardsThanPreviousRound() {
    const key = this.player1.join('.') + "|" + this.player2.join('.');
    if (this.previousRounds[key]) return true;

    this.previousRounds[key] = true;
    return false;
  }
}

function parseFile(file) {
  const [deck1, deck2] = fs.readFileSync(file)
    .toString()
    .split("\n\n")
    .map(x => x.split("\n").filter(l => l !== ''));

  deck1.shift();
  deck2.shift();

  return [deck1.map(x => parseInt(x)), deck2.map(x => parseInt(x))]
}
