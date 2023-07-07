import SideNav from "@/components/SideNav/SideNav";
import PMApi from "@/components/PMApi/PMApi";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCallback, useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import approvedTags from "src/tags.json";
let api = 0;
export default function SearchPage() {
	const { user, error, isLoading } = useUser();
	const [posts, setPosts] = useState([]);
	const [search, setSearch] = useState("");
	const [tagsFilter, setTagsFilter] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	useEffect(() => {
		const authToken = localStorage.getItem("authorisation_token");
		if (!(authToken === undefined)) {
			api = new PMApi(authToken);
		}
	}, []);

	const getPostsWithSearch = useCallback(async (search) => {
		api.getPosts({ search: search }).then(function (res) {
			if (res != -1) {
				setPosts(res.posts);
			}
		});
	}, []);

	useEffect(() => {
		if (search === "") {
			getPostsWithSearch(search);
		}
	}, [search]);

	const handleSearch = (e) => {
		e.preventDefault();
		setSearch(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		getPostsWithSearch(search);
	};

	useEffect(() => {
		if (tagsFilter.length !== 0) {
			setFilteredPosts(
				posts.filter((post) => {
					for (let i = 0; i < tagsFilter.length; i++) {
						if (post.tags.indexOf(tagsFilter[i]) !== -1) {
							return true;
						}
					}
					return false;
				})
			);
		}

		if (tagsFilter.length === 0) {
			setFilteredPosts(posts);
		}
	}, [tagsFilter]);

	useEffect(() => {
		if (posts.length !== 0) {
			setFilteredPosts(posts);
		}
	}, [posts]);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) return <div>Not logged in</div>;
	return (
		<div className="absolute flex h-full w-full flex-col items-center justify-start">
			<SideNav />
			<div className="absolute my-10 flex h-full w-[70%] flex-col items-center justify-start">
				<h1 className="text-6xl font-bold text-black">Search</h1>
				<div className="relative mt-10 flex h-16 w-full flex-row items-center justify-start rounded-lg border-2 border-[#D3D3D3] px-2">
					<img src="/Search.svg" alt="Search" className="ml-2 mr-4 h-[60%]" />
					<input
						type="text"
						name="search"
						placeholder="Search for any project!"
						className="border-1 w-full border-white"
						onChange={handleSearch}
					/>
				</div>
				<div className="mt-5 flex w-full flex-row items-center justify-end">
					<Listbox multiple value={tagsFilter} onChange={setTagsFilter}>
						<Listbox.Button className="mr-1 rounded-lg bg-logo-lblue px-5 py-2 text-lg font-bold text-white">
							Filter
						</Listbox.Button>
						<div className="relative">
							<Listbox.Options className="absolute left-[-300px] top-6 z-[1000] h-[500px] w-[300px] overflow-y-scroll rounded-lg border-2 border-logo-blue bg-white">
								{approvedTags.map((tag, index) =>
									tagsFilter.indexOf(tag) === -1 ? (
										<Listbox.Option
											key={index}
											value={tag}
											className="flex h-8 flex-row items-center rounded bg-white p-2"
										>
											<p className="text-base font-light">{tag}</p>
										</Listbox.Option>
									) : (
										<Listbox.Option
											key={index}
											value={tag}
											className="flex h-8 flex-row items-center bg-logo-blue p-2"
										>
											<p className="text-base font-bold text-white">{tag}</p>
										</Listbox.Option>
									)
								)}
							</Listbox.Options>
						</div>
					</Listbox>
					<button
						className="ml-1 rounded-lg bg-logo-blue px-5 py-2 text-lg font-bold text-white"
						onClick={handleSubmit}
					>
						Search
					</button>
				</div>
				<div className="relative my-14 grid h-fit w-full grid-cols-3 gap-6">
					{filteredPosts.map((post) => (
						<Project post={post} key={post._id} />
					))}
				</div>
			</div>
		</div>
	);
}

export function Project({ post }) {
	let tagString = "";
	if (post.tags.length !== 0) {
		tagString += post.tags[0];
		if (post.tags.length > 1) {
			for (let i = 1; i < (post.tags.length > 3 ? 3 : post.tags.length); i++) {
				tagString += ", " + post.tags[i];
			}
		}
	}

	let imageLink = "http://placekitten.com/800/600";
	if (post.images !== null) {
		if (post.images.length !== 0) {
			imageLink = post.images[0];
		}
	}

	return (
		<a
			className="relative z-10 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg"
			href={"/Project?id=" + post._id}
		>
			<div className="absolute bottom-0 z-10 flex h-1/4 w-full flex-col items-start justify-center rounded-b-lg bg-white/[0.5] px-4">
				<h3 className="text-xl font-semibold">{post.projectName}</h3>
				<p className="text-lg font-light">{tagString}</p>
			</div>
			<img src={imageLink} className="z-0 h-full w-full rounded-lg"></img>
		</a>
	);
}
