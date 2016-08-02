const chalk = require('chalk');
const regression = require('regression');

const logIt = (color) => (message) => { console.log(chalk[color](message)) };

const blue = logIt('blue');
const green = logIt('green');
const red = logIt('red');
const yellow = logIt('yellow');

const { PI, abs, pow, sin, sqrt } = Math;

/* CONSTANTS */
const K = 70.833333;
const DX = 0.09;
const G = 9.81;
const L = 0.14;
const M = 2;

const V = sqrt(K * pow(DX, 2) / M);

const ERROR_RANGE = 0.05;

/* UTILITY FUNCTIONS */
function radToDeg(rad) {
	return rad * 180 / PI;
}

/* INTERMEDIATE FUNCTIONS */
// const computeDistance = (theta) => {
//   const n1a1 = K * pow(DX, 2) / M;
//   const n1a2 = -2 * G * L * sin(theta);
//   const n1 = n1a1 + n1a2;
//
//   const n2 = sin(2 * theta);
//
//   const numerator = n1 * n2;
//   const denominator = G;
//
//   console.log(numerator / denominator)
//   return numerator / denominator;
// }

const computeDistance = (theta) => {
	return 1/G * pow(DX, 2) * sin(2*theta)
}

/* TERMINAL FUNCTIONS */
const estimateTheta = (desiredDistance) => {
  let guess = 0;
	const store = [];

  while (guess < PI) {
    const distance = computeDistance(guess);
		store.push(distance)
    if ( abs(distance - desiredDistance) < ERROR_RANGE ) {
      blue( radToDeg(guess) );
			return;
    }

    guess += PI / 1000;
  }

  red('DAMMIT.')
	console.log(Math.max(...store));
}

/* USAGE */

estimateTheta(1.3);

//
// const data = [[0,1],[32, 67], [12, 79], [1000, null]];
// let result = regression('linear', data, 4);
//
// console.log(result.points)
//
// result = regression('exponential', data);
//
// console.log(result.points)

// for (let i = 0; i < 20; i++) {
//   console.log(`For ${i}`)
//   estimateTheta(i);
// }
