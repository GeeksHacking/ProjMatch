import SideNav from "@/components/SideNav/SideNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Switch, Dialog, Tab } from "@headlessui/react";
import { useCookies } from "react-cookie";

import PMApi from "@/components/PMApi/PMApi";
let api = 0;

export default function SettingsPage() {
	const { user, error, isLoading } = useUser();
	const [projMatchUser, setProjMatchUser] = useState({});
	const router = useRouter();
	const [popupDisplay, setPopupDisplay] = useState(false);
	const [userData, setUserData] = useState({});
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [cookies, setCookies] = useCookies();

	const handleSignOut = (e) => {
		e.preventDefault();
		localStorage.removeItem("authorisation_token");
		router.push(`${process.env.AUTH0_BASE_URL}/api/auth/logout`);
	};

	const handleAccountDelete = (e) => {
		e.preventDefault();

		api.deleteUsers(projMatchUser._id).then((res) => {
			if (res != -1) {
				localStorage.removeItem("authorisation_token");
			}
		});

		router.push(`/Landing`);
	};

	const handleSubmit = (e) => {
		if (e !== undefined) {
			e.preventDefault();
		}

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

		const authToken = sessionStorage.token
		if (Object.keys(updatedData).length === 0) {
			return;
		}
		if (authToken === undefined) {
			return;
		}
		if (updatedData.userDat !== undefined) {
			let formData = new FormData();
			formData.append(
				"files",
				updatedData.bannerImg == undefined ? "" : updatedData.bannerImg
			);
			formData.append(
				"files",
				updatedData.bannerImg == undefined ? "" : updatedData.profileImg
			);
			formData.append("creatorUserID", projMatchUser._id);

			api.createImgUrl(formData).then((res) => {
				("res");
				(res);
				const imageURL = res.imageURL;
				let bannerURL, profileImgURL;
				if (imageURL.length == 2) {
					bannerURL = imageURL[0];
					profileImgURL = imageURL[1];
				} else if (imageURL.length == 1) {
					if (updatedData.bannerImg !== undefined) {
						bannerURL = imageURL[0];
						profileImgURL = projMatchUser.profileImg;
					} else {
						bannerURL = projMatchUser.bannerImg;
						profileImgURL = imageURL[0];
					}
				}

				const tempData = {
					...updatedData,
					userDat: {
						profileBanner: bannerURL,
						profileImg: profileImgURL,
					},
				};
				api
					.updateUser(projMatchUser._id, tempData)
					.then((res) => {
						if (res.status == 200) {
							router.push(
								`${process.env.AUTH0_BASE_URL}/Profile?id=${projMatchUser._id}`
							);
						} else {
							throw `Status ${res.status}, ${res.statusText}`;
						}
					})
					.catch(function (err) {
						console.error("Failed to get User with: ", err);
					});
			});
		} else {
			api
				.updateUser(projMatchUser._id, updatedData)
				.then((res) => {
					if (res.status == 200) {
						router.push(
							`${process.env.AUTH0_BASE_URL}Profile?id=${projMatchUser._id}`
						);
					} else {
						throw `Status ${res.status}, ${res.statusText}`;
					}
				})
				.catch(function (err) {
					console.error("Failed to get User with: ", err);
				});
		}
	};

	const handleImageButton = (e) => {
		e.preventDefault();
		if (e.target.id == "profileImg") {
			document.getElementById("profileImgInput").click();
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

		api
			.sendEmail(emailData)
			.then((res) => {
				if (res.status == 200) {
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to send email with: ", err);
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
		const authToken = sessionStorage.token

		if (authToken === undefined) {
			return console.error("No token found");
		}

		api = new PMApi(authToken);
	}, []);

	useEffect(() => {
		if (user === undefined) {
			return;
		}
		api.getUsers({ email: user.email }).then((data) => {
			setProjMatchUser(data.users[0]);
		});
	}, [user]);

	useEffect(() => {
		if (projMatchUser !== undefined) {
			setUserData({
				...projMatchUser,
			});
		}
	}, [projMatchUser]);

	useEffect(() => {
		if (cookies["web-settings"] == undefined) {
			setCookies("web-settings", "light");
		}
		if (cookies["personalization"] == undefined) {
			setCookies("personalization", false);
		}
		(cookies);
	}, [cookies]);

	useEffect(() => {
		(userData);
	}, [userData]);

	return (
		<div className="absolute flex h-full w-full flex-col">
			<Dialog
				className="absolute left-1/2 top-1/2 z-10 flex h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-light-blue p-6 drop-shadow-lg"
				open={showDeletePopup}
				onClose={() => setShowDeletePopup(false)}
			>
				<Dialog.Panel class="flex h-full w-full flex-col items-center">
					<Dialog.Title className="shrink text-center text-2xl">
						Delete Account
					</Dialog.Title>
					<Dialog.Description className="texl-lg shrink text-center italic opacity-60">
						This will permanently delete your account.
					</Dialog.Description>

					<p className="mb-auto flex w-10/12 grow items-center justify-center text-center">
						Are you sure you want to delete your account? This action cannot be
						undone. All of your data will be permanently deleted.
					</p>

					<div className="mb-0 flex h-fit w-full shrink flex-row justify-around">
						<button
							className="h-11 w-4/12 rounded-md bg-delete-red text-xl font-bold text-white drop-shadow-md"
							onClick={(e) => handleAccountDelete(e)}
						>
							Delete
						</button>
						<button
							className="h-11 w-4/12 rounded-md bg-logo-lblue text-xl font-bold text-white drop-shadow-md"
							onClick={() => setShowDeletePopup(false)}
						>
							Cancel
						</button>
					</div>
				</Dialog.Panel>
			</Dialog>
			<SideNav />
			{Object.keys(projMatchUser).length !== 0 &&
			projMatchUser.bannerImg !== "" ? (
				<img
					src={projMatchUser.bannerImg}
					id="image-banner"
					className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue object-cover"
				></img>
			) : (
				<div className="absolute z-[-1] h-[20%] w-full border-b-2 border-[#C7C7C7] bg-logo-blue"></div>
			)}
			<button
				onClick={handleSignOut}
				className="absolute right-[3%] top-[23%] h-fit w-fit rounded-md bg-[#ED5A5A] px-6 py-3 text-lg font-bold text-white drop-shadow-md duration-150 hover:scale-105 active:scale-95"
			>
				Sign Out
			</button>
			<div className="absolute left-[14%] top-[10%] z-[-1] flex h-[20%] w-[70%] flex-col">
				<div id="pfp-name" className="flex h-full w-full flex-row ">
					{Object.keys(projMatchUser).length !== 0 &&
					projMatchUser.profileImg !== "" ? (
						<img
							src={projMatchUser.profileImg}
							className="rounded-full border-3 border-[#C7C7C7]"
						></img>
					) : (
						<img
							src="/profileIconV2.svg"
							className="rounded-full border-3 border-[#C7C7C7]"
						></img>
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
							<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">
								<p className="mx-1 text-xl text-[#B5B4B4] ui-selected:text-black">
									My Profile
								</p>
								<hr className="absolute bottom-0 hidden h-1 w-full bg-logo-blue ui-selected:block" />
							</Tab>
							<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">
								<p className="mx-1 text-xl text-[#B5B4B4] ui-selected:text-black">
									Web Settings
								</p>
								<hr className="absolute bottom-0 hidden h-1 w-full bg-logo-blue ui-selected:block" />
							</Tab>
							<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">
								<p className="mx-1 text-xl text-[#B5B4B4] ui-selected:text-black">
									Privacy
								</p>
								<hr className="absolute bottom-0 hidden h-1 w-full bg-logo-blue ui-selected:block" />
							</Tab>
							<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">
								<p className="mx-1 text-xl text-[#B5B4B4] ui-selected:text-black">
									Security
								</p>
								<hr className="absolute bottom-0 hidden h-1 w-full bg-logo-blue ui-selected:block" />
							</Tab>
							<Tab className="relative z-10 mr-10 flex h-full w-fit flex-row items-center justify-start">
								<p className="mx-1 text-xl text-[#B5B4B4] ui-selected:text-black">
									Support
								</p>
								<hr className="absolute bottom-0 hidden h-1 w-full bg-logo-blue ui-selected:block" />
							</Tab>
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
									<div className="group mt-1 h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
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
											className="h-full w-full rounded-md px-2 outline-none"
										/>
									</div>

									<h1 className="mt-6 text-2xl font-bold">Name</h1>
									<div className="group mt-1 h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
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
											className=" h-full w-full rounded-md px-2 outline-none"
										/>
									</div>

									<h1 className="mt-6 text-2xl font-bold">Email</h1>
									<p className="text-lg text-[#636363]">
										<i>This input will not update your email yet</i>
									</p>
									<div className="flex h-fit w-[70%] flex-row justify-between">
										<div className="group mt-1 h-11 w-full rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
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
												className="h-full w-full rounded-md px-2 outline-none"
											/>
										</div>
									</div>

									<h1 className="mt-6 text-2xl font-bold">Contact Link</h1>
									<div className="group z-10 mt-1 h-11 w-[70%] overflow-visible rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
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
											className="h-full w-full rounded-md px-2 outline-none"
										/>
									</div>

									<h1 className="mt-6 text-2xl font-bold">About Me</h1>
									<p className="text-lg text-[#636363]">
										Provide a short description about you and what you do
									</p>
									<div className="group mt-1 h-fit w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
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
											className="h-32 w-full rounded-md px-2 py-1 outline-none"
										/>
									</div>

									<h1 className="mt-6 text-2xl font-bold">Profile Picture</h1>
									<div className="flex h-36 w-[70%] flex-row items-center justify-start">
										{Object.keys(userData).length !== 0 &&
										userData.profileImg !== "" ? (
											<img
												src={
													typeof userData.profileImg == "object"
														? URL.createObjectURL(userData.profileImg)
														: userData.profileImg
												}
												className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] object-cover object-center"
											/>
										) : (
											<div className="mt-2 h-32 w-32 rounded-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
										)}
										<button
											id="profileImg"
											className="ml-4 mt-1 h-11 w-32 rounded-md bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
											onClick={handleImageButton}
										>
											Add image
										</button>
										<input
											type="file"
											id="profileImgInput"
											name="profileImg"
											className="hidden"
											onChange={(e) =>
												handleValueChange("userDat", {
													...userData,
													profileImg: e.target.files[0],
												})
											}
										/>
									</div>
									<h1 className="mt-6 text-2xl font-bold">Profile Banner</h1>
									<div className="flex h-fit w-[70%] flex-col items-start justify-center">
										{Object.keys(userData).length !== 0 &&
										userData.bannerImg !== "" ? (
											<img
												src={
													typeof userData.bannerImg == "object"
														? URL.createObjectURL(userData.bannerImg)
														: userData.bannerImg
												}
												className="mt-2 h-36 w-full border-3 border-[#C7C7C7] object-cover object-center"
											/>
										) : (
											<div className="mt-2 h-36 w-full border-3 border-[#C7C7C7] bg-[#D3D3D3]"></div>
										)}
										<button
											id="profileBanner"
											className="mt-1 h-11 w-full rounded-md bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
											onClick={handleImageButton}
										>
											Add image
										</button>
										<input
											type="file"
											id="profileBannerInput"
											name="profileBanner"
											className="hidden"
											onChange={(e) =>
												handleValueChange("userDat", {
													...userData,
													profileBanner: e.target.files[0],
												})
											}
										/>
									</div>

									<input
										type="submit"
										value="Update!"
										className="mb-20 mt-10 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
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
												cookies["web-settings"] === "dark" ? true : false
											}
											onChange={() => {
												setCookies(
													"web-settings",
													cookies["web-settings"] === "dark" ? "light" : "dark"
												);
											}}
											className={`${
												cookies["web-settings"] === "dark"
													? `bg-gray-400`
													: `bg-gray-400`
											} relative inline-flex h-8 w-16 items-center rounded-full transition`}
										>
											<span
												className={`${
													cookies["web-settings"] === "dark"
														? "translate-x-9 bg-black"
														: "translate-x-1 bg-white"
												} flex h-6 w-6 transform items-center justify-center rounded-full transition`}
											>
												<img
													className="h-1/2"
													src={
														cookies["web-settings"] === "dark"
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
										className="mt-4 h-11 w-32 rounded-md bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
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
										Gives us permission to collect your data to serve you better
									</p>
									{Object.keys(userData).length !== 0 ? (
										<Switch
											checked={
												cookies["personalization"] === "true" ? true : false
											}
											onChange={() => {
												setCookies(
													"personalization",
													cookies["personalization"] === "true" ? false : true
												);
											}}
											className={`${
												cookies["personalization"] === "true"
													? `bg-edit-green`
													: `bg-delete-red`
											} relative inline-flex h-8 w-16 items-center rounded-full transition`}
										>
											<span
												className={`${
													cookies["personalization"] === "true"
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
										className="mb-20 mt-10 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
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
									<div className="group mt-1 h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
										<input
											type="text"
											name="projectName"
											placeholder="Current Password"
											className="h-full w-full rounded-md px-2 outline-none"
										/>
									</div>
									<div className="group mt-1 h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
										<input
											type="text"
											name="projectName"
											placeholder="New Password"
											className="h-full w-full rounded-md px-2 outline-none"
										/>
									</div>
									<div className="group mt-1 h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
										<input
											type="text"
											name="projectName"
											placeholder="Confirm New Password"
											className="h-full w-full rounded-md px-2 outline-none"
										/>
									</div>
									<input
										type="submit"
										value="Update!"
										className="mb-20 mt-1 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
									></input>

									<button
										type="button"
										className=" group relative h-11 w-[30%] overflow-hidden rounded-full bg-[#ED5A5A] text-xl text-white duration-150 hover:scale-105 active:scale-95"
										onClick={() => setShowDeletePopup(true)}
									>
										<div className="absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-black/50 opacity-40 group-hover:left-full group-hover:duration-500" />
										<p>Delete Account</p>
									</button>
									<button
										type="button"
										value=""
										className="group relative mt-2 h-11 w-[30%] overflow-hidden rounded-full bg-[#ED5A5A] text-xl text-white duration-150 hover:scale-105 active:scale-95"
									>
										<div className="absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-black/50 opacity-40 group-hover:left-full group-hover:duration-500" />
										<p>Sign Out On All Devices</p>
									</button>
								</div>
							</Tab.Panel>
							<Tab.Panel>
								<div className="flex w-full flex-col items-start justify-start">
									<p className="text-xl text-[#636363]">
										Any questions? Feature request or problems?
										<br></br>
										Fill in this feedback form here and we will get back to you
										as soon as possible!
									</p>
									<form className="mt-10 w-[60%]" onSubmit={handleEmail}>
										<p className="text-lg font-medium text-black">Your Name</p>
										<div className="group mt-1 h-11 w-full rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
											<input
												type="text"
												name="emailName"
												placeholder="Enter your name here"
												className="h-full w-full rounded-md px-2 outline-none"
											/>
										</div>

										<p className="mt-5 text-lg font-medium text-black">
											Your Email
										</p>
										<p className="text-base font-light text-[#636363]">
											<i>
												This is so that we can contact you in the future for
												further information
											</i>
										</p>
										<div className="group mt-1 h-11 w-full rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
											<input
												type="text"
												name="emailEmail"
												placeholder="Enter your email here"
												className="h-full w-full rounded-md px-2 outline-none"
											/>
										</div>

										<p className="mt-5 text-lg font-medium text-black">
											The content
										</p>
										<p className="text-base font-light text-[#636363]">
											<i>
												Try to keep it short and simple. We will follow up with
												you if needed
											</i>
										</p>
										<div className="group mt-1 h-fit w-full rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
											<textarea
												name="emailBody"
												placeholder="Write the issues/feedbacks/bugs you had here..."
												className="h-32 w-full rounded-md px-2 py-1 outline-none"
											/>
										</div>

										<input
											type="submit"
											value="Send Email"
											className="mb-20 mt-5 h-11 w-[30%] rounded-lg bg-logo-blue text-xl text-white duration-150 hover:scale-105 active:scale-95"
										></input>
									</form>
									<Dialog
										open={popupDisplay}
										onClose={() => setPopupDisplay(false)}
										className="fixed left-0 top-0 z-[2000] flex h-full w-full flex-col items-center justify-center bg-[#000000] bg-opacity-25"
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
