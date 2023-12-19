import anime from "animejs";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
let color="#FEAE00"
const Landing = () => {
	useEffect(() => {
		
		
		
		const pythonTimeline = anime.timeline({
			easing: "easeOutExpo",
			loop: false,
		});

		pythonTimeline.add(
			{
				targets: "#word",
				opacity: [0, 1],
				translateY: [40, 0],
				translateX: ["-50%", "-50%"],
				rotateX: [-90, 0],
				color: ["#FFFFFF", color],
				duration: 1300,
			},
			1000
		);
		pythonTimeline.add(
			{
				targets: "#blank",
				color: ["#FFFFFF", color],
				duration: 1300,
			},
			1000
		);
		pythonTimeline.add(
			{
				targets: "#word",
				opacity: [1, 0],
				translateY: [0, -40],
				translateX: ["-50%", "-50%"],
				rotateX: [0, -90],
				color: [color, "#FFFFFF"],
				duration: 1300,
			},
			3000
		);
		pythonTimeline.add(
			{
				targets: "#blank",
				color: [color, "#FFFFFF"],
				duration: 1300,
			},
			3000
		);

		const ReactTimeline = anime.timeline({
			easing: "easeOutExpo",
			loop: false,
		});

		let animationInterval = setInterval(() => {
			let langs=["Python","Javascript","React", "C++"]
			let colors=["#FEAE00", "#00ff2b","#0d00ff","#ff0037"]
			let No=Math.floor(Math.random()*langs.length)
			document.getElementById("word").innerHTML = langs[No];
			color=colors[No]
			
			pythonTimeline.play();
		}, 5 * 1000);

		return () => {
			clearInterval(animationInterval);
		};
	}, []);

	return (
		<div className="relative h-full w-full bg-black">
			<div className="absolute w-full">
				<LandingHeaderBar />
			</div>
			<div className="App">
				<p className="header">
					Get Your Next
					<br />
					<span id="blank">___________ Project</span>
					<span className="word" id="word">Python</span>
				</p>
			</div>
		</div>
	);
};

const LandingHeaderBar = () => {
	const router = useRouter();

	return (
		<div className="relative flex w-full flex-row p-2">
			<Link href="" className="duration-500 hover:scale-105">
				<span className="text-2xl font-bold text-logo-blue">ProjMatch</span>
			</Link>
			<div className="ml-auto space-x-3">
				<Link
					href={`https://projmatch.us.auth0.com/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=${process.env.AUTH0_BASE_URL}/Load&audience=${process.env.AUTH0_AUDIENCE}`}
					className=""
				>
					<button className="rounded-full bg-blue px-4 pb-2 pt-1 text-center font-bold text-white duration-500 hover:scale-105">
						Log In
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Landing;
