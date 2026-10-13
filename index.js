'use strict';

const COLORS = ['red', 'blue', 'green', 'yellow'];

function createScores() {
  return COLORS.reduce((scores, color) => {
    scores[color] = 0;
    return scores;
  }, {});
}

function logScoreChange(eventName, previousScores, updatedScores) {
  console.log(`${eventName} - previous scores:`, previousScores);
  console.log(`${eventName} - updated scores:`, updatedScores);
}

function OpeningCeremony(callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('OpeningCeremony requires a callback function.');
  }

  console.log('Let the games begin!');
  const scores = createScores();

  setTimeout(() => {
    callback(scores);
  }, 1000);
}

function Race100M(scores, callback) {
  if (!scores || typeof callback !== 'function') {
    throw new TypeError('Race100M requires scores and a callback function.');
  }

  setTimeout(() => {
    const previousScores = { ...scores };
    const raceTimes = COLORS.reduce((times, color) => {
      // A race time between 10 and 20 seconds; lower times place higher.
      times[color] = Math.floor(Math.random() * 11) + 10;
      return times;
    }, {});
    const finishingOrder = [...COLORS].sort(
      (firstColor, secondColor) => raceTimes[firstColor] - raceTimes[secondColor],
    );
    const points = [50, 25, 10, 5];

    finishingOrder.forEach((color, index) => {
      scores[color] += points[index];
    });

    console.log('100m race times:', raceTimes);
    logScoreChange('100m race', previousScores, scores);
    callback(scores);
  }, 3000);
}

function LongJump(scores, callback) {
  if (!scores || typeof callback !== 'function') {
    throw new TypeError('LongJump requires scores and a callback function.');
  }

  setTimeout(() => {
    const previousScores = { ...scores };
    const winningColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    scores[winningColor] += 150;

    console.log(`${winningColor} wins the long jump!`);
    logScoreChange('Long jump', previousScores, scores);
    callback(scores);
  }, 2000);
}

function readHighJumpColor() {
  if (typeof globalThis.prompt === 'function') {
    return globalThis.prompt(
      'Which color athlete had the highest jump? (red, blue, green, yellow)',
    );
  }

  if (process.stdin.isTTY) {
    const readline = require('readline');
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      input.question(
        'Which color athlete had the highest jump? (red, blue, green, yellow) ',
        (answer) => {
          input.close();
          resolve(answer);
        },
      );
    });
  }

  return '';
}

function HighJump(scores, callback) {
  if (!scores || typeof callback !== 'function') {
    throw new TypeError('HighJump requires scores and a callback function.');
  }

  const previousScores = { ...scores };
  const answer = readHighJumpColor();

  Promise.resolve(answer).then((value) => {
    const winningColor = typeof value === 'string' ? value.trim().toLowerCase() : '';

    if (COLORS.includes(winningColor)) {
      scores[winningColor] += 100;
      console.log(`${winningColor} wins the high jump!`);
    } else {
      console.log('No valid high jump winner was provided.');
    }

    logScoreChange('High jump', previousScores, scores);
    callback(scores);
  });
}

function AwardCeremony(scores) {
  if (!scores) {
    throw new TypeError('AwardCeremony requires scores.');
  }

  const standings = [...COLORS].sort((firstColor, secondColor) => {
    const scoreDifference = scores[secondColor] - scores[firstColor];
    return scoreDifference || COLORS.indexOf(firstColor) - COLORS.indexOf(secondColor);
  });

  console.log('Final scores:', scores);
  console.log(`1st place: ${standings[0]} (${scores[standings[0]]} points)`);
  console.log(`2nd place: ${standings[1]} (${scores[standings[1]]} points)`);
  console.log(`3rd place: ${standings[2]} (${scores[standings[2]]} points)`);
  console.log(`4th place: ${standings[3]} (${scores[standings[3]]} points)`);
}

function startSportsDay() {
  OpeningCeremony((scores) => {
    Race100M(scores, (updatedScores) => {
      LongJump(updatedScores, (finalScores) => {
        HighJump(finalScores, AwardCeremony);
      });
    });
  });
}

if (require.main === module) {
  startSportsDay();
}

module.exports = {
  AwardCeremony,
  HighJump,
  LongJump,
  OpeningCeremony,
  Race100M,
  createScores,
  startSportsDay,
};
