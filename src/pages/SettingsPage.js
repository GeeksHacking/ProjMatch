import SideNav from "@/components/SideNav/SideNav";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Switch, Dialog, Tab } from "@headlessui/react";

export default function SettingsPage() {
	const { user, error, isLoading } = useUser();
	const [projMatchUser, setProjMatchUser] = useState({});
	const router = useRouter();
	const [currentTab, setCurrentTab] = useState("1");
	const [darkMode, setDarkMode] = useState(false);
	const [personalization, setPersonalization] = useState(false);
	const [popupDisplay, setPopupDisplay] = useState(false);
	const [userData, setUserData] = useState({});

	const getUserWithEmail = useCallback(async (authToken, user) => {
		const API_URL = process.env.API_URL;
		var apiOptions = {
			method: "GET",
			url: `${API_URL}/users?email=${user.email}`,
			headers: {
				"Authorization": `Bearer ${authToken}`,
			},
			data: new URLSearchParams({}),
		};
		let res = await axios.request(apiOptions).catch(function (err) {
			console.error("Failed to get User with: ", err);
		});
		if (res.status == 200) {
			setProjMatchUser(res.data.users[0]);
		} else {
			throw `Status ${res.status}, ${res.statusText}`;
		}
	}, []);

	const createS3Images = useCallback((authToken, data, user) => {
		const API_URL = process.env.API_URL;

		if (user !== undefined) {
			var formData = new FormData();
			formData.append("files", data.profileBanner);
			formData.append("files", data.profilePic);
			formData.append("creatorUserID", user._id);

			let axiosAPIOptions = {
				method: "POST",
				url: `${API_URL}/images`,
				headers: {
					"Authorization": `Bearer ${authToken}`,
					"Content-Type": "multipart/form-data",
				},
				data: formData,
			};

			axios
				.request(axiosAPIOptions)
				.then(function (res) {
					if (res.status == 200) {
						const imageURL = res.data.imageURL;
						const bannerURL = imageURL[0];
						const profilePicURL = imageURL[1];

						const tempData = {
							...data,
							userDat: {
								profileBanner: bannerURL,
								profilePic: profilePicURL,
							},
						};
						updateUser(authToken, tempData, user);
						return imageURL;
					} else {
						throw `Status ${res.status}, ${res.statusText}`;
					}
				})
				.catch(function (err) {
					console.error("Failed to get Posts with: ", err);
				});
		}
	}, []);

    const updateUser = useCallback(async (authToken, updateUser, user) => {
        const API_URL = process.env.API_URL
        const options = {
            method: 'PUT',
            url: `${API_URL}/users`,
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
            data: {
                "id": user._id,
                "update": updateUser
            }
        }
        axios.request(options).then(function (res) {
            if (res.status == 200) {
                router.push(`ProfilePage?id=${user._id}`)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User with: ", err)
        })
    }, [])

    const handleTabClick = (e) => {
        setCurrentTab(e.target.id);
    }
    const handleSignOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('authorisation_token');
        router.push('api/auth/logout');
    }
    const handleSubmit = (e) => {
        e.preventDefault();

		var updatedData = Object.keys(userData).reduce(function (filtered, key) {
			if (key === "userDat") {
				var fileredUserDat = Object.keys(userData.userDat).reduce(function (
					filtered,
					key
				) {
					if (userData.userDat[key] !== projMatchUser.userDat[key]) {
						filtered[key] = userData.userDat[key];
					}
					return filtered;
				},
				{});
				if (Object.keys(fileredUserDat).length !== 0) {
					filtered.userDat = fileredUserDat;
				}
			} else if (userData[key] !== projMatchUser[key]) {
				filtered[key] = userData[key];
			}
			return filtered;
		}, {});

		const authToken = localStorage.getItem("authorisation_token");
		if (Object.keys(updatedData).length === 0) {
			return;
		}
		if (authToken === undefined) {
			return;
		}
		if (updatedData.userDat !== undefined) {
			createS3Images(authToken, updatedData, projMatchUser);
		} else {
			updateUser(authToken, updatedData, projMatchUser);
		}
	};

	const handleImageButton = (e) => {
		e.preventDefault();
		if (e.target.id == "profilePic") {
			document.getElementById("profilePicInput").click();
		} else if (e.target.id == "profileBanner") {
			document.getElementById("profileBannerInput").click();
		}
	};

	const handleEmail = (e) => {
		e.preventDefault();

		const name = e.target.emailName.value;
		const email = e.target.emailEmail.value;
		const message = e.target.emailBody.value;

		const emailData = {
			subject: `[ProjMatch] Feedback from ${name}`,
			text: `From: ${email}\n\n${message}`,
		};

		const API_URL = process.env.API_URL;
		const options = {
			method: "POST",
			url: `${API_URL}/email`,
			data: emailData,
		};
		axios
			.request(options)
			.then(function (res) {
				if (res.status == 200) {
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get User with: ", err);
			});

		setPopupDisplay(true);

		e.target.emailName.value = "";
		e.target.emailEmail.value = "";
		e.target.emailBody.value = "";
	};

	const handleValueChange = (data, value) => {
		setUserData({
			...userData,
			[data]: value,
		});
	};

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("No token found");
		}
		if (user !== null && user !== undefined) {
			getUserWithEmail(authToken, user);
		}
	}, [user]);

	useEffect(() => {
		if (projMatchUser !== undefined) {
			setUserData({
				...projMatchUser,
			});
		}
	}, [projMatchUser]);

	useEffect(() => {
		console.log(userData);
	}, [userData]);

	const tabs = [
		{
			id: "1",
			tabTitle: "My Profile",
			content: (
				<form
					className="flex w-full flex-col items-start justify-start"
					onSubmit={handleSubmit}
				>
					<h1 className="text-2xl font-bold ">Username</h1>
					<p className="text-lg text-[#636363]">
						You can only change your username every 7 days
					</p>
					<input
						type="text"
						name="username"
						defaultValue={
							Object.keys(userData).length !== 0 ? userData.username : ""
						}
						onChange={(e) => handleValueChange(e.target.name, e.target.value)}
						placeholder="New Username"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h1 className="mt-6 text-2xl font-bold">Name</h1>
					<input
						type="text"
						name="rlName"
						defaultValue={
							Object.keys(userData).length !== 0 ? userData.rlName : ""
						}
						onChange={(e) => handleValueChange(e.target.name, e.target.value)}
						placeholder="New Name"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h1 className="mt-6 text-2xl font-bold">Email</h1>
					<p className="text-lg text-[#636363]">
						<i>This input will not update your email yet</i>
					</p>
					<div className="flex h-fit w-[70%] flex-row justify-between">
						<input
							type="text"
							name="regEmail"
							defaultValue={
								Object.keys(userData).length !== 0 ? userData.regEmail : ""
							}
							onChange={(e) => handleValueChange(e.target.name, e.target.value)}
							placeholder="New Email"
							className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
						/>
					</div>

					<h1 className="mt-6 text-2xl font-bold">Contact Link</h1>
					<input
						type="text"
						name="contactLink"
						defaultValue={
							Object.keys(userData).length !== 0 ? userData.contactLink : ""
						}
						onChange={(e) => handleValueChange(e.target.name, e.target.value)}
						placeholder="Add Contact Link"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h1 className="mt-6 text-2xl font-bold">About Me</h1>
					<p className="text-lg text-[#636363]">
						Provide a short description about you and what you do
					</p>
					<textarea
						name="aboutMe"
						defaultValue={
							Object.keys(userData).length !== 0 ? userData.aboutMe : ""
						}
						onChange={(e) => handleValueChange(e.target.name, e.target.value)}
						placeholder="Write something about yourself..."
						className="h-32 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2 py-1  "
					/>

					<h1 className="mt-6 text-2xl font-bold">Profile Picture</h1>
					<div className="flex h-36 w-[70%] flex-row items-center justify-start">
						{Object.keys(userData).length !== 0 &&
						userData.userDat.profilePic !== "" ? (
							<img
								src={
									typeof userData.userDat.profilePic == "object"
										? URL.createObjectURL(userData.userDat.profilePic)
										: userData.userDat.profilePic
								}
								className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] object-cover object-center"
							/>
						) : (
							<div className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
						)}
						<button
							id="profilePic"
							className="mt-1 ml-4 h-11 w-32 rounded-md bg-logo-blue text-xl text-white"
							onClick={handleImageButton}
						>
							Add images
						</button>
						<input
							type="file"
							id="profilePicInput"
							name="profilePic"
							className="hidden"
							onChange={(e) =>
								handleValueChange("userDat", {
									...userData.userDat,
									profilePic: e.target.files[0],
								})
							}
						/>
					</div>
					<h1 className="mt-6 text-2xl font-bold">Profile Banner</h1>
					<div className="flex h-fit w-[70%] flex-col items-start justify-center">
						{Object.keys(userData).length !== 0 &&
						userData.userDat.profileBanner !== "" ? (
							<img
								src={
									typeof userData.userDat.profileBanner == "object"
										? URL.createObjectURL(userData.userDat.profileBanner)
										: userData.userDat.profileBanner
								}
								className="mt-2 h-36 w-full border-3 border-[#C7C7C7] object-cover object-center"
							/>
						) : (
							<div className="mt-2 h-36 w-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
						)}
						<button
							id="profileBanner"
							className="mt-1 h-11 w-full rounded-md bg-logo-blue text-xl text-white"
							onClick={handleImageButton}
						>
							Add images
						</button>
						<input
							type="file"
							id="profileBannerInput"
							name="profileBanner"
							className="hidden"
							onChange={(e) =>
								handleValueChange("userDat", {
									...userData.userDat,
									profileBanner: e.target.files[0],
								})
							}
						/>
					</div>

					<input
						type="submit"
						value="Update!"
						className="mt-10 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
					></input>
				</form>
			),
		},
		{
			id: "2",
			tabTitle: "Web Settings",
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<h1 className="text-2xl font-bold ">Theme</h1>
					<p className="text-lg text-[#636363]">
						Choose from Light and Dark Mode
					</p>
					{Object.keys(userData).length !== 0 ? (
						<Switch
							checked={
								userData.settings.web_settings.theme === "dark" ? true : false
							}
							onChange={() => {
								handleValueChange("settings", {
									...userData.settings,
									web_settings: {
										theme:
											userData.settings.web_settings.theme === "dark"
												? "light"
												: "dark",
									},
								});
							}}
							className={`${
								userData.settings.web_settings.theme === "dark"
									? `bg-gray-400`
									: `bg-gray-400`
							} relative inline-flex h-8 w-16 items-center rounded-full transition`}
						>
							<span
								className={`${
									userData.settings.web_settings.theme === "dark"
										? "translate-x-9 bg-black"
										: "translate-x-1 bg-white"
								} inline-block flex h-6 w-6 transform items-center justify-center rounded-full transition`}
							>
								<img
									className="h-1/2"
									src={
										userData.settings.web_settings.theme === "dark"
											? "/IconsMoon.svg"
											: "/IconsSun.svg"
									}
								/>
							</span>
						</Switch>
					) : (
						<></>
					)}
					<button
						className="mt-4 h-11 w-32 rounded-md bg-logo-blue text-xl text-white"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			),
		},
		{
			id: "3",
			tabTitle: "Privacy",
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<h1 className="text-2xl font-bold ">Personalization</h1>
					<p className="text-lg text-[#636363]">
						Gives us permission to collect your data to serve you better
					</p>
					{Object.keys(userData).length !== 0 ? (
						<Switch
							checked={userData.settings.privacy.personalization}
							onChange={() => {
								handleValueChange("settings", {
									...userData.settings,
									privacy: {
										...userData.settings.privacy,
										personalization: !userData.settings.privacy.personalization,
									},
								});
							}}
							className={`${
								userData.settings.privacy.personalization
									? `bg-edit-green`
									: `bg-delete-red`
							} relative inline-flex h-8 w-16 items-center rounded-full transition`}
						>
							<span
								className={`${
									userData.settings.privacy.personalization
										? "translate-x-9"
										: "translate-x-1"
								}
                            inline-block h-6 w-6 transform rounded-full bg-white transition`}
							></span>
						</Switch>
					) : (
						<></>
					)}

					<input
						type="submit"
						value="Update!"
						className="mt-10 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
						onClick={handleSubmit}
					></input>
				</div>
			),
		},
		{
			id: "4",
			tabTitle: "Security",
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<h1 className="text-2xl font-bold ">Change Password</h1>
					<p className="text-lg text-[#636363]">
						Your password cannot be the same as the last one
					</p>
					<input
						type="text"
						name="projectName"
						placeholder="Current Password"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>
					<input
						type="text"
						name="projectName"
						placeholder="New Password"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>
					<input
						type="text"
						name="projectName"
						placeholder="Confirm New Password"
						className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>
					<input
						type="submit"
						value="Update!"
						className="mt-1 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
					></input>

					<input
						type="submit"
						value="Delete Account"
						className="mt-30 h-11 w-[30%] rounded-full bg-[#ED5A5A] text-xl text-white"
					></input>
					<input
						type="submit"
						value="Sign Out On All Devices"
						className="mt-2 mb-10 h-11 w-[30%] rounded-full bg-[#ED5A5A] text-xl text-white"
					></input>
				</div>
			),
		},
		{
			id: "5",
			tabTitle: "Support",
			content: (
				<div className="flex w-full flex-col items-start justify-start">
					<p className="text-xl text-[#636363]">
						Any questions? Feature request or problems?
						<br></br>
						Fill in this feedback form here and we will get back to you as soon
						as possible!
					</p>
					<form className="mt-10 w-[60%]" onSubmit={handleEmail}>
						<p className="text-lg font-medium text-black">Your Name</p>
						<input
							type="text"
							name="emailName"
							placeholder="Enter your name here"
							className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
						/>

						<p className="mt-5 text-lg font-medium text-black">Your Email</p>
						<p className="text-base font-light text-[#636363]">
							<i>
								This is so that we can contact you in the future for further
								information
							</i>
						</p>
						<input
							type="text"
							name="emailEmail"
							placeholder="Enter your email here"
							className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
						/>

						<p className="mt-5 text-lg font-medium text-black">The content</p>
						<p className="text-base font-light text-[#636363]">
							<i>
								Try to keep it short and simple. We will follow up with you if
								needed
							</i>
						</p>
						<textarea
							name="emailBody"
							placeholder="Write the issues/feedbacks/bugs you had here..."
							className="mt-1 h-32 w-full rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
						/>

						<input
							type="submit"
							value="Send Email"
							className="mt-5 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
						></input>
					</form>
					<Dialog
						open={popupDisplay}
						onClose={() => setPopupDisplay(false)}
						className="fixed top-0 left-0 z-[2000] flex h-full w-full flex-col items-center justify-center bg-[#000000] bg-opacity-25"
					>
						<Dialog.Panel className="flex h-fit w-[50%] flex-col bg-white p-8">
							<Dialog.Title className="mb-0 text-xl font-bold">
								Your Feedback Has Been Sent!
							</Dialog.Title>
							<Dialog.Description className="mb-6 text-base text-gray-400">
								<i>Thank you for sending your feedback</i>
							</Dialog.Description>
							<p className="mb-3">
								Your feedback is much appreciated and we will get back to you as
								soon as possible!
							</p>
							<button
								onClick={() => setPopupDisplay(false)}
								className="h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
							>
								Close
							</button>
						</Dialog.Panel>
					</Dialog>
				</div>
			),
		},
	];

	return (
		<div className="absolute flex h-full w-full flex-col">
			<SideNav />
			{Object.keys(projMatchUser).length !== 0 &&
			projMatchUser.userDat.profileBanner !== "" ? (
				<img
					src={projMatchUser.userDat.profileBanner}
					id="image-banner"
					className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue object-cover"
				></img>
			) : (
				<div className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue object-cover"></div>
			)}
			<button
				onClick={handleSignOut}
				className="absolute right-[3%] top-[23%] h-fit w-fit rounded-md bg-[#ED5A5A] px-6 py-3 text-lg font-bold text-white"
			>
				Sign Out
			</button>
			<div className="absolute left-[14%] top-[10%] z-[-1] flex h-[20%] w-[70%] flex-col">
				<div id="pfp-name" className="flex h-full w-full flex-row ">
					{Object.keys(projMatchUser).length !== 0 &&
					projMatchUser.userDat.profilePic !== "" ? (
						<img
							src={projMatchUser.userDat.profilePic}
							className="rounded-full border-3 border-[#C7C7C7]"
						></img>
					) : (
						<div className="rounded-full border-3 border-[#C7C7C7]"></div>
					)}
					<div className="ml-5 flex h-[90%] flex-col items-start justify-end">
						<h1 className="text-4xl font-bold text-black">Settings</h1>
						<h3 className="text-xl text-logo-blue">{projMatchUser.username}</h3>
					</div>
				</div>
			</div>
			<div className="absolute top-[33%] z-[10] flex h-fit w-screen flex-col items-center">
				<div
					id="bar"
					className="absolute top-[3rem] h-0.5 w-full -translate-y-0.5 bg-[#D2D2D2]"
				></div>
				<div id="main-body" className="relative flex h-fit w-[72%] flex-col">

						<Tab.Group>
							<Tab.List className="flex h-[3rem] w-full flex-row items-center justify-start">
								<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">My Profile</Tab>
								<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">Web Settings</Tab>
								<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">Privacy</Tab>
								<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">Security</Tab>
								<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">Support</Tab>
							</Tab.List>
							<Tab.Panels className="relative mt-4 h-[95%] w-full">
								<Tab.Panel>
									<form
										className="flex w-full flex-col items-start justify-start"
										onSubmit={handleSubmit}
									>
										<h1 className="text-2xl font-bold ">Username</h1>
										<p className="text-lg text-[#636363]">
											You can only change your username every 7 days
										</p>
										<input
											type="text"
											name="username"
											defaultValue={
												Object.keys(userData).length !== 0
													? userData.username
													: ""
											}
											onChange={(e) =>
												handleValueChange(e.target.name, e.target.value)
											}
											placeholder="New Username"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>

										<h1 className="mt-6 text-2xl font-bold">Name</h1>
										<input
											type="text"
											name="rlName"
											defaultValue={
												Object.keys(userData).length !== 0
													? userData.rlName
													: ""
											}
											onChange={(e) =>
												handleValueChange(e.target.name, e.target.value)
											}
											placeholder="New Name"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>

										<h1 className="mt-6 text-2xl font-bold">Email</h1>
										<p className="text-lg text-[#636363]">
											<i>This input will not update your email yet</i>
										</p>
										<div className="flex h-fit w-[70%] flex-row justify-between">
											<input
												type="text"
												name="regEmail"
												defaultValue={
													Object.keys(userData).length !== 0
														? userData.regEmail
														: ""
												}
												onChange={(e) =>
													handleValueChange(e.target.name, e.target.value)
												}
												placeholder="New Email"
												className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
											/>
										</div>

										<h1 className="mt-6 text-2xl font-bold">Contact Link</h1>
										<input
											type="text"
											name="contactLink"
											defaultValue={
												Object.keys(userData).length !== 0
													? userData.contactLink
													: ""
											}
											onChange={(e) =>
												handleValueChange(e.target.name, e.target.value)
											}
											placeholder="Add Contact Link"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>

										<h1 className="mt-6 text-2xl font-bold">About Me</h1>
										<p className="text-lg text-[#636363]">
											Provide a short description about you and what you do
										</p>
										<textarea
											name="aboutMe"
											defaultValue={
												Object.keys(userData).length !== 0
													? userData.aboutMe
													: ""
											}
											onChange={(e) =>
												handleValueChange(e.target.name, e.target.value)
											}
											placeholder="Write something about yourself..."
											className="h-32 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2 py-1  "
										/>

										<h1 className="mt-6 text-2xl font-bold">Profile Picture</h1>
										<div className="flex h-36 w-[70%] flex-row items-center justify-start">
											{Object.keys(userData).length !== 0 &&
											userData.userDat.profilePic !== "" ? (
												<img
													src={
														typeof userData.userDat.profilePic == "object"
															? URL.createObjectURL(userData.userDat.profilePic)
															: userData.userDat.profilePic
													}
													className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] object-cover object-center"
												/>
											) : (
												<div className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
											)}
											<button
												id="profilePic"
												className="mt-1 ml-4 h-11 w-32 rounded-md bg-logo-blue text-xl text-white"
												onClick={handleImageButton}
											>
												Add images
											</button>
											<input
												type="file"
												id="profilePicInput"
												name="profilePic"
												className="hidden"
												onChange={(e) =>
													handleValueChange("userDat", {
														...userData.userDat,
														profilePic: e.target.files[0],
													})
												}
											/>
										</div>
										<h1 className="mt-6 text-2xl font-bold">Profile Banner</h1>
										<div className="flex h-fit w-[70%] flex-col items-start justify-center">
											{Object.keys(userData).length !== 0 &&
											userData.userDat.profileBanner !== "" ? (
												<img
													src={
														typeof userData.userDat.profileBanner == "object"
															? URL.createObjectURL(
																	userData.userDat.profileBanner
															  )
															: userData.userDat.profileBanner
													}
													className="mt-2 h-36 w-full border-3 border-[#C7C7C7] object-cover object-center"
												/>
											) : (
												<div className="mt-2 h-36 w-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
											)}
											<button
												id="profileBanner"
												className="mt-1 h-11 w-full rounded-md bg-logo-blue text-xl text-white"
												onClick={handleImageButton}
											>
												Add images
											</button>
											<input
												type="file"
												id="profileBannerInput"
												name="profileBanner"
												className="hidden"
												onChange={(e) =>
													handleValueChange("userDat", {
														...userData.userDat,
														profileBanner: e.target.files[0],
													})
												}
											/>
										</div>

										<input
											type="submit"
											value="Update!"
											className="mt-10 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
										></input>
									</form>
								</Tab.Panel>
								<Tab.Panel>
									<div className="flex w-full flex-col items-start justify-start">
										<h1 className="text-2xl font-bold ">Theme</h1>
										<p className="text-lg text-[#636363]">
											Choose from Light and Dark Mode
										</p>
										{Object.keys(userData).length !== 0 ? (
											<Switch
												checked={
													userData.settings.web_settings.theme === "dark"
														? true
														: false
												}
												onChange={() => {
													handleValueChange("settings", {
														...userData.settings,
														web_settings: {
															theme:
																userData.settings.web_settings.theme === "dark"
																	? "light"
																	: "dark",
														},
													});
												}}
												className={`${
													userData.settings.web_settings.theme === "dark"
														? `bg-gray-400`
														: `bg-gray-400`
												} relative inline-flex h-8 w-16 items-center rounded-full transition`}
											>
												<span
													className={`${
														userData.settings.web_settings.theme === "dark"
															? "translate-x-9 bg-black"
															: "translate-x-1 bg-white"
													} inline-block flex h-6 w-6 transform items-center justify-center rounded-full transition`}
												>
													<img
														className="h-1/2"
														src={
															userData.settings.web_settings.theme === "dark"
																? "/IconsMoon.svg"
																: "/IconsSun.svg"
														}
													/>
												</span>
											</Switch>
										) : (
											<></>
										)}
										<button
											className="mt-4 h-11 w-32 rounded-md bg-logo-blue text-xl text-white"
											onClick={handleSubmit}
										>
											Submit
										</button>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="flex w-full flex-col items-start justify-start">
										<h1 className="text-2xl font-bold ">Personalization</h1>
										<p className="text-lg text-[#636363]">
											Gives us permission to collect your data to serve you
											better
										</p>
										{Object.keys(userData).length !== 0 ? (
											<Switch
												checked={userData.settings.privacy.personalization}
												onChange={() => {
													handleValueChange("settings", {
														...userData.settings,
														privacy: {
															...userData.settings.privacy,
															personalization:
																!userData.settings.privacy.personalization,
														},
													});
												}}
												className={`${
													userData.settings.privacy.personalization
														? `bg-edit-green`
														: `bg-delete-red`
												} relative inline-flex h-8 w-16 items-center rounded-full transition`}
											>
												<span
													className={`${
														userData.settings.privacy.personalization
															? "translate-x-9"
															: "translate-x-1"
													}
                            inline-block h-6 w-6 transform rounded-full bg-white transition`}
												></span>
											</Switch>
										) : (
											<></>
										)}

										<input
											type="submit"
											value="Update!"
											className="mt-10 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
											onClick={handleSubmit}
										></input>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="flex w-full flex-col items-start justify-start">
										<h1 className="text-2xl font-bold ">Change Password</h1>
										<p className="text-lg text-[#636363]">
											Your password cannot be the same as the last one
										</p>
										<input
											type="text"
											name="projectName"
											placeholder="Current Password"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>
										<input
											type="text"
											name="projectName"
											placeholder="New Password"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>
										<input
											type="text"
											name="projectName"
											placeholder="Confirm New Password"
											className="mt-1 h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
										/>
										<input
											type="submit"
											value="Update!"
											className="mt-1 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
										></input>

										<input
											type="submit"
											value="Delete Account"
											className="mt-30 h-11 w-[30%] rounded-full bg-[#ED5A5A] text-xl text-white"
										></input>
										<input
											type="submit"
											value="Sign Out On All Devices"
											className="mt-2 mb-10 h-11 w-[30%] rounded-full bg-[#ED5A5A] text-xl text-white"
										></input>
									</div>
								</Tab.Panel>
								<Tab.Panel>
									<div className="flex w-full flex-col items-start justify-start">
										<p className="text-xl text-[#636363]">
											Any questions? Feature request or problems?
											<br></br>
											Fill in this feedback form here and we will get back to
											you as soon as possible!
										</p>
										<form className="mt-10 w-[60%]" onSubmit={handleEmail}>
											<p className="text-lg font-medium text-black">
												Your Name
											</p>
											<input
												type="text"
												name="emailName"
												placeholder="Enter your name here"
												className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
											/>

											<p className="mt-5 text-lg font-medium text-black">
												Your Email
											</p>
											<p className="text-base font-light text-[#636363]">
												<i>
													This is so that we can contact you in the future for
													further information
												</i>
											</p>
											<input
												type="text"
												name="emailEmail"
												placeholder="Enter your email here"
												className="mt-1 h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2"
											/>

											<p className="mt-5 text-lg font-medium text-black">
												The content
											</p>
											<p className="text-base font-light text-[#636363]">
												<i>
													Try to keep it short and simple. We will follow up
													with you if needed
												</i>
											</p>
											<textarea
												name="emailBody"
												placeholder="Write the issues/feedbacks/bugs you had here..."
												className="mt-1 h-32 w-full rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
											/>

											<input
												type="submit"
												value="Send Email"
												className="mt-5 mb-20 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
											></input>
										</form>
										<Dialog
											open={popupDisplay}
											onClose={() => setPopupDisplay(false)}
											className="fixed top-0 left-0 z-[2000] flex h-full w-full flex-col items-center justify-center bg-[#000000] bg-opacity-25"
										>
											<Dialog.Panel className="flex h-fit w-[50%] flex-col bg-white p-8">
												<Dialog.Title className="mb-0 text-xl font-bold">
													Your Feedback Has Been Sent!
												</Dialog.Title>
												<Dialog.Description className="mb-6 text-base text-gray-400">
													<i>Thank you for sending your feedback</i>
												</Dialog.Description>
												<p className="mb-3">
													Your feedback is much appreciated and we will get back
													to you as soon as possible!
												</p>
												<button
													onClick={() => setPopupDisplay(false)}
													className="h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white"
												>
													Close
												</button>
											</Dialog.Panel>
										</Dialog>
									</div>
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
				</div>
			</div>
		</div>
	);
}

function TabButton(props) {
	if (props.selected) {
		return (
			<div
				id={props.tab.id}
				className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start"
			>
				<p id={props.tab.id} className="mx-1 text-xl text-black">
					{props.tab.tabTitle}
				</p>
				<div
					id={props.tab.id}
					className="absolute bottom-0 h-1 w-full bg-black"
				></div>
			</div>
		);
	} else {
		return (
			<div
				id={props.tab.id}
				className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start hover:cursor-pointer"
			>
				<p id={props.tab.id} className="mx-1 text-xl text-[#B5B4B4]">
					{props.tab.tabTitle}
				</p>
			</div>
		);
	}
}

function Popup(props) {
    return (props.trigger) ? (
        <div className="w-full fixed top-0 left-0 h-full flex flex-col justify-center items-center bg-[#000000dd] z-[2000]">
            <div className="w-[50%] h-[50%] bg-white flex flex-col justify-center items-center">
                {props.children}
                <button className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-5 mb-20" onClick={() => props.setTrigger(false)}>Close</button>
            </div>
        </div>
    ) : "";
}
