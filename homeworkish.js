const initVelocity = 20;
const gravity = 9.81
const { PI } = Math;

function radToDeg(rad) {
	return rad * 180 / PI;
}

function getLaunchAngle(distance) {
	const numerator = gravity * distance;
	const denominator = Math.pow(initVelocity, 2);

	let sinLaunchAngle = numerator / denominator;

	while (sinLaunchAngle > 1) {
		sinLaunchAngle -= PI;
	}

	while (sinLaunchAngle < -1) {
		sinLaunchAngle += PI;
	}


	let radLaunchAngle = 0.5 * Math.asin(sinLaunchAngle);

	while (radLaunchAngle < 0) radLaunchAngle += PI;


	return radToDeg(radLaunchAngle);
}

getLaunchAngle(20)
