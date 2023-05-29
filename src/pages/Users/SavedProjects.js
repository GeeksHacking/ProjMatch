import SideNav from "@/components/SideNav/SideNav"
import { useCallback, useEffect, useState } from "react"
import Switch from "react-switch";
import Link from "next/link";
import axios from "axios"
import { useRouter } from 'next/router'
import {useUser} from "@auth0/nextjs-auth0/client"


export default function SavedProjects() {

    const { user, error, isLoading } = useUser();
    const [ projMatchUser, setProjMatchUser ] = useState(null)
    const [ posts, setPosts ] = useState([])

    const getUserWithEmail = useCallback(async (authToken, user) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${user.email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }
        let res = await axios.request(apiOptions)
        .catch(function (err) {
            console.error("Failed to get User with: ", err)
        });
        if (res.status == 200) {
            setProjMatchUser(res.data.users[0])
        } else {
            throw `Status ${res.status}, ${res.statusText}`
        }
    }, [])

    const getPostsViaID = useCallback(async (authToken, id) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/posts/?id=${id}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                let temp = posts
                if (res.data.posts[0] !== undefined) {
                    temp.push(res.data.posts[0])
                }
                setPosts(temp)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")
        if (user === undefined) {
            return
        }
        getUserWithEmail(authToken, user)
    }, [user])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")
        if (projMatchUser === null) {
            return
        }
        for (let i = 0; i < projMatchUser.savedPosts.length; i++) {
            getPostsViaID(authToken, projMatchUser.savedPosts[i])
        }
    }, [projMatchUser, posts])


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if (!user) return <div>Not logged in</div>;

    console.log(posts)

    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-center my-10'>
                <h1 className="text-6xl font-bold text-black">Saved</h1>
                <div className="w-full h-fit relative grid grid-cols-3 gap-6 my-14">
                    {posts.map((post) => (
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

    return (
        <a className="z-10 relative w-full aspect-[4/3] flex flex-col justify-center items-center rounded-lg" href={"/Project/ProjectPage/?id="+post._id}>
            <div className="z-10 absolute bg-white/[0.5] w-full h-1/4 bottom-0 rounded-b-lg px-4 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold">{post.projectName}</h3>
                <p className="text-lg font-light">{tagString}</p>
                <div className="z-20 absolute bg-logo-lblue aspect-square rounded-lg flex justify-center items-center right-10">
                    <img src="/NavBarIcons/IconsSaved.svg" className="w-5 mx-3.5"></img>
                </div>
            </div>
            <img src={post.images[0]} className="z-0 w-fit h-fit rounded-lg"></img>
        </a>
    )
}