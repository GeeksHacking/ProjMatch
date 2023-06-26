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
let api = 0;
export default function CreateProject() {
	const router = useRouter();

	const { user, error, isLoading } = useUser();
	if (isLoading) return <div>Loading...</div>;
	const [projMatchUser, setProjMatchUser] = useState({});

	// State Variables
	const [newProject, setNewProject] = useState({});
	const [newProjID, setNewProjID] = useState("");
	const [projectImages, setProjectImages] = useState([]);
	const [tagError, setTagError] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [tagQuery, setTagQuery] = useState("");

	useEffect(() => {
		api = new PMApi();
	}, []);

	// API Req
	const createProj = useCallback((newProject, user) => {
		if (user !== undefined && newProject !== {}) {
			var formData = new FormData();
			if (!newProject.projectImages) {
				return;
			}
			for (let i = 0; i < newProject.projectImages.length; i++) {
				formData.append("files", newProject.projectImages[i]);
			}
			formData.append("projectName", newProject.projectName);
			formData.append("creatorUserID", user._id);
			api.createImgUrl(formData).then(function (res) {
				if (res != -1) {
					const imageURL = res.imageURL;
					api
						.createPost(
							newProject.projectName,
							newProject.projectDescription,
							user._id,
							newProject.projectContact,
							newProject.projectTags,
							newProject.projectTech,
							imageURL
						)
						.then(function (res) {
							if (res != -1 && res.insertedProjectWithID !== "") {
								router.push(`ProjectPage?id=${res.insertedProjectWithID}`);
							}
						});
				}
			});
		}
	}, []);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		} else {
			api = new PMApi(authToken);
			if (newProject !== {}) {
				api.getUsers({ email: user.email }).then((res) => {
					if (res !== -1) {
						createProj(newProject, res.users[0]);
					} else {
						console.error("ProjMatch User call returned empty or undefined");
					}
				});
			}
		}
	}, [newProject]);

	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		} else {
			api.getUsers({ email: user.email }).then((res) => {
				setProjMatchUser(res);
			});
		}
	}, [user]);

	// Handle Form Submission
	const handleSubmission = (event) => {
		event.preventDefault();

		const projectName = event.target.projectName.value;
		const projectDescription = event.target.projectDescription.value;
		const projectContact = event.target.projectContact.value;
		//const projectTags = event.target.projectTags.value.replace(/\s/g, '').toLowerCase().split(',')
		const projectTags = selectedTags;
		const projectTech = event.target.projectTech.value
			.replace(/\s/g, "")
			.toLowerCase()
			.split(",");

		if (tagError !== "") {
			alert("Please enter a valid tag");
			return;
		}

		setNewProject({
			projectName: projectName,
			projectDescription: projectDescription,
			projectContact: projectContact,
			projectTags: projectTags,
			projectImages: projectImages,
			projectTech: projectTech,
		});
	};

	const dataFromPicker = (data) => {
		setProjectImages(data);
	};

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

	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-start justify-start">
				<form
					className="flex w-full flex-col items-start justify-start"
					onSubmit={handleSubmission}
				>
					<h1 className="text-6xl font-bold text-black">Create Project</h1>
					<h2 className="mt-10 text-3xl font-medium">Project Name</h2>
					<p className="mt-1 text-lg">
						Choose a name that is simple and easy to remember!
					</p>
					<input
						type="text"
						id="projectName"
						name="projectName"
						placeholder="Enter your project’s name! e.g. AmazingClicker"
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h2 className="mt-10 text-3xl font-medium">Project Description</h2>
					<p className="mt-1 text-lg">
						Include important details about what your project is about and more!
					</p>
					<textarea
						id="projectDescription"
						name="projectDescription"
						placeholder="Enter your project’s description!"
						className="h-32 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
					/>

					<h2 className="mt-10 text-3xl font-medium">Add Images</h2>
					<ImagePicker images={[]} sendToParent={dataFromPicker} />
					<input
						id="projectImages"
						accept="image/*"
						type="file"
						name="projectImages"
						hidden
						multiple
					></input>

					<h2 className="mt-10 text-3xl font-medium">Contact</h2>
					<p className="mt-1 text-lg">
						Insert links or emails to allow the user to contact you
					</p>
					<input
						type="text"
						name="projectContact"
						id="projectContact"
						placeholder="Enter your project’s contact! e.g. https://discord.gg/AmazingClicker"
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h2 className="mt-10 text-3xl font-medium">Tags</h2>
					<p className="mt-1 text-lg">
						Add tags to help users find your project!
					</p>
					<Combobox
						value={selectedTags}
						onChange={setSelectedTags}
						multiple
						name=""
					>
						<div className="flex h-11 w-[70%] flex-row rounded-lg border-2 border-[#D3D3D3] px-2">
							<ul className="flex flex-row items-center justify-start">
								{selectedTags.map((tag) => (
									<li
										key={Math.random()}
										className="mx-1 flex h-7 w-fit items-center justify-between rounded-full bg-black"
									>
										<span className="mx-4 text-base font-light text-white">
											{tag}
										</span>
									</li>
								))}
							</ul>
							<Combobox.Input
								className="ml-2 w-full focus:outline-0"
								placeholder="Enter your project's tags!"
								onChange={(e) => setTagQuery(e.target.value)}
							/>
						</div>
						<div className="relative w-[70%]">
							<Combobox.Options className="absolute mt-1 w-full rounded-lg border-2 border-logo-blue bg-white">
								{filteredTags.length === 0 && tagQuery !== "" ? (
									<p>Nothing found</p>
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

					<h2 className="mt-10 text-3xl font-medium">Technologies</h2>
					<p className="mt-1 text-lg">
						Let users know what Programming Language/Framework you use!
					</p>
					<input
						type="text"
						name="projectTech"
						id="projectTech"
						placeholder="Enter your project’s technologies! e.g. SwiftUI, React, JavaScript"
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<input
						type="submit"
						value="Create Project"
						className="mb-20 mt-10 h-11 w-[30%] rounded-full bg-logo-blue text-2xl font-bold text-white"
					></input>
				</form>
			</div>
		</div>
	);
}
