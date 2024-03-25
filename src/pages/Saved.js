import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function SavedProjects({ projMatchUser, userSavedPosts }) {
	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-center justify-start">
				<h1 className="text-6xl font-bold text-black">Saved</h1>
				{userSavedPosts.length > 0 ? 
					<div className="relative my-14 grid h-fit w-full grid-cols-3 gap-6">
						{userSavedPosts.map(
							(post) => (
								<Project projMatchUser={projMatchUser} post={post} key={post._id} />
							)
						)}
					</div> 
					
					: 
					
					<div className="relative my-14">
						<h2 className="text-2xl font-medium text-black">You have no saved posts!</h2>
					</div>}
			</div>
		</div>
	);
}

export function Project({ projMatchUser, post }) {
	let tagString = "";
	if (post.tags.length !== 0) {
		tagString += post.tags[0];
		if (post.tags.length > 1) {
			for (let i = 1; i < (post.tags.length > 3 ? 3 : post.tags.length); i++) {
				tagString += ", " + post.tags[i];
			}
		}
	}

	const handleSavedClick = (e) => {
		e.preventDefault()

		const authToken = sessionStorage.token
		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		api = new PMApi(authToken)

		let updateData = {
			savedPosts: projMatchUser.savedPosts
		}
		updateData.savedPosts.splice(updateData.savedPosts.indexOf(post._id), 1)
		
		// Update the user information in the api
		api.updateUser(projMatchUser._id, updateData).then(function (res) {
			("Updated user's saved posts")
		})
	}

	return (
		<a
			className="relative z-10 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg"
			href={"/Project?id=" + post._id}
		>
			<div className="absolute bottom-0 z-10 flex h-1/4 w-full flex-col items-start justify-center rounded-b-lg bg-white/[0.5] px-4">
				<h3 className="text-xl font-semibold">{post.projectName}</h3>
				<p className="text-lg font-light">{tagString}</p>
				<div className="absolute right-10 z-20 flex aspect-square items-center justify-center rounded-lg bg-logo-lblue" onClick={handleSavedClick}>
					<img src="/NavBarIcons/IconsSaved.svg" className="mx-3.5 w-5"></img>
				</div>
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

		// Initalise API Wrapper
		let api = new PMApi(authToken)

		// Get the User Information
		const auth0User = await getSession(req, res)

		let projMatchUser = []
		let userSavedPosts = []
		await api.getUsers({ email: auth0User.user.email}).then(function (res) {
			if (res != 1) {
				projMatchUser = res.users[0]
			}
		})

		for (let i = 0; i < projMatchUser.savedPosts.length; i++) {
			await api.getPosts({ id: projMatchUser.savedPosts[i] }).then(function (res) {
				if (res != 0) {
					userSavedPosts.push(res.posts[0]);
				}
			});
		}

		return {
			props: {
				projMatchUser,
				userSavedPosts
			}
		}
	}
})