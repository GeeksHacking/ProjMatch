import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import UserCreation from "@/components/UserCreation/UserCreation";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { use, useCallback, useEffect, useState } from "react";

// Dev Imports
import { tagColors } from "@/tagColors";
import { useRouter } from "next/router";
let api = 0;

export default function Home() {
	const { user, error, isLoading } = useUser();
	const [posts, setPosts] = useState([]);
	const [postReq, setPostReq] = useState([]);
	//const [ users, setUsers ] = useState({});
	const [memusers, setMemUsers] = useState({});
	const [authToken, setAuthToken] = useState("");
	let usersid = [];
	const router = useRouter();

	useEffect(() => {
		try {
			setPosts(postReq.posts);

			postReq.posts.map((post) => {
				if (!usersid.includes(post.creatorUserID)) {
					usersid.push(post.creatorUserID);
					api.getUsers({ id: post.creatorUserID }).then(function (res) {
						if (res != -1) {
							let temp;
							temp = memusers;
							temp[post.creatorUserID] = res.users[0];
							setMemUsers({ ...temp });
						}
					});
				}
			});
		} catch (err) {
			console.error(err);
		}
	}, [setPosts, postReq]);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}
		axios.request(apiOptions).then(function (res) {
			const responseBody = res.data;
			localStorage.setItem("authorisation_token", responseBody["access_token"]);

			// Once Token has been retrieved, get data
			if (posts !== []) {
				console.log("first!");
				//getPosts(responseBody["access_token"])
				api = new PMApi(responseBody["access_token"]);
				api.getPosts().then(function (res) {
					setPostReq(res);
				});
				//.catch(console.error)
			}
			getPosts(authToken).catch(console.error);
		});
	}, [getPosts]);

	const storeAuthToken = async (accessToken) => {
		var apiOptions = {
			method: "POST",
			url: "https://projmatch.us.auth0.com/oauth/token",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
			data: new URLSearchParams({
				grant_type: "client_credentials",
				client_id: process.env.OAUTH_ID,
				client_secret: process.env.OAUTH_SECRET,
				audience: process.env.AUTH0_AUDIENCE,
			}),
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				const responseBody = res.data;
				localStorage.setItem(
					"authorisation_token",
					responseBody["access_token"]
				);

				// Once Token has been retrieved, get data
				if (posts !== []) {
					getPosts(responseBody["access_token"]).catch(console.error);
				}
			})
			.catch(function (err) {
				console.error("Failed to get API Authentication Token with: ", err);
			});
	};

	useEffect(() => {
		if (!router.isReady) return;
		const query = router.query;
		if (
			query != undefined &&
			localStorage.getItem("authorisation_token") !== undefined
		) {
			storeAuthToken(query.code);
		}
	}, [router.isReady, router.query]);

	return (
		<main className="relative flex h-full w-full flex-row">
			<UserCreation />
			<div className="fixed z-20 h-screen">
				<SideNav />
			</div>
			<div className="absolute flex h-full w-full flex-col items-center justify-start">
				{posts.length !== 0 ? (
					posts.map((post) => (
						<Project post={post} uss={memusers} key={post._id} />
					))
				) : (
					<></>
				)}
				{/* <h1>{posts.length !== 0 ? posts[0].projectName : ""}</h1> */}
			</div>
		</main>
	);
}

function Project({ post, uss }) {
	return (
		<div
			id="project-container"
			className="relative my-10 flex h-[70%] w-3/5 flex-col"
		>
			<div
				id="owner-profile"
				className="absolute bottom-[30.7%] z-10 flex h-[12%] w-fit items-center justify-start rounded-bl-2xl rounded-tr-2xl bg-logo-blue/[0.6]"
			>
				<a className={`ml-4 flex flex-row items-center space-x-2`}>
					<img
						src={
							uss[post.creatorUserID]
								? uss[post.creatorUserID].userDat.profilePic
								: ""
						}
						alt="logo"
						className="h-14 w-14 flex-shrink-0 rounded-full drop-shadow-custom"
					></img>
					<div className="flex flex-col items-start">
						<span className="ml-3 mr-6 translate-y-0.5 text-lg font-bold text-white">
							{uss[post.creatorUserID]
								? uss[post.creatorUserID].username
								: "Loading..."}{" "}
						</span>
					</div>
				</a>
			</div>
			<div
				id="gridscroll"
				className="relative h-[70%] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap rounded-l-3xl"
			>
				{post.images !== null && post.images.length !== 0 ? (
					post.images.map((img) => (
						<img
							src={img}
							className="mr-[15px] inline-block h-[99%] w-[90%] rounded-2xl object-cover"
							key={img}
						></img>
					))
				) : (
					<img
						src={"http://placekitten.com/g/600/800"}
						className="mr-[15px] inline-block h-[99%] w-[90%] rounded-2xl object-cover"
						key={post._id + 1}
					></img>
				)}
			</div>
			<div id="project-info" className="flex w-[90%] grow flex-col">
				<div className="flex grow flex-row">
					<h1 className="text-3xl font-bold text-black">{post.projectName}</h1>
					<div id="Menu" className="flex grow flex-row justify-end">
						<img
							src="/IconsMenuDots.svg"
							alt="logo"
							className="mt-2 h-6 w-6 flex-shrink-0"
						></img>
					</div>
				</div>
				<div className="flex grow flex-row">
					{(post.tags !== "" ? post.tags : [""]).map((tag) => (
						<Tag tag={tag} key={tag} />
					))}
					{(post.technologies !== "" ? post.technologies : [""]).map(
						(techbud) => (
							<Tag tag={techbud} key={techbud} />
						)
					)}
					<Stars rating={post.ratings} />
				</div>
				<Link
					className="flex grow items-center justify-center rounded-md border-2 border-[#D3D3D3] text-xl"
					href={"/Project/ProjectPage/?id=" + post._id}
				>
					<div>Find out more!</div>
				</Link>
			</div>
		</div>
	);
}

function Tag({ tag }) {
	return (
		<div
			className={`mx-2 flex h-8 w-fit min-w-[62px] flex-row items-center justify-center rounded-full bg-black`}
		>
			<span className="mx-4 text-lg font-bold text-white">{tag}</span>
		</div>
	);
}

function Stars({ rating }) {
	let stars = [0, 0, 0, 0, 0];
	for (let i = 0; i < rating; i++) {
		stars[i] = 1;
	}
	return (
		<div className="flex flex-row">
			{stars.map((value) => (
				<Star value={value} key={Math.random()} />
			))}
		</div>
	);
}

function Star({ value }) {
	if (value === 1) {
		return (
			<div className="flex flex-row items-center justify-center">
				<img
					src="/IconsStarFill.svg"
					alt="logo"
					className="h-6 w-6 flex-shrink-0"
				></img>
			</div>
		);
	}
	return (
		<div className="flex flex-row items-center justify-center">
			<img
				src="/IconsStar.svg"
				alt="logo"
				className="h-6 w-6 flex-shrink-0"
			></img>
		</div>
	);
}

// Helper Functions
function getUserData() {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
}

export const getServerSideProps = withPageAuthRequired();
