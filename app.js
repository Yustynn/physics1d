const { PI, abs, pow, sin, sqrt } = Math;

/* CONSTANTS */
const ERROR_RANGE = 0.1;

const K = 70.833333;
const DX = 0.09;
const G = 9.81;
const L = 0.14;
const M = 2;

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

// const data = [];

// temp dummy data

const data = [
  [30,128.6],
  [40,145.4],
  [50,153],
  [60,144.2],
  [70,127],
  [80,110],
  [90,92.8]
].map( (el) => [degToRad(el[0]), el[1]/100] );

// populate w/ theoretical data
const startingXs = [0,1,2];

// startingXs.forEach((x) => {
//   d.push([x, estimateTheta(x)])
// })

// $(function() {
//   // obtain graph
//   // const data = [...d];
//   const myRegression = regression('exponential', data, 2);
//
//   // Plot the result
//   $.plot($('.graph'), [
//     {data: myRegression.points, label: 'Polynomial'},
//     {data: data, lines: { show: false }, points: { show: true }},
//   ]);
// })

const plot = (d = data) => {
  // do the regression (polynomial to the third degree)
  const myRegression = regression('polynomial', d, 2);

  $('h4').text(myRegression.string);

  // Plot the result
  $.plot($('.graph'), [
    { data: myRegression.points },
    { data, lines: { show: false }, points: { show: true } },
  ]);
}




$(function(){
  plot();

  const addEls = {
    angle: $('#add-angle')[0],
    distance: $('#add-distance')[0],
  }
  console.log(addEls)


  $('#add-btn').click( (e) => {
    e.preventDefault();
    angle = +$('#add-angle').val();
    distance = +$('#add-distance').val();

    data.push([distance, angle]);
    plot();

    // clear input
    $('#add-angle').val('');
    $('#add-distance').val('');

  })

  $('#prediction-btn').click( (e) => {
    e.preventDefault();

    distance = +$('#prediction-distance').val();

    if (distance) {
      const d = [
        ...data,
        [distance, null]
      ];

      plot(d);

      const myRegression = regression('polynomial', d, 3);
      const predictedDistance = +lastEl(myRegression.points)[1];
      console.log(predictedDistance)

      $('#prediction-value').text(predictedDistance.toPrecision(3))
    }

    // clear input
    $('#add-angle').val('');
  })

});
