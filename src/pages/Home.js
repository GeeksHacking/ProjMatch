import SideNav from "@/components/SideNav/SideNav";
import UserCreation from "@/components/UserCreation/UserCreation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import StarsContainer from "@/components/Rating/StarsContainer";
import PMApi from "@/components/PMApi/PMApi";
import { useEffect } from "react";

export default function Home({ posts, memusers, authToken }) {
	return (
		<main className="relative flex h-full w-full flex-row">
			<UserCreation />
			<div className="fixed z-20 h-screen">
				<SideNav />
			</div>
			<div className="absolute flex h-full w-full flex-col items-center justify-start">
				{posts.length !== 0 ? (
					posts.map((post) => (
						<Project post={post} uss={memusers} key={post._id} api={new PMApi(authToken)} />
					))
				) : (
					<></>
				)}
			</div>
		</main>
	);
}

function Project({ post, uss, api }) {
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
					{uss[post.creatorUserID] && uss[post.creatorUserID].profileImg ? (
						<img
							src={
								uss[post.creatorUserID]
									? uss[post.creatorUserID].userDat.profilePic
									: ""
							}
							alt="logo"
							className="h-14 w-14 flex-shrink-0 rounded-full drop-shadow-custom"
							loading="lazy"
						></img>
					) : (
						<img
							src={"/profileIconV2.svg"}
							alt="logo"
							className="h-14 w-14 flex-shrink-0 rounded-full "
							loading="lazy"
						></img>
					)}

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
				<div className="flex grow flex-row items-center">
					<h1 className="text-3xl font-bold text-black">{post.projectName}</h1>
					<div id="Menu" className="flex grow flex-row justify-end">
						<img
							src="IconsMenuDots.svg"
							alt="logo"
							className="mt-2 h-6 w-6 flex-shrink-0"
						></img>
					</div>
				</div>
				<div className="flex grow flex-row items-center">
					{(post.tags !== "" ? post.tags : [""]).map((tag) => (
						<Tag tag={tag} key={tag} />
					))}
					{(post.technologies !== "" ? post.technologies : [""]).map(
						(techbud) => (
							<Tag tag={techbud} key={techbud} />
						)
					)}
					<StarsContainer rating={post.rating} api={api} postId={post._id} />
				</div>
				<Link
					className="group relative m-3 flex grow items-center justify-center overflow-hidden rounded-full bg-logo-blue p-1 text-xl transition-all duration-150"
					href={"/Project?id=" + post._id}
				>
					<div className=" absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-light-blue opacity-40 group-active:left-full group-active:duration-500" />
					<div className="z-10 flex h-full w-full items-center justify-center rounded-full bg-white duration-150 group-hover:bg-logo-blue group-hover:text-white">
						Find out more!
					</div>
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

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps({ req, res }) {
		// Check for presense of Authorisation Token in Local Storage
		const authToken = req.headers.cookie
		?.split(';')
		.find((cookie) => cookie.trim().startsWith('authorisation_token='))
		?.split('=')[1] || '';		
		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		// Initalise API Wrapper
		let api = new PMApi(authToken)
		let posts = []
		let memusers = []

		try {
			// Get All Posts
			await api.getPosts().then(function (rawPosts) {
				posts = rawPosts.posts;
			});

			// Get Users which created posts
			let usersid = []
			posts.map((post) => {
				if (!usersid.includes(post.creatorUserID)) {
					usersid.push(post.creatorUserID);
				}
			})

			for (let i = 0; i < posts.length; i++) {
				await api.getUsers({ id: posts[i].creatorUserID }).then(function (res) {
					if (res != -1) {
						let temp;
						temp = memusers;
						temp[posts[i].creatorUserID] = res.users[0];
						memusers = { ...temp }
					}
				});
			}
		} catch (err) {
			console.error(err)
		}

		return {
			props: {
				posts,
				memusers,
				authToken
			}
		}
	},
});