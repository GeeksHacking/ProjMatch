import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import UserCreation from "@/components/UserCreation/UserCreation";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
let api = 0;
export default function ProfilePage() {
	const router = useRouter();
	const { id } = router.query;
	const [posts, setPosts] = useState([]);
	const { user, error, isLoading } = useUser();
	const [profileUser, setProfileUser] = useState(null);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (!(authToken === undefined)) {
			api = new PMApi(authToken);
		}
	}, []);
	useEffect(() => {
		if (id !== undefined) {
			api.getUsers({ id: id }).then(function (res) {
				setProfileUser(res.users[0]);
			});
		}
	}, [id]);

	useEffect(() => {
		if (profileUser !== null) {
			api.getPosts({ userID: profileUser._id }).then(function (res) {
				setPosts(res.posts);
			});
			if (
				String(profileUser.contactLink).match(
					/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
				)
			) {
				setProfileUser({
					...profileUser,
					contactLink: `mailto:${profileUser.contactLink}`,
				});
			} else if (String(profileUser.contact).match(/^\d{10}$/)) {
				setProfileUser({
					...profileUser,
					contactLink: `tel:${profileUser.contact}`,
				});
			}
		}
	}, [profileUser]);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) return <div>Not logged in</div>;
	if (profileUser === null) return <div>Loading...</div>;

	return (
		<div className="absolute flex h-full w-full flex-col">
			<UserCreation />
			<SideNav />
			{profileUser.bannerImg !== "" ? (
				<img
					src={profileUser.bannerImg}
					id="image-banner"
					className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue object-cover"
				></img>
			) : (
				<div className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue object-cover"></div>
			)}
			<div className="absolute left-[14%] top-[10%] z-[-1] flex h-[20%] w-[70%] flex-col">
				<div id="pfp-name" className="flex h-full w-full flex-row ">
					{profileUser.profileImg !== "" ? (
						<img
							src={profileUser.profileImg}
							className="rounded-full border-3 border-[#C7C7C7]"
						></img>
					) : (
						<img
							src="/profileIconV2.svg"
							className="rounded-full border-3 border-[#C7C7C7]"
						></img>
					)}
					{/* <img src="/NavBarIcons/IconsProfile.jpg" className="rounded-full border-3 border-[#C7C7C7]"></img> */}
					<div className="ml-5 flex h-[90%] flex-col items-start justify-end">
						<h1 className="text-4xl font-bold text-black">
							{profileUser.username}
						</h1>
						<h3 className="text-xl text-logo-blue">{profileUser.rlName}</h3>
					</div>
				</div>
			</div>
			<div className="absolute flex h-full w-full flex-col items-center justify-start">
				<div
					id="project-details-container"
					className="relative my-10 flex w-2/3 flex-col"
				>
					<div
						id="description-details-container"
						className="mt-[25%] flex h-[40vh] w-full flex-row"
					>
						<div
							id="description-container"
							className="flex h-full w-[80%] flex-col items-start justify-start p-5"
						>
							<div
								id="experience-container"
								className="flex h-[30%] w-full flex-col items-start justify-start"
							>
								<h1>Experience</h1>
								<p>
									{profileUser.experience == null
										? "No Experience"
										: profileUser.experience}
								</p>
							</div>
							<div
								id="About-container"
								className="flex h-[65%] w-full flex-col items-start justify-start"
							>
								<h1>About Me</h1>
								<p className="w-full overflow-y-auto overflow-x-hidden whitespace-normal break-words	">
									{profileUser.aboutMe == null
										? "No About"
										: profileUser.aboutMe}
								</p>
							</div>
						</div>
						<div
							id="details-container"
							className=" flex h-full w-[20%] flex-col items-start justify-start"
						>
							<div
								id="rating-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<h2 className="text-xl font-bold text-black">Ratings</h2>
								<Stars rating={3} />
							</div>
							<div
								id="technologies-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<h2 className="text-xl font-bold text-black">Technologies</h2>
								<div className="flex flex-row">
									{["Swift", "Python"].map((tag) => (
										<Tag tag={tag} key={Math.random()} />
									))}
								</div>
							</div>
							<div
								id="contact-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<a
									href={profileUser.contactLink}
									className="h-[70%] w-full rounded-md bg-logo-blue px-4 py-2 text-2xl font-bold text-white"
								>
									Contact
								</a>
							</div>
						</div>
					</div>
					<div id="projects-container" className="flex w-full flex-col">
						<h1 className="text-3xl font-bold text-black">Projects</h1>
						<div className="relative my-5 grid h-fit w-full grid-cols-3 gap-4">
							{posts.map((post) => (
								<Project post={post} key={post._id} />
							))}
						</div>
					</div>
				</div>
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
					src="/IconsStarFilled.svg"
					alt="logo"
					className="mx-1 h-6 w-6 flex-shrink-0"
				></img>
			</div>
		);
	}
	return (
		<div className="flex flex-row items-center justify-center">
			<img
				src="/IconsStar.svg"
				alt="logo"
				className="mx-1 h-6 w-6 flex-shrink-0"
			></img>
		</div>
	);
}

export function Project({ post }) {
	let tagString = "";
	if (post.tags.length !== 0) {
		tagString += post.tags[0];
		if (post.tags.length > 1) {
			for (let i = 1; i < (post.tags.length > 3 ? 3 : post.tags.length); i++) {
				tagString += ", " + post.tags[i];
			}
		}
	}
	return (
		<a
			className="relative z-10 flex aspect-[4/2] w-full flex-col items-center justify-center rounded-lg"
			href={"/Project?id=" + post._id}
		>
			<div className="absolute bottom-0 z-10 flex h-1/4 w-full flex-col items-start justify-center rounded-b-lg bg-white/[0.5] px-4">
				<h3 className="text-xl font-semibold">{post.projectName}</h3>
				<p className="text-lg font-light">{tagString}</p>
				{/* <div className="z-20 absolute bg-logo-lblue aspect-square rounded-lg flex justify-center items-center right-10">
                    <img src="/NavBarIcons/IconsSaved.svg" className="w-5 mx-3.5"></img>
                </div> */}
			</div>
			<img src={post.images[0]} className="z-0 h-fit w-fit rounded-lg"></img>
		</a>
	);
}
