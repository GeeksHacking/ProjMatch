import SideNav from "@/components/SideNav/SideNav";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProjectPage() {
	const router = useRouter();
	const { id } = router.query;
	const [post, setPost] = useState([]);
	const [postReq, setPostReq] = useState([]);
	const [ouser, setUser] = useState([]);
	const { user, error, isLoading } = useUser();
	const [userContact, setUserContact] = useState("");
	const [pmUser, setPMUser] = useState({});
	const [showShareToolTip, setShowShareToolTip] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [showDoneReport, setShowDoneReport] = useState(false);

	const getUserFromEmail = useCallback(async (authToken, email) => {
		const API_URL = process.env.API_URL;
		var apiOptions = {
			method: "GET",
			url: `${API_URL}/users?email=${email}`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: new URLSearchParams({}),
		};

		let res = await axios.request(apiOptions).catch(function (err) {
			console.error("Failed to get User with: ", err);
		});
		if (res.status == 200) {
			return res.data.users[0];
		} else {
			throw `Status ${res.status}, ${res.statusText}`;
		}
	}, []);

	const getPosts = useCallback(
		async (authToken) => {
			const API_URL = process.env.API_URL;
			if (id === undefined) {
				return;
			}
			var axiosAPIOptions = {
				method: "GET",
				url: `${API_URL}/posts/?id=${id}`,
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
				data: new URLSearchParams({}),
			};

			axios
				.request(axiosAPIOptions)
				.then(function (res) {
					if (res.status == 200) {
						setPostReq(res);
					} else {
						throw `Status ${res.status}, ${res.statusText}`;
					}
				})
				.catch(function (err) {
					console.error("Failed to get Posts with: ", err);
				});
		},
		[id]
	);

	const getUserWithID = useCallback(async (uid) => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}
		const API_URL = process.env.API_URL;

		var apiOptions = {
			method: "GET",
			url: `${API_URL}/users/?id=${uid}`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: new URLSearchParams({}),
		};
		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
					setUser(res.data.users[0]);
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get Posts with: ", err);
			});
	});

	const checkUserExistWithEmail = useCallback(async (authToken, email) => {
		const API_URL = process.env.API_URL;

		var apiOptions = {
			method: "GET",
			url: `${API_URL}/users?email=${email}`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
					const responseData = res.data;
					if (responseData.users.length === 0) {
						// No user with email found, hence create user
						createUserWithEmail(authToken, user);
					}
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get User Existance with: ", err);
			});
	});

	const updateUser = useCallback(async (authToken, updateUser, user) => {
		const API_URL = process.env.API_URL;
		const options = {
			method: "PUT",
			url: `${API_URL}/users`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: {
				id: user._id,
				update: updateUser,
			},
		};

		axios
			.request(options)
			.then(function (res) {
				if (res.status == 200) {
					getUserFromEmail(authToken, user.regEmail).then((user) => {
						setPMUser(user);
					});
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get User with: ", err);
			});
	}, []);

	const createUserWithEmail = async (authToken, user) => {
		const API_URL = process.env.API_URL;

		var apiOptions = {
			method: "POST",
			url: `${API_URL}/users`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: {
				username: user.nickname,
				rlName: user.name,
				regEmail: user.email,
				regPhone: 0,
			},
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
					return res;
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get Create User with: ", err);
			});
	};

	useEffect(() => {
		// Check if the user exists. If not, create a new user for this user
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		if (user !== undefined) {
			checkUserExistWithEmail(authToken, user.email).then((res) => {});
		}
	}, [checkUserExistWithEmail]);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		getPosts(authToken).catch(console.error);
	}, [getPosts]);

	useEffect(() => {
		if (user === undefined) {
			return;
		}
		try {
			const authToken = localStorage.getItem("authorisation_token");

			if (authToken === undefined) {
				console.error("Authorisation Token returned Undefined.");
			}
			getUserFromEmail(authToken, user.email).then((res) => {
				setPMUser(res);
			});
			getUserWithID(postReq.data.posts[0].creatorUserID);
			setPost(postReq.data.posts[0]);
			if (post.contact !== undefined) {
				if (
					String(post.contact).match(
						/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
					)
				) {
					setUserContact("mailto:" + post.contact);
				} else if (String(post.contact).match(/^\d{10}$/)) {
					setUserContact("tel:" + post.contact);
				} else {
					setUserContact(post.contact);
				}
			}
		} catch (err) {}
	}, [postReq]);

	if (post.length === 0) {
		return <></>;
	}

	const deleteProject = async (authToken, id) => {
		const API_URL = process.env.API_URL;
		var apiOptions = {
			method: "DELETE",
			url: `${API_URL}/posts`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: {
				id: id,
			},
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get User Existance with: ", err);
			});
	};

	const handleDelete = () => {
		const authToken = localStorage.getItem("authorisation_token");
		deleteProject(authToken, id);
		router.push("http://localhost:3000/Main/Home");
	};

	const handleSavedClick = () => {
		const authToken = localStorage.getItem("authorisation_token");

		if (pmUser.savedPosts.includes(post._id)) {
			const savedPosts = pmUser.savedPosts.filter(
				(savedPost) => savedPost !== post._id
			);
			const updateData = {
				savedPosts: savedPosts,
			};
			updateUser(authToken, updateData, pmUser);
		} else {
			const savedPosts = [];
			if (pmUser.savedPosts !== undefined) {
				for (let i = 0; i < pmUser.savedPosts.length; i++) {
					savedPosts.push(pmUser.savedPosts[i]);
				}
			}
			savedPosts.push(post._id);
			const updateData = {
				savedPosts: savedPosts,
			};
			updateUser(authToken, updateData, pmUser);
		}
	};

	const handleToolTip = () => {
		setShowShareToolTip(true);
		navigator.clipboard.writeText(
			"http://localhost:3000/Project/ProjectPage?id=" + post._id
		);
	};

	const handlePopup = () => {
		setShowPopup(true);
	};

	const handleReport = (e) => {
		e.preventDefault();
		const authToken = localStorage.getItem("authorisation_token");
		const reportData = e.target.reportArea.value;
		const reporterName = pmUser.username;
		const reporterID = pmUser._id;
		const projectID = post._id;

		const emailData = {
			subject: `[ProjMatch] Report on Project '${post.projectName}'`,
			text: `Reporter Name: ${reporterName}\nReporter ID: ${reporterID}\nProject ID: ${projectID}\n\nReport: \n${reportData}`,
		};

		const API_URL = process.env.API_URL;
		var apiOptions = {
			method: "POST",
			url: `${API_URL}/email`,
			data: emailData,
		};

		axios.request(apiOptions).then(function (res) {
			if (res.status == 200) {
				setShowPopup(false);
				setShowDoneReport(true);
			} else {
				throw `Status ${res.status}, ${res.statusText}`;
			}
		});
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) return <div>Not logged in</div>;

	return (
		<main className="relative flex h-full w-full flex-row">
			<div className="fixed z-20 h-screen">
				<SideNav />
			</div>
			<div className="absolute flex h-full w-full flex-col items-center justify-start">
				<div
					id="project-details-container"
					className="relative my-10 flex h-[95%] w-2/3 flex-col"
				>
					<div
						id="gridscroll"
						className="relative h-[50%] w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap rounded-l-3xl"
					>
						{(post.images
							? post.images
							: [
									"https://placekitten.com/200/300",
									"https://placekitten.com/200/300",
							  ]
						).map((img) => (
							<img
								src={img}
								className="mr-[15px] inline-block h-[99%] w-[90%] rounded-2xl object-cover"
								key={Math.random()}
							></img>
						))}
					</div>
					<div
						id="title-menu-container"
						className="flex h-[7%] w-full flex-row"
					>
						<div
							id="title-container"
							className="flex h-full w-[40%] flex-row items-center justify-start"
						>
							<h1 className="text-3xl font-bold text-black">
								{post.projectName}
							</h1>
						</div>
						<div
							id="menu-container"
							className="flex h-full w-[60%] flex-row items-center justify-end space-x-3"
						>
							{pmUser._id === postReq.data.posts[0].creatorUserID ? (
								<div className="space-x-3">
									<button
										className="rounded-md bg-delete-red px-2 py-1 text-white"
										onClick={handleDelete}
									>
										Delete Project
									</button>
									<button
										className="rounded-md bg-edit-green px-2 py-1 text-white"
										onClick={() =>
											router.push(
												`http://localhost:3000/Project/EditProject?id=${post._id}`
											)
										}
									>
										Edit Project
									</button>
								</div>
							) : (
								<></>
							)}

							<img
								src="/IconsFlag.svg"
								alt="logo"
								className="mx-1 h-6 w-6 flex-shrink-0"
								onClick={handlePopup}
							></img>
							<Popup trigger={showPopup} setTrigger={setShowPopup}>
								<form
									className="flex w-[90%] flex-col items-center justify-center"
									onSubmit={handleReport}
								>
									<h1 className="text-2xl font-bold">Report this project</h1>
									<p className="text-lg text-[#636363]">
										Enter the reason for reporting this project
									</p>
									<textarea
										name="reportArea"
										placeholder="Enter the reason here"
										className="mt-5 h-32 w-full rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
									></textarea>
									<input
										type="submit"
										value="Submit"
										className="mt-5 rounded-md bg-logo-blue px-3 py-1 text-lg text-white"
									></input>
								</form>
							</Popup>
							<Popup trigger={showDoneReport} setTrigger={setShowDoneReport}>
								<h1 className="text-2xl text-logo-blue">
									Thank You For Reporting!
								</h1>
								<p className="text-lg text-black">
									We will be checking on this project soon.
								</p>
							</Popup>
							<div
								className="relative mx-1 h-6 w-6"
								onClick={handleToolTip}
								onMouseLeave={() => setShowShareToolTip(false)}
							>
								<img
									src="/IconsShare.svg"
									alt="logo"
									className="h-full w-full flex-shrink-0 hover:cursor-pointer"
								></img>
								<Tooltip trigger={showShareToolTip}></Tooltip>
							</div>

							<button
								className="mx-1 flex h-6 w-6 flex-shrink-0 items-center justify-center p-1"
								onClick={handleSavedClick}
							>
								{pmUser.savedPosts !== undefined ? (
									pmUser.savedPosts.includes(post._id) ? (
										<img
											src="/NavBarIcons/IconsSaved.svg"
											alt="logo"
											className="w-full w-full flex-shrink-0"
										></img>
									) : (
										<img
											src="/NavBarIcons/IconsSaved.svg"
											alt="logo"
											className="w-full w-full flex-shrink-0 invert"
										></img>
									)
								) : (
									<img
										src="/NavBarIcons/IconsSaved.svg"
										alt="logo"
										className="w-full w-full flex-shrink-0 invert"
									></img>
								)}
							</button>
						</div>
					</div>
					<div
						id="description-details-container"
						className="flex h-[40%] w-full flex-row"
					>
						<div
							id="description-container"
							className="flex h-full w-[80%] flex-col items-start justify-start p-5"
						>
							<h1 className="text-2xl font-bold text-black">Description</h1>
							<p className="text-lg font-normal text-black">
								{post.description}
							</p>
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
								<Stars rating={post.ratings} />
							</div>
							<div
								id="technologies-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<h2 className="text-xl font-bold text-black">Technologies</h2>
								<div className="flex flex-row">
									{post.tags.map((tag) => (
										<Tag tag={tag} key={tag.name} />
									))}
								</div>
							</div>
							<div
								id="communication-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<h2 className="text-xl font-bold text-black">Communication</h2>
								<div className="flex flex-row">
									{post.technologies.map((tag) => (
										<Tag tag={tag} key={tag.name} />
									))}
								</div>
							</div>
							<div
								id="owner-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<h2 className="text-xl font-bold text-black">
									Original Poster
								</h2>
								<a>{ouser.username}</a>
							</div>
							<div
								id="contact-container"
								className="flex h-1/5 w-full flex-col items-start justify-center"
							>
								<a
									href={userContact}
									target="_blank"
									className="h-[70%] w-full rounded-md bg-logo-blue px-4 py-2 text-2xl font-bold text-white"
								>
									Contact
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
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

function Tooltip(props) {
	return props.trigger ? (
		<div className="absolute left-[-90px] top-[-70px] flex h-[50px] w-[200px] flex-col items-center justify-center rounded-md bg-black">
			<p className="text-base font-bold text-white">Link Copied!</p>
		</div>
	) : (
		""
	);
}

function Popup(props) {
	return props.trigger ? (
		<div className="fixed left-0 top-0 z-[10] flex h-full w-full items-center justify-center bg-black bg-opacity-50">
			<div className="relative flex h-[500px] w-[500px] flex-col items-center justify-center rounded-md bg-white">
				{props.children}
				<button
					className="absolute right-4 top-4 rounded-md bg-logo-blue p-2 text-center text-sm text-white"
					onClick={() => props.setTrigger(false)}
				>
					Close
				</button>
			</div>
		</div>
	) : (
		""
	);
}
