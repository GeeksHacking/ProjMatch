import SideNav from "@/components/SideNav/SideNav";
import axios from "axios";
import PMApi from "@/components/PMApi/PMApi";
import { useUser } from "@auth0/nextjs-auth0/client";
import { use, useCallback, useEffect, useState } from "react";
import { get } from "animejs";
import { useRouter } from "next/router";
import ImagePicker from "@/components/ImagePicker/ImagePicker";
import Filter from "bad-words";
import approvedTags from "src/tags.json";
import { Combobox } from "@headlessui/react";
import autoprefixer from "autoprefixer";
let api = 0;
export default function CreateProject() {
	const router = useRouter();

	// State Variables
	const { user, error, isLoading } = useUser(); // Auth0 User
	if (isLoading) return <div>Loading...</div>; // Check if data is still being loaded

	const [pmUser, setPMUser] = useState({});
	const [projectImages, setProjectImages] = useState([]);
	const [tagError, setTagError] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [tagQuery, setTagQuery] = useState("");

	// Initialise new API Object
	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (authToken !== undefined) {
			api = new PMApi(authToken);
		} else {
			console.error(
				"Could not initialise API Wrapper, Auth Token returned undefined"
			);
		}
	}, []);

	// Get user information
	useEffect(() => {
		api.getUsers({ email: user.email }).then((res) => {
			setPMUser(res.users[0]);
		});
	}, [user]);

	// Grab Data from Image Picker
	const dataFromPicker = (data) => {
		setProjectImages(data);
	};

	// Tag Picker Changes
	const handleTagChange = (event) => {
		let filter = new Filter({ emptyList: true });
		filter.addWords(...approvedTags);

		const tags = event.target.value.replace(/\s/g, "").split(",");
		if (tags.filter((tag) => filter.isProfane(tag)).length !== tags.length) {
			setTagError("Please enter a valid tag");
		} else {
			setTagError("");
		}
	};

	const filteredTags =
		tagQuery === ""
			? approvedTags
			: approvedTags.filter((tag) =>
					tag.toLowerCase().includes(tagQuery.toLowerCase())
			  );

	// Send POST Request to store images
	const createImageURL = async (project) => {
		var formData = new FormData();

		for (let i = 0; i < project.images.length; i++) {
			formData.append("files", project.images[i]);
		}
		formData.append("projectName", project.projectName);
		formData.append("creatorUserID", project.creatorUserID);

		const apiOptions = {
			method: "POST",
			url: `${process.env.API_URL}/images`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem("authorisation_token")}`,
				"Content-Type": "multipart/form-data",
			},
			data: formData,
		};
		axios.request(apiOptions).then(function (res) {
			if (res.status == 200) {
				const imageURLs = res.data.imageURL;

				api
					.createPost(
						project.projectName,
						project.description,
						project.creatorUserID,
						project.contact,
						project.tags,
						project.technologies,
						imageURLs
					)
					.then((res) => {
						if (res != -1 && res.insertedProjectWithID !== "") {
							router.push(`Project?id=${res.insertedProjectWithID}`);
						}
					});
			}
		});
	};

	// Process and Send Data
	const handleSubmission = async (event) => {
		event.preventDefault();

		console.log("test");

		if (localStorage.getItem("authorisation_token") !== undefined) {
			const project = {
				projectName: event.target.projectName.value,
				description: event.target.projectDescription.value,
				creatorUserID: pmUser._id,
				tags: selectedTags,
				technologies: event.target.projectTech.value
					.replace(/\s/g, "")
					.split(","),
				images: projectImages,
				contact: event.target.projectContact.value,
			};

			await createImageURL(project);
		}
	};

	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-start justify-start">
				<form
					className="flex w-full flex-col items-start justify-start"
					onSubmit={handleSubmission}
				>
					<h1 className="text-6xl font-bold text-black">Create Project </h1>
					<h2 className="mt-10 text-3xl font-medium">
						Project Name <RequiredIcon />
					</h2>
					<p className="mt-1 text-lg">
						Choose a name that is simple and easy to remember!
					</p>
					<div className="group h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
						<input
							type="text"
							id="projectName"
							name="projectName"
							placeholder="Enter your project’s name! e.g. AmazingClicker"
							className="h-full w-full rounded-md px-2 outline-none"
							required
						/>
					</div>

					<h2 className="mt-10 text-3xl font-medium">
						Project Description <RequiredIcon />
					</h2>
					<p className="mt-1 text-lg">
						Include important details about what your project is about and more!
					</p>
					<div className="group h-32 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
						<textarea
							type="text"
							id="projectDescription"
							name="projectDescription"
							placeholder="Enter your project’s description!"
							className="h-full w-full resize-none rounded-md px-2 py-1 outline-none"
							required
						/>
					</div>

					<h2 className="mt-10 text-3xl font-medium">Add Images</h2>
					<ImagePicker images={[]} sendToParent={dataFromPicker} />

					<h2 className="mt-10 text-3xl font-medium">
						Contact <RequiredIcon />
					</h2>
					<p className="mt-1 text-lg">
						Insert links or emails to allow the user to contact you
					</p>
					<div className="group h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
						<input
							type="text"
							name="projectContact"
							id="projectContact"
							placeholder="Enter your project’s contact! e.g. https://discord.gg/AmazingClicker"
							className="h-full w-full rounded-md px-2 outline-none"
							required
						/>
					</div>

					<h2 className="mt-10 text-3xl font-medium">
						Tags <RequiredIcon />
					</h2>
					<p className="mt-1 text-lg">
						Add tags to help users find your project!
					</p>
					<Combobox
						value={selectedTags}
						onChange={setSelectedTags}
						multiple
						name=""
					>
						<div className="flex h-auto w-[70%] flex-col gap-1">
							<ul className="flex h-auto flex-row items-center justify-start">
								{selectedTags.map((tag) => (
									<li
										key={Math.random()}
										className="mx-1 flex h-7 w-fit items-center justify-between gap-2 rounded-full bg-black px-4"
									>
										<span className="text-base font-light text-white">
											{tag}
										</span>
										<button className="text-white" type="button">
											<img
												src="/IconsClose.svg"
												onClick={() =>
													setSelectedTags(selectedTags.filter((t) => t !== tag))
												}
											></img>
										</button>
									</li>
								))}
							</ul>
							<div className="group h-11 w-full rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
								<Combobox.Input
									className="h-full w-full rounded-md px-2 outline-none"
									placeholder="Enter your project's tags!"
									onChange={(e) => setTagQuery(e.target.value)}
									required
								/>
							</div>
						</div>
						<div className="relative w-[70%]">
							<Combobox.Options
								className={`absolute top-0 mt-1 w-full rounded-lg border-2 border-logo-blue bg-white`}
							>
								{filteredTags.length === 0 && tagQuery !== "" ? (
									<p className="p-2">Nothing found</p>
								) : (
									filteredTags.map((tag) =>
										selectedTags.indexOf(tag) === -1 ? (
											<Combobox.Option
												key={Math.random()}
												value={tag}
												className="flex h-8 flex-row items-center rounded-lg bg-white p-2"
											>
												<span className="text-base font-light">{tag}</span>
											</Combobox.Option>
										) : (
											<Combobox.Option
												key={Math.random()}
												value={tag}
												className="flex h-8 flex-row items-center bg-logo-blue p-2"
											>
												<span className="text-base font-bold text-white">
													{tag}
												</span>
											</Combobox.Option>
										)
									)
								)}
							</Combobox.Options>
						</div>
					</Combobox>
					<p className="mt-1 text-lg text-[#ff0000]">
						<i>{tagError}</i>
					</p>

					<h2 className="relative mt-10 text-3xl font-medium">
						Technologies
						<RequiredIcon />
					</h2>
					<p className="mt-1 text-lg">
						Let users know what Programming Language/Framework you use!
					</p>
					<div className="group h-11 w-[70%] rounded-lg bg-[#D3D3D3] p-0.5 duration-300 focus-within:bg-logo-blue">
						<input
							type="text"
							name="projectTech"
							id="projectTech"
							placeholder="Enter your project’s technologies! e.g. SwiftUI, React, JavaScript"
							className="h-full w-full rounded-md px-2 outline-none"
							required={true}
						/>
					</div>

					<button
						type="submit"
						className="group relative mb-20 mt-10 h-11 w-[30%] overflow-hidden rounded-full bg-logo-blue text-2xl font-bold text-white duration-150 hover:scale-105 active:scale-95"
					>
						<div className="absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-light-blue opacity-40 group-active:left-full group-active:duration-500" />
						<div>Submit Project</div>
					</button>
				</form>
			</div>
		</div>
	);
}

function RequiredIcon() {
	return (
		<span className="absolute">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="#ff0000"
				className="bi bi-asterisk h-2 w-2"
				viewBox="0 0 16 16"
			>
				<path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
			</svg>
		</span>
	);
}
