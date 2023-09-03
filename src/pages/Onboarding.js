import PMApi from "@/components/PMApi/PMApi";
import { Tab } from "@headlessui/react";
import e from "cors";
import { useState, useEffect } from "react";
import approvedTags from "src/tags.json";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

// Create Global API
let api = 0

export default function Onboarding() {
	const { user, error, isLoading } = useUser(); // Auth0 User
	if (isLoading) return <div>Loading...</div>; // Check if data is still being loaded
	const [activeTab, setActiveTab] = useState(0);
	const [selectedTags, setSelectedTags] = useState([]);
	const [userData, setUserData] = useState({
		username: "",
		skills: "",
		description: "",
		interest: selectedTags,
	});
	const router = useRouter()

	function changeTab(i) {
		setActiveTab(i);
	}

	function handleSubmit(e) {
		e.preventDefault();

		// Create User Account
		api.createUser(userData["username"], user.email, userData["description"], userData["interest"], userData["skills"]).then(function (res) {
			router.push("Home")
		}) // pass interest as algoData for now
	}

	function updateFormValues(e) {
		let username =
			e.target.username == undefined
				? userData.username
				: e.target.username.value;
		let skills =
			e.target.skills == undefined ? userData.skills : e.target.skills.value;
		let description =
			e.target.description == undefined
				? userData.description
				: e.target.description.value;

		setUserData({
			username: username,
			skills: skills,
			description: description,
			interest: selectedTags,
		});
	}

	function updateUserData(e) {
		let tempObj = { ...userData };
		tempObj[e.target.name] = e.target.value;
		setUserData(tempObj);
	}

	function handleTagClicked(e, i) {
		e.preventDefault();

		if (selectedTags.indexOf(i) === -1) {
			setSelectedTags([...selectedTags, i]);
		} else {
			setSelectedTags(selectedTags.filter((tag) => tag !== i));
		}
	}

	useEffect(() => {
		setUserData({
			username: userData.username,
			skills: userData.skills,
			description: userData.description,
			interest: selectedTags,
		});
	}, [selectedTags]);

	useEffect(() => {
		// On show screen, intialise the API
		const authToken = sessionStorage.token
		if (authToken === null)
			return console.error("Authorisation Token returned Null.");
		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		api = new PMApi(authToken)
	}, [])

	return (
		<div className="absolute flex h-full w-full flex-row">
			<SideBanner />
			<div className="h-full flex-grow p-10">
				<div className="flex h-full w-full flex-col rounded-3xl border-3 border-gray-100 bg-white p-10 drop-shadow-2xl">
					<Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
						<Tab.Panels className="flex-grow">
							<Tab.Panel className="h-full">
								<CreatAccountForm
									changeTab={changeTab}
									updateFormValues={updateFormValues}
									userData={userData}
									updateUserData={updateUserData}
								/>
							</Tab.Panel>
							<Tab.Panel className="h-full">
								<InterestForm
									handleTagClicked={handleTagClicked}
									selectedTags={selectedTags}
									changeTab={changeTab}
									handleSubmit={handleSubmit}
								/>
							</Tab.Panel>
						</Tab.Panels>
						<Tab.List className="mt-4 flex h-3 w-full justify-between gap-10 hover:cursor-default">
							<Tab
								className="h-full w-full rounded-full hover:cursor-default"
								onClick={(e) => e.preventDefault()}
							>
								{({ selected }) => (
									<div
										className={`h-full w-full rounded-full ${
											selected ? "bg-logo-blue" : "bg-gray-300"
										}`}
									></div>
								)}
							</Tab>
							<Tab
								className="h-full w-full rounded-full hover:cursor-default"
								onClick={(e) => e.preventDefault()}
							>
								{({ selected }) => (
									<div
										className={`h-full w-full rounded-full ${
											selected ? "bg-logo-blue" : "bg-gray-300"
										}`}
									></div>
								)}
							</Tab>
						</Tab.List>
					</Tab.Group>
				</div>
			</div>
		</div>
	);
}

function SideBanner() {
	return (
		<div className="relative flex h-full w-2/5 flex-shrink-0 flex-col justify-around bg-logo-blue p-7">
			<div className="absolute left-7 top-7 flex h-12 w-fit flex-row items-end gap-3">
				<img
					src="./Logo/Final.svg"
					alt="logo"
					className="aspect-square h-full flex-shrink-0 rounded-md"
				></img>
				<p className="text-xl font-bold text-white">ProjMatch</p>
			</div>
			<div>
				<p className="mb-4 text-5xl font-bold text-white">
					Welcome to ProjMatch!
				</p>
				<p className="text-lg font-light text-white opacity-80">
					Answer a few short questions to let us know what you are interested in
					so that we can tailor projects that are shown to you.
				</p>
			</div>
			<div className="relative flex w-full flex-row">
				<Card className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-3/4" />
				<Card className="absolute left-3/4 top-4 -translate-x-1/2 -translate-y-3/4 rotate-12" />
				<Card className="absolute left-1/4 top-4 -translate-x-1/2 -translate-y-3/4 -rotate-12" />
			</div>
		</div>
	);
}

