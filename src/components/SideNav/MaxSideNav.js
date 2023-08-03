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
	const [open, setOpen] = useState(false);

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
				className={`${
					styles.SideNav
				} items-left flex h-full flex-col bg-light-blue pb-3 pt-3 ${
					open ? "w-56" : "w-20"
				} transition-all duration-200`}
				onMouseEnter={() => {
					setOpen(true);
				}}
				onMouseLeave={() => {
					setOpen(false);
				}}
			>
				<Link
					className={`flex items-center space-x-2 pl-3 pr-3 text-logo-blue`}
					href="/"
				>
					<img
						src="/logo/Final.svg"
						alt="logo"
						className="z-40 h-12 w-12 flex-shrink-0 rounded-md"
					></img>
					<span
						className={`${styles.SideNavTxt} z-30 text-xl font-bold ${
							open ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
						} duration-150 `}
					>
						{" "}
						ProjMatch{" "}
					</span>
				</Link>
				<div className={`mt-10 space-y-4`}>
					<div className={`space-y-4`}>
						{navOptions.map((option, index) =>
							option.Page != "Create" ? (
								<SideNavOptn
									option={option}
									key={index}
									style={`${
										open
											? "translate-x-0 opacity-100"
											: "-translate-x-8 opacity-0"
									}`}
								/>
							) : (
								<></>
							)
						)}
					</div>
				</div>

				<div className={`mt-auto space-y-6`}>
					<div className={`group relative bg-logo-blue p-5 pb-2 pt-2`}>
						<Link
							className="flex items-center space-x-4 text-light-blue "
							href="/Create"
						>
							<img
								src="/NavBarIcons/IconsCreate.svg"
								alt="logo"
								className="h-8 w-8 flex-shrink-0"
							></img>
							<span
								className={`text-xl font-bold duration-150 ${
									open
										? "translate-x-0 opacity-100"
										: "-translate-x-8 opacity-0"
								} duration-150 group-hover:scale-105 group-active:scale-95`}
							>
								{" "}
								Create{" "}
							</span>
							<div className="absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-white opacity-40 group-hover:left-full group-hover:duration-500" />
						</Link>
					</div>

					<div className={`pl-3`}>
						<Link
							className={`group flex flex-row items-center space-x-2`}
							href={"/Profile?id=" + userInfo._id}
						>
							{userInfo.userDat.profilePic !== "" ? (
								<img
									src={userInfo.userDat.profilePic}
									alt="logo"
									className="z-40 h-14 w-14 flex-shrink-0 rounded-full border-2 border-logo-blue"
								></img>
							) : (
								<div className="z-40 flex h-14 w-14 flex-shrink-0 rotate-90 items-center justify-center rounded-full border-2 border-logo-blue bg-gray-400 text-xl text-gray-800">{`=)`}</div>
							)}

							<div
								className={`flex flex-col items-start ${
									open
										? "translate-x-0 opacity-100"
										: "-translate-x-8 opacity-0"
								} z-30 duration-150 group-hover:scale-105`}
							>
								<span
									className={`${styles.SideNavTxt} translate-y-0.5 whitespace-nowrap text-lg font-bold text-logo-blue`}
								>
									{" "}
									{userInfo.username}{" "}
								</span>
								<span
									className={`${styles.SideNavTxt} -translate-y-0.5 whitespace-nowrap text-start text-lg font-bold`}
								>
									{" "}
									{userInfo.rlName}{" "}
								</span>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
// Side Navigation Options
const SideNavOptn = ({ option, style }) => {
	return (
		<div
			className={`group p-5 pb-2 pt-2 duration-300 hover:bg-logo-blue hover:bg-opacity-10`}
		>
			<Link
				className="flex items-center space-x-4 text-logo-blue"
				href={option.PageLink}
			>
				<img
					src={option.IconPath}
					alt="logo"
					className="z-40 h-8 w-8 flex-shrink-0 duration-300"
				></img>
				<span
					className={`text-xl font-bold ${styles.SideNavTxt} duration-150 ${style} z-30 duration-300 group-hover:scale-105 group-active:scale-95`}
				>
					{option.Page}
				</span>
			</Link>
		</div>
	);
};

export default MaxSideNav;
