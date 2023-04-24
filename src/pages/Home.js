import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"

// Dev Imports
import { tagColors } from "@/tagColors"

export default function Home() {

    const { user, error, isLoading } = useUser();
    const [ posts, setPosts ] = useState([]);
    const [ postReq, setPostReq ] = useState([]);

    const getPosts = useCallback(async (authToken) => {
        const API_URL = process.env.API_URL
    
        var axiosAPIOptions = {
            method: 'GET',
            url: `${API_URL}/posts`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        };
    
        axios.request(axiosAPIOptions).then(function (res) {
            if (res.status == 200) {
                setPostReq(res)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [])

    // const getUserWithID = useCallback(async (authToken) => {
    //     const API_URL = process.env.API_URL

    //     var apiOptions = {
    //         method: 'GET',
    //         url: `${API_URL}/users`,
    //         headers: {
    //             'Authorisation': `Bearer ${authToken}`,
    //         },
    //         data: new URLSearchParams({ })
    //     }
    // })

    const checkUserExistWithEmail = useCallback(async (authToken, email) => {
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                console.log(res.data)
                const responseData = res.data
                if (responseData.users.length === 0) { // No user with email found, hence create user
                    createUserWithEmail(authToken, user)
                }
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User Existance with: ", err)
        })
    })

    const createUserWithEmail = async (authToken, user) => {
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'POST',
            url: `${API_URL}/users`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: {
                "username": user.nickname,
                "rlName": user.name,
                "regEmail": user.email,
                "regPhone": 0
            }
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                return res
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Create User with: ", err)
        })
    }

    useEffect(() => {
        // Check if the user exists. If not, create a new user for this user
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        if (user !== undefined) {
            checkUserExistWithEmail(authToken, user.email).then((res) => {
            })
        }
    }, [checkUserExistWithEmail])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        getPosts(authToken)
        .catch(console.error)
    }, [getPosts])
        
    useEffect(() => {
        try {
            setPosts(postReq.data.posts)
            console.log(postReq.data.posts)
        } catch (err) { }
    }, [setPosts, postReq])

    return (
        <main className='relative w-full h-full flex flex-row'>
            <div className="h-screen fixed z-20">
                <SideNav />
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                {
                posts.length !== 0 ?
                    
                    posts.map((post) => (
                        <Project post={post} key={post._id} />
                    )) : <></>
                }
                {/* <h1>{posts.length !== 0 ? posts[0].projectName : ""}</h1> */}
            </div>
        </main>
    )
}

function Project({post}) {
    return (
        <div id='project-container' className="flex relative w-3/5 h-[70%] my-10 flex-col">
            <div id="owner-profile" className="flex justify-start items-center absolute bg-logo-blue/[0.6] w-fit h-[12%] bottom-[30.7%] z-10 rounded-tr-2xl rounded-bl-2xl">
                <a className={`ml-4 flex items-center flex-row space-x-2`}>
                    <img src="" alt="logo" className='drop-shadow-custom w-14 h-14 flex-shrink-0 rounded-full'></img>
                    <div className="flex items-start flex-col">
                        <span className='ml-3 mr-6 font-bold text-lg text-white translate-y-0.5'> Loading... </span>
                    </div>
                </a>
            </div>
            <div id="gridscroll" className="relative w-full h-[70%] overflow-x-scroll overflow-y-hidden whitespace-nowrap rounded-l-3xl">
                {post.images !== null ? post.images.map((img)=>
                    <img src={img} className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]" key={img}></img>
                ) : <img src={"http://placekitten.com/g/600/800"} className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]" key={post._id+1}></img>
                    }
            </div>
            <div id="project-info" className="grow flex flex-col w-[90%]">
                <div className="grow flex flex-row">
                    <h1 className="text-3xl font-bold text-black">{post.projectName}</h1>
                    <div id="Menu" className="grow flex flex-row justify-end">
                        <img src="IconsMenuDots.svg" alt="logo" className='mt-2 w-6 h-6 flex-shrink-0'></img>
                    </div>
                </div>
                <div className="grow flex flex-row">
                    {(post.tags !== "" ? post.tags : [""]).map((tag) => (
                        <Tag tag={tag} key={tag}/>
                    ))}
                    {(post.technologies !== "" ? post.technologies : [""]).map((techbud) => (
                        <Tag tag={techbud} key={techbud}/>
                    ))}
                    <Stars rating={post.ratings}/>
                </div>
                <Link className="grow border-2 border-[#D3D3D3] rounded-md flex justify-center items-center text-xl" href={"/ProjectPage/?id="+post._id}>
                    <div >
                        Find out more!
                    </div>
                </Link>
            </div>
        </div>
    )
}
function Tag({tag}){
    return (
        <div className={`mx-2 flex flex-row justify-center items-center w-fit h-8 bg-black rounded-full min-w-[62px]`}>
            <span className="mx-4 text-white font-bold text-lg">{tag}</span>
        </div>
    )
}

function Stars({rating}){
    let stars = [0,0,0,0,0]
    for (let i = 0; i < rating; i++ ) {
        stars[i] = 1
    }
    return (
        <div className="flex flex-row">
            {stars.map((value) => (
                <Star value={value} key={Math.random()}/>
            ))}
        </div>

    )

}

function Star({value}) {
    if (value === 1){
        return (
            <div className="flex flex-row justify-center items-center">
                <img src="IconsStarFill.svg" alt="logo" className='w-6 h-6 flex-shrink-0'></img>
            </div>
        )
    }
    return (
        <div className="flex flex-row justify-center items-center">
            <img src="IconsStar.svg" alt="logo" className='w-6 h-6 flex-shrink-0'></img>
        </div>
    )
}

// Helper Functions
function getUserData() {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
}



export const getServerSideProps = withPageAuthRequired()