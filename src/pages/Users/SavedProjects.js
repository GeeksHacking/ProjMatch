import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import { useCallback, useEffect, useState } from "react";
import Switch from "react-switch";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
let api = 0;

export default function SavedProjects() {
	const { user, error, isLoading } = useUser();
	const [projMatchUser, setProjMatchUser] = useState(null);
	const [posts, setPosts] = useState([]);

	const { user, error, isLoading } = useUser();
	const [projMatchUser, setProjMatchUser] = useState(null);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (!(authToken === undefined)) {
			api = new PMApi(authToken);
		}
	}, []);
	// const getUserWithEmail = useCallback(async (authToken, user) => {
	//     const API_URL = process.env.API_URL
	//     var apiOptions = {
	//         method: 'GET',
	//         url: `${API_URL}/users?email=${user.email}`,
	//         headers: {
	//             'Authorization': `Bearer ${authToken}`,
	//         },
	//         data: new URLSearchParams({ })
	//     }
	//     let res = await axios.request(apiOptions)
	//     .catch(function (err) {
	//         console.error("Failed to get User with: ", err)
	//     });
	//     if (res.status == 200) {
	//         setProjMatchUser(res.data.users[0])
	//     } else {
	//         throw `Status ${res.status}, ${res.statusText}`
	//     }
	// }, [])

	// const getPostsViaID = useCallback(async (authToken, id) => {
	//     const API_URL = process.env.API_URL
	//     var apiOptions = {
	//         method: 'GET',
	//         url: `${API_URL}/posts/?id=${id}`,
	//         headers: {
	//             'Authorization': `Bearer ${authToken}`,
	//         },
	//         data: new URLSearchParams({ })
	//     }

	//     axios.request(apiOptions).then(function (res) {
	//         if (res.status == 200) {
	//             let temp = posts
	//             temp.push(res.data.posts[0])
	//             setPosts(temp)
	//         } else {
	//             throw `Status ${res.status}, ${res.statusText}`
	//         }
	//     }).catch(function (err) {
	//         console.error("Failed to get Posts with: ", err)
	//     })
	// }, [])

	useEffect(() => {
		if (user === undefined) {
			return;
		}
		api.getUsers({ email: user.email }).then(function (res) {
			if (res != -1) {
				setProjMatchUser(res.users[0]);
			}
		});
	}, [user]);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (projMatchUser === null) {
			return;
		}
		for (let i = 0; i < projMatchUser.savedPosts.length; i++) {
			api.getPosts({ id: projMatchUser.savedPosts[i] }).then(function (res) {
				if (res != 0) {
					let temp = posts;
					temp.push(res.posts[0]);
				}
			});
			//getPostsViaID(authToken, projMatchUser.savedPosts[i])
		}
	}, [projMatchUser, posts]);

	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-center justify-start">
				<h1 className="text-6xl font-bold text-black">Saved</h1>
				<div className="relative my-14 grid h-fit w-full grid-cols-3 gap-6">
					{posts.map(
						(post) => (
							console.log(post), (<Project post={post} key={post._id} />)
						)
					)}
				</div>
			</div>
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
			className="relative z-10 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg"
			href={"/Project/ProjectPage/?id=" + post._id}
		>
			<div className="absolute bottom-0 z-10 flex h-1/4 w-full flex-col items-start justify-center rounded-b-lg bg-white/[0.5] px-4">
				<h3 className="text-xl font-semibold">{post.projectName}</h3>
				<p className="text-lg font-light">{tagString}</p>
				<div className="absolute right-10 z-20 flex aspect-square items-center justify-center rounded-lg bg-logo-lblue">
					<img src="/NavBarIcons/IconsSaved.svg" className="mx-3.5 w-5"></img>
				</div>
			</div>
			<img src={post.images[0]} className="z-0 h-fit w-fit rounded-lg"></img>
		</a>
	);
}
