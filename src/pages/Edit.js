import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import ImagePicker from "@/components/ImagePicker/ImagePicker";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
	const [imagesData, setImagesData] = useState();

	const { user, error, isLoading } = useUser();
	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (authToken !== undefined) {
			api = new PMApi(authToken);
		} else {
			console.error;
		}
	}, []);

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

	// Handle Form Submission
	const handleSubmission = (event) => {
		event.preventDefault();

		const projectName = event.target.projectName.value;
		const projectDescription = event.target.projectDescription.value;
		const projectContact = event.target.projectContact.value;
		const projectTags = event.target.projectTags.value
			.replace(/\s/g, "")
			.split(",");
		//const projectImages = [...event.target.projectImages.files]
		const projectTech = event.target.projectTech.value
			.replace(/\s/g, "")
			.split(",");

		let projImages = [];
		if (imagesData === undefined) {
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

		let tempUpdatedProj = {};
		if (temp !== undefined) {
			const keys = [
				"projectName",
				"description",
				"contact",
				"tags",
				"technologies",
				"images",
			];
			for (let i = 0; i < keys.length; i++) {
				if (JSON.stringify(post[keys[i]]) !== JSON.stringify(temp[keys[i]])) {
					tempUpdatedProj[keys[i]] = temp[keys[i]];
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
						className="h-32 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2 py-1"
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
					<input
						type="text"
						disabled={post.tags.join(", ") === "Loading..." ? true : false}
						name="projectTags"
						defaultValue={`${post.tags.join(", ")}`}
						className="h-11 w-[70%] rounded-lg border-2 border-[#D3D3D3] px-2"
					/>

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
						defaultValue="Edit Project"
						className="mb-20 mt-10 h-11 w-[30%] rounded-full bg-logo-blue text-2xl font-bold text-white"
					></input>
				</form>
			</div>
		</div>
	);
}