function InterestForm({
	handleTagClicked,
	selectedTags,
	handleSubmit,
	changeTab,
}) {
	return (
		<div className="flex h-full flex-col">
			<p className="mb-1 flex-shrink-0 text-4xl font-bold">
				Tell us more about you
			</p>
			<p className="mb-6 flex-shrink-0 text-lg font-light text-gray-600">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua.
			</p>
			<form
				className="flex w-full flex-grow flex-col"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit(e);
				}}
			>
				<div
					id="grid"
					className="grid h-110 w-full grid-cols-3 gap-5 overflow-x-hidden overflow-y-scroll p-3"
				>
					{approvedTags.map((tag, i) => (
						<button
							index={i}
							className={`group flex aspect-square w-full items-end justify-end rounded-2xl border p-4 shadow transition-all duration-150 hover:scale-105 hover:shadow-lg ${
								selectedTags.indexOf(i) !== -1 ? "bg-logo-blue" : "bg-white"
							} active:scale-95`}
							onClick={(e) => handleTagClicked(e, i)}
						>
							<p
								className={`text-xl font-bold text-gray-300 transition-all duration-150 ${
									selectedTags.indexOf(i) !== -1
										? "group-hover:text-gray-50"
										: "group-hover:text-gray-600"
								}`}
							>
								{tag}
							</p>
						</button>
					))}
				</div>
				<div className="mt-8 flex w-full justify-end gap-5">
					<button
						onClick={(e) => {
							e.preventDefault();
							changeTab(0);
						}}
						className="flex-shrink-0 rounded-md border border-gray-400 px-5 py-3 font-bold text-gray-400 duration-75 hover:cursor-pointer focus:outline-none active:scale-95"
					>
						Go Back
					</button>
					<input
						type="submit"
						value="Continue"
						className="flex-shrink-0 rounded-md bg-logo-blue px-5 py-3 font-bold text-white duration-75 hover:cursor-pointer focus:outline-none active:scale-95"
					/>
				</div>
			</form>
		</div>
	);
}

function CreatAccountForm({
	changeTab,
	updateFormValues,
	userData,
	updateUserData,
}) {
	return (
		<div className="flex h-full flex-col">
			<p className="mb-1 flex-shrink-0 text-4xl font-bold">
				Create Your Account
			</p>
			<p className="mb-6 flex-shrink-0 text-lg font-light text-gray-600">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua.
			</p>
			<form
				className="flex w-full flex-grow flex-col"
				onSubmit={(e) => {
					e.preventDefault();
					updateFormValues(e);
					changeTab(1);
				}}
			>
				<label className="flex-shrink-0 font-bold text-gray-500">
					Username
				</label>
				<input
					type="text"
					name="username"
					id="username"
					placeholder="Username"
					className="mb-5 h-12 flex-shrink-0 rounded-md border-2 border-gray-200 px-2 focus:outline-none"
					value={userData.username}
					onChange={(e) => updateUserData(e)}
				/>
				<label className="flex-shrink-0 font-bold text-gray-500">Skills</label>
				<input
					type="text"
					name="skills"
					id="skills"
					placeholder="Skills"
					className=" mb-5 flex h-12 flex-shrink-0 rounded-md border-2 border-gray-200 px-2 focus:outline-none"
					value={userData.skills}
					onChange={(e) => updateUserData(e)}
				/>
				<label className="flex-shrink-0 font-bold text-gray-500">
					Describe Yourself
				</label>
				<textarea
					type="text"
					name="description"
					id="description"
					placeholder="Description"
					className=" mb-5 flex-grow resize-none rounded-md border-2 border-gray-200 p-2 focus:outline-none"
					value={userData.description}
					onChange={(e) => updateUserData(e)}
				/>
				<div className="flex w-full justify-end">
					<input
						type="submit"
						value="Continue"
						className="flex-shrink-0 rounded-md bg-logo-blue px-5 py-3 font-bold text-white duration-75 hover:cursor-pointer focus:outline-none active:scale-95"
					/>
				</div>
			</form>
		</div>
	);
}

function Card({ image, title, description, className }) {
	return (
		<div
			className={`flex aspect-1/1.5 w-40 flex-col gap-3 rounded-lg bg-white p-4 drop-shadow-lg ${className}`}
		>
			<div
				id="image"
				className="aspect-1.5/1 w-full rounded-md bg-light-blue"
			></div>
			<div id="title" className="h-3 w-10/12 rounded-full bg-logo-blue"></div>
			{[0, 0, 0, 0].map((_, index) => (
				<div
					key={index}
					id="description"
					className="h-2 w-full rounded-full bg-gray-300"
				></div>
			))}
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired();