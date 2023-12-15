import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import ImagePicker from "@/components/ImagePicker/ImagePicker";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import approvedTags from "src/tags.json";
import { Combobox } from "@headlessui/react";
let api = 0;

export default function EditProject() {
	const router = useRouter();
	const { id } = router.query;
	const [post, setPost] = useState({
		projectName: "Loading...",
		description: "Loading...",
		creatorUserID: "Loading...",
		rating: "Loading...",
		tags: ["Loading..."],
		technologies: ["Loading..."],
		images: ["Loading..."],
		contact: ["Loading..."],
		isArchived: false,
	});
	const [imagesData, setImagesData] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [tagQuery, setTagQuery] = useState("");

	const { user, error, isLoading } = useUser();

	useEffect(() => {
		const authToken = sessionStorage.token
		if (authToken !== undefined) {
			api = new PMApi(authToken);
		} else {
			console.error;
		}
	}, []);

	useEffect(() => {
		setSelectedTags(post.tags);
	}, [post]);

	useEffect(() => {
		if (id !== undefined) {
			api.getPosts({ id: id }).then(function (res) {
				if (res !== -1) {
					setPost(res.posts[0]);
				}
			});
		} else {
			console.error;
		}
	}, [id]);

	const filteredTags =
		tagQuery === ""
			? approvedTags
			: approvedTags.filter((tag) =>
					tag.toLowerCase().includes(tagQuery.toLowerCase())
			  );

	// Send POST Request to store images
	const createImageURL = async (project) => {
		var formData = new FormData();
		var proj = JSON.parse(JSON.stringify(project));

		for (let i = 0; i < project.images.length; i++) {
			if (typeof project.images[i] !== "string") {
				formData.append("files", project.images[i]);
				proj.images.splice(proj.images.indexOf(project.images[i]));
			}
		}

		formData.append("projectName", project.projectName);
		formData.append("creatorUserID", user._id);

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
				const imageURLs = proj.images.concat(res.data.imageURL);
				project.images = imageURLs;

				let tempUpdatedProj = {};
				if (project !== undefined) {
					const keys = [
						"projectName",
						"description",
						"contact",
						"tags",
						"technologies",
						"images",
					];
					for (let i = 0; i < keys.length; i++) {
						if (
							JSON.stringify(post[keys[i]]) !== JSON.stringify(project[keys[i]])
						) {
							tempUpdatedProj[keys[i]] = project[keys[i]];
						}
					}
				}

				if (id !== undefined) {
					api.updatePost(id, tempUpdatedProj).then(function (res) {
						if (res != -1) {
							router.push(`Project?id=${id}`);
						}
					});
				}
			}
		});
	};

	// Handle Form Submission
	const handleSubmission = async (event) => {
		event.preventDefault();

		const projectName = event.target.projectName.value;
		const projectDescription = event.target.projectDescription.value;
		const projectContact = event.target.projectContact.value;
		const projectTags = selectedTags;
		//const projectImages = [...event.target.projectImages.files]
		const projectTech = event.target.projectTech.value
			.replace(/\s/g, "")
			.split(",");

		let projImages = [];
		if (imagesData === undefined || imagesData.length === 0) {
			projImages = post.images;
		} else {
			projImages = imagesData;
		}

		const temp = {
			projectName: projectName,
			description: projectDescription,
			contact: projectContact,
			tags: projectTags,
			images: projImages,
			technologies: projectTech,
		};

		await createImageURL(temp);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) return <div>Not logged in</div>;
	for (const key in post) {
		if (post[key] === "Loading...") {
			return <div>Loading...</div>;
		}
	}

	const dataFromPicker = (data) => {
		setImagesData(data);
	};

	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-start justify-start">
				<form
					className="flex w-full flex-col items-start justify-start"
					onSubmit={handleSubmission}
				>
					<h1 className="text-6xl font-bold text-black">Edit Project</h1>
					<h2 className="mt-10 text-3xl font-medium">Project Name</h2>
					<p className="mt-1 text-lg">
						Choose a name that is simple and easy to remember!
					</p>
					<input
						type="text"
						name="projectName"
						defaultValue={`${post.projectName}`}
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<h2 className="mt-10 text-3xl font-medium">Project Description</h2>
					<p className="mt-1 text-lg">
						Include important details about what your project is about and more!
					</p>
					<textarea
						defaultValue={post.description}
						name="projectDescription"
						className="h-32 w-[70%] resize-none rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
					></textarea>

					<h2 className="mt-10 text-3xl font-medium">Add Images</h2>
					<ImagePicker images={post.images} sendToParent={dataFromPicker} />

					<h2 className="mt-10 text-3xl font-medium">Contact</h2>
					<p className="mt-1 text-lg">
						Insert links or emails to allow the user to contact you
					</p>
					<input
						type="text"
						disabled={post.contact === "Loading..." ? true : false}
						name="projectContact"
						defaultValue={`${post.contact}`}
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
							<Combobox.Input
								className="h-11 w-full rounded-lg border-2 border-[#D3D3D3] px-2 focus:outline-0"
								placeholder="Enter your project's tags!"
								onChange={(e) => setTagQuery(e.target.value)}
							/>
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

					<h2 className="mt-10 text-3xl font-medium">Technologies</h2>
					<p className="mt-1 text-lg">
						Let users know what Programming Language/Framework you use!
					</p>
					<input
						type="text"
						disabled={
							post.technologies.join(", ") === "Loading..." ? true : false
						}
						name="projectTech"
						id="projectTech"
						defaultValue={`${post.technologies.join(", ")}`}
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

					<input
						type="submit"
						value="Edit Project"
						className="mb-20 mt-10 h-11 w-[30%] rounded-full bg-logo-blue text-2xl font-bold text-white"
					></input>
				</form>
			</div>
		</div>
	);
}
