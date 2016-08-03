const { PI, abs, pow, sin, sqrt } = Math;

/* CONSTANTS */
const ERROR_RANGE = 0.0001;

const K = 70.833333;
const DX = 0.09;
const G = 9.81;
const L = 0.14;
const M = 2;

/* VARIABLES */
let myRegression = null;

/* UTILITY FUNCTIONS */
// currently unused, it's just in case
function radToDeg(rad) {
	return rad * 180 / PI;
}

function degToRad(deg) {
	return deg * PI / 180;
}

const lastEl = (arr) => arr[arr.length - 1];

/* INTERMEDIATE FUNCTIONS */
const computeDistance = (theta) => {
  const n1a1 = K * pow(DX, 2) / M;
  const n1a2 = -2 * G * L * sin(theta);
  const n1 = n1a1 + n1a2;

  const n2 = sin(2 * theta);

  const numerator = n1 * n2;
  const denominator = G;

  return numerator / denominator;
}

const getPrediction = (y, eqn) => {
  for (let x = 0; x < 90; x += 0.01) {
		const estY = eqn.reduce( (currSum, polynomial, exp) => {
			return currSum + polynomial * pow(x, exp)
		}, 0 );

		if (abs(estY - y) <= ERROR_RANGE) return x;
	}
	return null;
}

const getEqnStr = (eqn) => {

	const rightHandSide = eqn.map((factor, exp) => {
		let transformed = '';

		// prepend '+' or '-' and factor
		factor = factor.toPrecision(7);

		transformed += (factor[0] === '-') ? factor : `+${factor}`;

		// append x^ if exp>0
		if (exp) transformed += `x^${exp}`;
		// remove sign if first term
		if (exp === eqn.length - 1) transformed = transformed.slice(1);
		return transformed;
	}).reverse().join('');

	return `y = ${rightHandSide}`;
}


/* TERMINAL FUNCTIONS */
const estimateTheta = (desiredDistance) => {
  let guess = 0;
	const store = [];

  while (guess < PI) {
    const distance = computeDistance(guess);
		store.push(distance)
    if ( abs(distance - desiredDistance) < ERROR_RANGE ) {
      return ( radToDeg(guess) );
    }

    guess += PI / 1000;
  }

  return 'DAMMIT!';
}

/* USAGE */

// [angle, distance]
const data = [
  [0,0],
  [38.865,1.286],
  [49.38,1.454],
  [58.675,1.53],
  [66.75,1.442],
  [73.605,1.27],
  [79.24,1.10],
  [83.655,0.928],
]

const plot = (d = data) => {
  // do the regression (polynomial to the third degree)
	d.sort( (a, b) => a[0] - b[0] )
  myRegression = regression('polynomial', d, 3);
	console.log(myRegression)

  $('h4').text( getEqnStr(myRegression.equation) );

  // Plot the result
  $.plot($('.graph'), [
    { data: myRegression.points },
    { data, lines: { show: false }, points: { show: true } },
  ]);
}




$(function(){
  plot();

  $('#add-btn').click( (e) => {
    e.preventDefault();
    angle = +$('#add-angle').val();
    distance = +$('#add-distance').val();

    data.push([angle, distance]);
    plot();

    // clear input
    $('#add-angle').val('');
    $('#add-distance').val('');

  })

  $('#prediction-btn').click( (e) => {
    e.preventDefault();

    const distance = +$('#prediction-distance').val();
		const angle = getPrediction(distance, myRegression.equation);
		console.log(angle)

    if (distance && angle) {
      const d = [
        ...data,
        [angle, distance]
      ];

      plot(d);

      const predictedDistance = +lastEl(myRegression.points)[0];
      console.log(predictedDistance)
      console.log(myRegression.points, myRegression)


      $('#prediction-value').text(getPrediction(distance, myRegression.equation))
    }

    // clear input
    $('#add-angle').val('');
  })



});
