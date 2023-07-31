// Components Import
import { useEffect, useState, useCallback } from "react";
import PMApi from "@/components/PMApi/PMApi";
import Logo from "./Logo";
import styles from "./SideNav.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useRouter } from "next/router";
let api = 0;
const MaxSideNav = () => {
	const { user, error, isLoading } = useUser();
	const [userInfo, setUserInfo] = useState(null);
	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (authToken === null)
			return console.error("Authorisation Token returned Null.");
		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		} else if (user !== undefined) {
			api = new PMApi(authToken);
			const API_URL = process.env.API_URL;
			api.getUsers({ email: user.email }).then((res) => {
				if (res != -1) {
					setUserInfo(res.users[0]);
				}
			});
		}
	}, [user, setUserInfo]);

	// Navigation Data
	const navOptions = [
		{
			Page: "Home",
			IconPath: "/NavBarIcons/IconsHome.svg",
			PageLink: "/Home",
		},
		{
			Page: "Search",
			IconPath: "/NavBarIcons/IconsSearch.svg",
			PageLink: "/Search",
		},
		{
			Page: "Saved",
			IconPath: "/NavBarIcons/IconsSaved.svg",
			PageLink: "/Saved",
		},
		{
			Page: "Settings",
			IconPath: "/NavBarIcons/IconsSettings.svg",
			PageLink: "/Settings",
		},
		{
			Page: "Create",
			IconPath: "/NavBarIcons/IconsCreate.svg",
			PageLink: "/CreateProject",
		},
	];

	// State Variables

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) return <div>Not logged in</div>;
	if (userInfo === null) return <div>Loading...</div>;

	return (
		<div className={`fixed left-0 top-0 z-0 h-full w-fit`}>
			<div
				className={`${styles.SideNav} items-left flex h-full w-fit flex-col bg-light-blue pb-3 pt-3`}
			>
				<Link
					className={`flex items-center space-x-2 pl-3 pr-3 text-logo-blue`}
					href="/"
				>
					<img
						src="/logo/Final.svg"
						alt="logo"
						className="h-12 w-12 flex-shrink-0 rounded-md"
					></img>
					<span className={`${styles.SideNavTxt} text-xl font-bold`}>
						{" "}
						ProjMatch{" "}
					</span>
				</Link>
				<div className={`mt-10 space-y-4`}>
					<div className={`space-y-4`}>
						{navOptions.map((option, index) =>
							option.Page != "Create" ? (
								<SideNavOptn option={option} key={index} />
							) : (
								<></>
							)
						)}
					</div>
				</div>

				<div className={`mt-auto space-y-6 p-3`}>
					<Link
						className={`flex items-center space-x-4 bg-logo-blue text-light-blue ${styles.create_button} h-fit rounded-lg`}
						href="/Create"
					>
						<img
							src="/NavBarIcons/IconsCreate.svg"
							alt="logo"
							className="my-2 ml-[0.6875rem] h-8 w-8 flex-shrink-0"
						></img>
						<span
							className={`${styles.SideNavTxt} flex items-center pb-0.5 text-xl font-bold`}
						>
							{" "}
							Create{" "}
						</span>
					</Link>

					<Link
						className={`flex flex-row items-center space-x-2`}
						href={"/Profile?id=" + userInfo._id}
					>
						<img
							src={userInfo.userDat.profilePic}
							alt="logo"
							className="h-14 w-14 flex-shrink-0 rounded-full border-2 border-logo-blue"
						></img>
						<div className="flex flex-col items-start">
							<span
								className={`${styles.SideNavTxt} translate-y-0.5 text-lg font-bold text-logo-blue`}
							>
								{" "}
								{userInfo.username}{" "}
							</span>
							<span
								className={`${styles.SideNavTxt} -translate-y-0.5 text-start text-lg font-bold`}
							>
								{" "}
								{userInfo.rlName}{" "}
							</span>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};
// Side Navigation Options
const SideNavOptn = ({ option }) => {
	return (
		<div className={`sidenav-btn p-5 pb-2 pt-2`}>
			<Link
				className="flex items-center space-x-4 text-logo-blue"
				href={option.PageLink}
			>
				<img
					src={option.IconPath}
					alt="logo"
					className="h-8 w-8 flex-shrink-0"
				></img>
				<span className={`text-xl font-bold ${styles.SideNavTxt}`}>
					{option.Page}
				</span>
			</Link>
		</div>
	);
};

export default MaxSideNav;
