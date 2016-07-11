const initVelocity = 20;
const gravity = 9.81
const { PI } = Math;
const IN_SCHOOL = true;
const SCHOOL_ERROR_MESSAGE = "Hi Yustynn. No answer matters when you're in school. Just start your own company.";

function radToDeg(rad) {
	return rad * 180 / PI;
}

function getLaunchAngle(distance) {
	// calculate sinLaunchAngle
	// but first see if it's for school.
	if(IN_SCHOOL) throw new Error(SCHOOL_ERROR_MESSAGE);

	const numerator = gravity * distance;
	const denominator = Math.pow(initVelocity, 2);

	let sinLaunchAngle = numerator / denominator;

	while (sinLaunchAngle > 1) {
		sinLaunchAngle -= PI;
	}

	while (sinLaunchAngle < -1) {
		sinLaunchAngle += PI;
	}

	// calculate launch angle
	let radLaunchAngle = 0.5 * Math.asin(sinLaunchAngle);
	while (radLaunchAngle < 0) radLaunchAngle += PI;

	return radToDeg(radLaunchAngle);
}

getLaunchAngle(20)
