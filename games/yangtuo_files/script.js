(function () {
	// Variable definitions
	const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
	const durations = {
		squish: 0.2,
		jump: 0.7,
		fall: 0.6,
		legDelay: 0.15,
		hillsBack: 15,
		hillsFront: 10
	};
	const dom = {
		body: document.querySelectorAll(".body"),
		ears: document.querySelectorAll(".ear"),
		earLeft: document.querySelectorAll(".ear--left"),
		earRight: document.querySelectorAll(".ear--right"),
		face: document.querySelectorAll(".face"),
		legs: document.querySelectorAll(".leg"),
		legBackLeft: document.querySelectorAll(".leg--left.leg--back"),
		legBackRight: document.querySelectorAll(".leg--right.leg--back"),
		legFrontLeft: document.querySelectorAll(".leg--left.leg--front"),
		legFrontRight: document.querySelectorAll(".leg--right.leg--front"),
		saddle: document.querySelectorAll(".saddle"),
		snout: document.querySelectorAll(".face__snout"),
		tassles: document.querySelectorAll(".tassle"),
		tasslesLeft: document.querySelectorAll(".tassle--1, .tassle--2"),
		tasslesRight: document.querySelectorAll(".tassle--4, .tassle--5"),
		tasslesMiddle: document.querySelectorAll(".tassle--3"),
	};

	// Here we go!
	if (isAnimationOk) {
		setAnimations();
	}


	function setAnimations() {
		// Element settings
		gsap.set(dom.earLeft, {transformOrigin: "100% 100%"});
		gsap.set(dom.earRight, {transformOrigin: "0% 100%"});
		gsap.set(dom.tasslesLeft, {transformOrigin: "100% 0%"});
		gsap.set([dom.legs, dom.tasslesMiddle], {transformOrigin: "50% 0%"});

		// The main timeline that will be repeated forever and ever
		const master = gsap.timeline({repeat: -1});

		// squishing the llama to show that it's using force to jump
		master.add(getSquishingTl());
		// and up it goes, with a bit of the air time at the top
		master.add(getJumpingTl());
		// and down a bit faster, becuse of the gravity
		master.add(getFallingTl());
		
		// The hills are moving in the bg independently
		setHillsAnimation();
	}

	function getSquishingTl() {
		const tl = gsap.timeline({defaults: {duration: durations.squish, ease: "power3.easeOut"}});

		// body moves down
		tl.to(dom.body, {y: 50});
		// face moves down and slightly to the right
		tl.to(dom.face, {y: 70, x: 10}, "<");
		// ears move down and rotate towards the sky
		tl.to(dom.ears, {y: 40}, "<");
		tl.to(dom.earLeft, {rotation: 10}, "<");
		tl.to(dom.earRight, {rotation: -10}, "<");
		// saddle moves down
		tl.to(dom.saddle, {y: 45},"<");
		// The tassles rotate outwards slightly
		tl.to(dom.tasslesLeft, {rotation: 10}, "<");
		tl.to(dom.tasslesRight, {rotation: -10}, "<");
		tl.to(dom.tasslesMiddle, {y: -10, rotation: -5}, "<");

		return tl;
	}

	function getJumpingTl() {
		const tl = gsap.timeline({defaults: {duration: durations.jump, ease: "power2.easeOut"}});

		// body moves up
		tl.to(dom.body, {y: -220});
		// face goes back to the normal position
		tl.to(dom.face, {y: -220, x: 0}, "<");
		// except for the snout which goes upwards a bit
		tl.to(dom.snout, {y: -25}, "<");
		// ears move up and heavily rotate towards the ground
		tl.to(dom.ears, {y: -220}, "<");
		tl.to(dom.earLeft, {rotation: -40}, "<");
		tl.to(dom.earRight, {rotation: 40}, "<");
		// the saddle moves a bit higher because it's not strapped to our llama
		tl.to(dom.saddle, {y: -270}, "<");
		// The tassles rotate inwards
		tl.to(dom.tasslesLeft, {rotation: -20}, "<");
		tl.to(dom.tasslesRight, {rotation: 20}, "<");
		tl.to(dom.tasslesMiddle, {y: 10, rotation: 5}, "<");
		// legs rotate right
		tl.to(dom.legFrontLeft, {y: -250, rotation: 20}, "<");
		tl.to(dom.legBackLeft, {duration: durations.jump - durations.legDelay, y: -200, rotation: 35}, "<");
		tl.to(dom.legFrontRight, {y: -230, rotation: 30}, "<");
		tl.to(dom.legBackRight, {duration: durations.jump - durations.legDelay, y: -230, rotation: 35}, "<");

		return tl;
	}

	function getFallingTl() {
		const tl = gsap.timeline({defaults: {duration: durations.fall, ease: "power2.easeIn"}});
		const durationThird = durations.fall / 3;

		// Some things go back to initial positions
		tl.to(dom.body, {y: 0});
		tl.to(dom.face, {y: 0}, "<");
		tl.to(dom.snout, {y: 0}, "<");
		tl.to(dom.ears, {y: 0, rotation: 0}, "<");
		tl.to(dom.saddle, {y: 0}, "<");
		// But some things are animated in 2 parts
		// The tassles rotate ouwards
		tl.to(dom.tasslesLeft, {duration: 2 * durationThird, rotation: 22}, "<");
		tl.to(dom.tasslesRight, {duration: 2 * durationThird, rotation: -22}, "<");
		tl.to(dom.tasslesMiddle, {duration: 2 * durationThird, y: -10, rotation: -5}, "<");
		// legs rotate right
		tl.to(dom.legFrontLeft, {duration: 2 * durationThird, y: -20, rotation: -30}, "<");
		tl.to(dom.legBackLeft, {duration: 2 * durationThird, y: -60, rotation: -20}, "<");
		tl.to(dom.legFrontRight, {duration: 2 * durationThird, y: -20, rotation: -60}, "<");
		tl.to(dom.legBackRight, {duration: 2 * durationThird, y: -80, rotation: -20}, "<");
		// And then everything moves to its original position
		tl.to(dom.tassles, {duration: durationThird, y: 0, rotation: 0}, ">");
		tl.to(dom.legs, {duration: durationThird, y: 0, rotation: 0}, "<");
		
		return tl;
	}

	function setHillsAnimation() {
		gsap.fromTo(".hill--1", {x: 3075}, {repeat: -1, duration: durations.hillsBack, ease: "linear", x: -2550});
		gsap.fromTo(".hill--2", {x: 3075}, {repeat: -1, duration: durations.hillsBack, ease: "linear", x: -2550}, "<").progress(0.5);
		gsap.fromTo(".hill--3", {x: 2750}, {repeat: -1, duration: durations.hillsFront, ease: "linear", x: -3350}, "<");
		gsap.fromTo(".hill--4", {x: 2750}, {repeat: -1, duration: durations.hillsFront, ease: "linear", x: -3350}, "<").progress(0.5);
	}
}());