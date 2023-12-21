import PMApi from "@/components/PMApi/PMApi";
import { Dialog, Tab } from "@headlessui/react";
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

	function createUserAccount() {
		api.createUser(userData["username"], user.email, userData["description"], userData["interest"], userData["skills"]).then(function (res) {
			router.push("Home")
		}) // pass interest as algoData for now
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
								/>
							</Tab.Panel>
							<Tab.Panel>
								<EULAAcceptance 
									changeTab={changeTab}
									createUserAccount={createUserAccount}
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
	changeTab,
}) {
	return (
		<div className="flex h-full flex-col">
			<p className="mb-1 flex-shrink-0 text-4xl font-bold">
				Tell us more about you
			</p>
			<p className="mb-6 flex-shrink-0 text-lg font-light text-gray-600">
				This allows us to find the right project for you
			</p>
			<form
				className="flex w-full flex-grow flex-col"
				onSubmit={(e) => {
					e.preventDefault();
					changeTab(2);
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
				Join us to embark on you wonderful development journey!
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
					required
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
					required
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
					required
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

function EULAAcceptance({changeTab, createUserAccount}) {
	const [isAgree, setIsAgree] = useState(false)
	const [displayEULADialog, setDisplayEULADialog] = useState(false)

	function handleSubmit(e) {
		e.preventDefault();

		// Create User Account
		if (isAgree) {
			createUserAccount()
		} else {
			setDisplayEULADialog(true)
		}
	}

	return (
		<div className="flex flex-col w-full">
			<p className="mb-1 flex-shrink-0 text-4xl font-bold">
				End-User Licence Agreement (EULA)
			</p>
			<p className="mb-6 flex-shrink-0 text-lg font-light text-gray-600">
				The EULA outlines the terms and conditions that govern your use of our platform. By creating an account, you are indicating that you have read, understood, and agree to abide by these terms.
			</p>

			<div className="font-sans h-110 w-full overflow-x-hidden overflow-y-scroll text-wrap mb-6" style={{maxHeight: "800px"}}>
				<p>END-USER LICENSE AGREEMENT (EULA) FOR PROJMATCH</p>
				<br></br>
				<p>1. DEFINITIONS</p>
				<p>1.1 "Web Service" refers to ProjMatch, including all its components, features, and documentation.</p>
				<p>1.2 "User" refers to the individual or entity who uses the Web Service.</p>
				<p>1.3 "Provider" refers to GeeksHacking LLP, the provider of the Web Service.</p>
				<p>1.4 “User Submissions” refers to any content, data, or materials submitted or uploaded by the User to the Web Service</p>
				<br></br>
				<p>2. LICENSE GRANT</p>
				<p>2.1 Subject to the terms and conditions of this EULA, Provider grants the User a non-exclusive, non-transferable license to access and use the Web Service.</p>
				<p>2.2 The User may access the Web Service through standard web browsers and other compatible devices.</p>
				<p>2.3 The User is not permitted to reproduce, copy, distribute, resell or otherwise use the Software for any commercial purposes</p>
				<p>2.4 The User is not permitted to use the Software in any way which breaches any applicable local, national or international law</p>
				<br></br>
				<p>3. RESTRICTIONS</p>
				<p>3.1 The User shall not copy, modify, reverse engineer, decompile, disassemble, or create derivative works based on the Web Service.</p>
				<p>3.2 The User shall not sublicense, sell, lease, or otherwise transfer access to the Web Service to any third party.</p>
				<br></br>
				<p>4. INTELLECTUAL PROPERTY</p>
				<p>4.1 User Submissions shall remain the exclusive property and responsibility of the User.</p>
				<p>4.2 The User acknowledges that the Web Service is protected by copyright and other intellectual property laws.</p>
				<p>4.3 The User acknowledges and agrees that the Provider may, at its sole discretion, use, reproduce, modify, adapt, publish, translate, distribute, and display User Submissions solely for the purpose of providing and improving the Web Service.</p>
				<p>4.4 The User is solely responsible for the accuracy, legality, and appropriateness of their User Submissions. The Provider assumes no responsibility or liability for User Submissions, and the User agrees to indemnify and hold the Provider harmless from any claims arising out of or related to User Submissions.</p>
				<br></br>
				<p>5. CONTENT MODERATION AND USER BEHAVIOR</p>
				<p>5.1 The Provider reserves the right, but is not obligated, to review, monitor, or remove any User Submissions that, in its sole discretion, are deemed inappropriate, offensive, or in violation of this EULA.</p>
				<p>5.2 The User acknowledges that the Provider has the right to refuse, delete, or terminate access to the Web Service for any User who submits content that is deemed inappropriate, offensive, or violates the terms of this EULA.</p>
				<p>5.3 Inappropriate content includes, but is not limited to, content that is unlawful, defamatory, harassing, obscene, fraudulent, or that infringes on the intellectual property rights of others.</p>
				<p>5.4 The Provider may, without prior notice, take appropriate actions, including the removal of content, suspension, or termination of a User's access to the Web Service, for violations of this EULA or for behavior that is deemed harmful or disruptive.</p>
				<p>5.5 The User understands and agrees that the Provider shall not be liable for any action taken in good faith to enforce this clause.</p>
				<br></br>
				<p>6. DISCLAIMER OF WARRANTY</p>
				<p>6.1 THE WEB SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES, WHETHER EXPRESSED OR IMPLIED.</p>
				<p>6.2 PROVIDER DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
				<br></br>
				<p>7. LIMITATION OF LIABILITY</p>
				<p>7.1 PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE WEB SERVICE.</p>
				<p>7.2 IN NO EVENT SHALL PROVIDER'S LIABILITY EXCEED THE AMOUNT PAID BY THE USER FOR ACCESS TO THE WEB SERVICE.</p>
				<br></br>
				<p>8. TERMINATION</p>
				<p>8.1 This EULA agreement is effective from the date you first use the Web Service and shall continue until terminated.</p>
				<p>8.2 Upon termination, the User's access to the Web Service must cease.</p>
				<br></br>
				<p>9. GOVERNING LAW</p>
				<p>9.1 This EULA shall be governed by and construed in accordance with the laws of Singapore.</p>
				<br></br>
				<p>10. MISCELLANEOUS</p>
				<p>10.1 Any amendments to this EULA must be in writing.</p>
				<p>10.2 If any provision of this EULA is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.</p>
			</div>
			<div className="flex flex-row mb-6 gap-4 items-center">
				<input type="checkbox" checked={isAgree} className="w-6 h-6 rounded" onClick={() => setIsAgree(!isAgree)}></input>
				<p className="text-lg">I agree to the EULA</p>
			</div>
			<div className="mt-8 flex w-full justify-sgart gap-5">
				<button
					onClick={(e) => {
						e.preventDefault();
						changeTab(1);
					}}
					className="flex-shrink-0 rounded-md border border-gray-400 px-5 py-3 font-bold text-gray-400 duration-75 hover:cursor-pointer focus:outline-none active:scale-95"
				>
					Go Back
				</button>
				<input
					onClick={(e) => handleSubmit(e)}
					type="submit"
					value="Continue"
					className="flex-shrink-0 rounded-md bg-logo-blue px-5 py-3 font-bold text-white duration-75 hover:cursor-pointer focus:outline-none active:scale-95"
				/>
			</div>
			<Dialog open={displayEULADialog} onClose={() => setDisplayEULADialog(false)}>
				<div className="fixed inset-0 bg-black/20 z-10" aria-hidden="true" />


				<div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-20">
					<Dialog.Panel className="bg-white p-5 rounded-2xl">
						<Dialog.Title className="text-2xl font-bold">EULA Acceptance</Dialog.Title>
						<Dialog.Description className="text-lg my-3">
							In order to create a ProjMatch Account, you must accept the End-User Licence Agreement.
						</Dialog.Description>

						<button onClick={() => setDisplayEULADialog(false)} className="py-2 px-4 bg-logo-lblue hover:bg-logo-blue rounded-lg text-white text-lg">
							Okay
						</button>
					</Dialog.Panel>
				</div>
			</Dialog>
		</div>
	)
}

export const getServerSideProps = withPageAuthRequired();
