import SideNav from "@/components/SideNav/SideNav";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import { Listbox } from "@headlessui/react";
import approvedTags from "../tags.json";

export default function SearchPage() {
    const { user, error, isLoading } = useUser()
    const [ posts, setPosts ] = useState([])
    const [ search, setSearch ] = useState("")
    const [ tagsFilter, setTagsFilter ] = useState([])
    const [ filteredPosts, setFilteredPosts ] = useState([])

    const getPostsWithSearch = useCallback(async (authToken, search) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/posts?search=${search}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                setPosts(res.data.posts)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [])

    useEffect(() => {
        if (search === "") {
            getPostsWithSearch(localStorage.getItem("authorisation_token"), search)
        }
    }, [search])

    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        getPostsWithSearch(localStorage.getItem("authorisation_token"), search)
    }

    useEffect(() => {

        if (tagsFilter.length !== 0) {
            setFilteredPosts(posts.filter((post) => {
                for (let i = 0; i < tagsFilter.length; i++) {
                    if (post.tags.indexOf(tagsFilter[i]) !== -1) {
                        return true
                    }
                }
                return false
            }))
        }

        if (tagsFilter.length === 0) {
            setFilteredPosts(posts)
        }

    }, [tagsFilter])

    useEffect(() => {
        if (posts.length !== 0) {
            setFilteredPosts(posts)
        }
    }, [posts])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>
    if (!user) return <div>Not logged in</div>;
    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-center my-10'>
                <h1 className="text-6xl font-bold text-black">Search</h1>
                <div className="relative flex flex-row justify-start items-center w-full h-16 rounded-lg border-2 border-[#D3D3D3] px-2 mt-10">
                    <img src="/Search.svg" alt="Search" className="h-[60%] ml-2 mr-4"/>
                    <input type="text" name="search" placeholder="Search for any project!" className="border-1 border-white w-full" onChange={handleSearch}/>
                </div>
                <div className="flex flex-row w-full justify-end items-center mt-5">
                    <Listbox multiple value={tagsFilter} onChange={setTagsFilter}>
                        <Listbox.Button className="bg-logo-lblue rounded-lg px-5 py-2 text-lg font-bold text-white mr-1">
                            Filter
                        </Listbox.Button>
                        <div className="relative">
                            <Listbox.Options className="absolute top-6 left-[-300px] w-[300px] h-[500px] bg-white z-[1000] border-2 border-logo-blue rounded-lg overflow-y-scroll">
                                {approvedTags.map((tag, index) => (
                                    (tagsFilter.indexOf(tag) === -1) ? 
                                        <Listbox.Option key={index} value={tag} className="rounded p-2 h-8 bg-white flex flex-row items-center">
                                            <p className="font-light text-base">{tag}</p>
                                        </Listbox.Option>
                                        : <Listbox.Option key={index} value={tag} className="p-2 h-8 bg-logo-blue flex flex-row items-center">
                                            <p className="text-white font-bold text-base">{tag}</p>
                                        </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                    <button className="bg-logo-blue rounded-lg px-5 py-2 text-lg font-bold text-white ml-1" onClick={handleSubmit}>
                        Search
                    </button>
                </div>
                <div className="w-full h-fit relative grid grid-cols-3 gap-6 my-14">
                    {filteredPosts.map((post) => (
                        <Project post={post} key={post._id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function Project({post}) {
    let tagString = ''
    if (post.tags.length !== 0) {
        tagString += post.tags[0]
        if (post.tags.length > 1) {
            for (let i = 1; i < (post.tags.length > 3 ? 3 : post.tags.length); i++) {
                tagString += ', ' + post.tags[i]
            }
        }
    }

    let imageLink = "http://placekitten.com/800/600"
    if (post.images !== null) {
        if (post.images.length !== 0) {
            imageLink = post.images[0]
        }
    }

    return (
        <a className="z-10 relative w-full aspect-[4/3] flex flex-col justify-center items-center rounded-lg" href={"/ProjectPage/?id="+post._id}>
            <div className="z-10 absolute bg-white/[0.5] w-full h-1/4 bottom-0 rounded-b-lg px-4 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold">{post.projectName}</h3>
                <p className="text-lg font-light">{tagString}</p>
            </div>
            <img src={imageLink} className="z-0 w-full h-full rounded-lg"></img>
        </a>
    )
}