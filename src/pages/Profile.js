import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import PMApi from "@/components/PMApi/PMApi";

export default function ProfilePage(props) {
	return (
		<main className="h-full">
			{/* Banner Image */}
			<div className="h-[20%] w-screen bg-logo-blue">
				{props.user.bannerImg !== "" ? 
				<img
					src={props.user.bannerImg}
 					className="object-fill h-full w-full"
				></img> : <></>}
			</div>
			{/* Profile Picture */}
			<div className="absolute left-[10%] top-[10%] aspect-square flex flex-row h-[20%] w-[60%]">
				{props.user.profileImg !== "" && false ? 
				<img
					src={props.user.profileImg}
					className="rounded-full border-3 border-[#C7C7C7]"
				></img> : 
				<img
					src="/profileIconV2.svg"
					className="rounded-full border-3 border-[#C7C7C7]"
				></img>}
				<div className="ml-5 flex h-[90%] flex-col items-start justify-end">
					<h1 className="md:text-5xl text-4xl font-bold text-black">
						{props.user.username}
					</h1>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-[10%] pt-[8%] flex flex-row h-full w-full">
				<div className="flex flex-row w-full">
					<div className="flex flex-col gap-4">
						<div>
							<h2 className="font-bold md:text-4xl text-3xl mb-1">Experience</h2>
							<p>{props.user.experience == null ? "No Experience" : props.user.experience}</p>
						</div>
						<div>
							<h2 className="font-bold md:text-4xl text-3xl mb-1">About Me</h2>
							<p>{props.user.about == null ? "No Experience" : props.user.about}</p>
						</div>
					</div>
					<div className="ml-auto flex flex-col gap-4">
						<div>
							<h2 className="font-bold md:text-4xl text-3xl mb-1">Ratings</h2>
							<Stars rating={props.user.rating} />
						</div>
						<div>
							<h2 className="font-bold md:text-4xl text-3xl mb-1">Technologies</h2>
							<div className="flex flex-row">
								{Array(props.user.technologies).map((tag) => (
									<Tag tag={tag} key={Math.random()} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="projects-container" className="flex w-full flex-col">
				<h1 className="text-3xl font-bold text-black">Projects</h1>
				<div className="relative my-5 grid h-fit w-full grid-cols-3 gap-4">
					{props.userPosts.map((post) => (
						<Project post={post} key={post._id} />
					))}
				</div>
			</div>
		</main>
	)
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

		// Get user ID
		const id = req.url.match(/id=([a-zA-Z0-9]+)/)[1]

		// Initalise API Wrapper
		let api = new PMApi(authToken)
		let user = []
		let userPosts = [];
		userPosts = ""

		try {
			// const userResponse = await api.getUsers({ userID: id })
			// user = userResponse.users[0]
		} catch (err) {
			console.error(err)
		}

		return {
			props: {
				authToken,
				user,
				userPosts,
			}
		}
	},
});
