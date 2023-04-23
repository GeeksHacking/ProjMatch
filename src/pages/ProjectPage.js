import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import { useRouter } from 'next/router'
export default function ProjectPage() {
    const router = useRouter()
    const { id } = router.query
    const [ post, setPost ] = useState([]);
    const [ postReq, setPostReq ] = useState([]);
    const { user, error, isLoading } = useUser();
    

    const getPosts = useCallback(async (authToken) => {
        const API_URL = process.env.API_URL
        if (id === undefined) {
            return
        }
        var axiosAPIOptions = {
            method: 'GET',
            url: `${API_URL}/posts/?id=${id}`,
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
    }, [id])

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
            
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
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
            // console.log(postReq)
            // console.log(postReq.data.posts[0])
            setPost(postReq.data.posts[0])
            // console.log(post)
        } catch (err) { }
    }, [postReq])

    if (post.length === 0) {
        return (
            <></>
        )
    }
    return (
        
        <main className='relative w-full h-full flex flex-row'>
            <div className="h-screen fixed z-20">
                <SideNav />
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                <div id="project-details-container" className="flex relative w-2/3 h-[95%] my-10 flex-col">
                    <div id="gridscroll" className="relative w-full h-[50%] overflow-x-scroll overflow-y-hidden whitespace-nowrap rounded-l-3xl">
                        {((post.images)? post.images:["https://placekitten.com/200/300","https://placekitten.com/200/300"]).map((img)=>
                            <img src={img} className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]" key={Math.random()}>
                            </img>
                        )}
                        
                        {/* <img src="http://placekitten.com/901/600" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                        </img>
                        <img src="http://placekitten.com/900/602" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl">
                        </img> */}
                    </div>
                    <div id="title-menu-container" className="flex w-full h-[7%] flex-row">
                        <div id="title-container" className="flex flex-row justify-start items-center w-[50%] h-full">
                            <h1 className="text-3xl font-bold text-black">{post.projectName}</h1>
                        </div>
                        <div id="menu-container" className="flex flex-row justify-end items-center w-[50%] h-full">
                            <img src="/IconsFlag.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0'></img>
                            <img src="/IconsShare.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0'></img>
                            <img src="NavBarIcons/IconsSaved.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0'></img>
                        </div>
                    </div>
                    <div id="description-details-container" className="flex w-full h-[40%] flex-row">
                        <div id="description-container" className="flex flex-col justify-start items-start w-[80%] h-full p-5">
                            <h1 className="text-2xl font-bold text-black">Description</h1>
                            <p className="text-lg font-normal text-black">
                            {post.description}
                            </p>
                        </div>
                        <div id="details-container" className=" flex flex-col justify-start items-start w-[20%] h-full">
                            <div id="rating-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Ratings</h2>
                                <Stars rating={post.ratings}/>
                            </div>
                            <div id="technologies-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Technologies</h2>
                                <div className="flex flex-row">
                                    {post.tags.map((tag) => (
                                        <Tag tag={tag} key={tag.name}/>
                                    ))}
                                </div>
                            </div>
                            <div id="communication-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Communication</h2>
                                <div className="flex flex-row">
                                    {post.technologies.map((tag) => (
                                        <Tag tag={tag} key={tag.name}/>
                                    ))}
                                </div>
                            </div>
                            <div id="owner-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Original Poster</h2>
                                <a>{"test"}</a>
                            </div>
                            <div id="contact-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <button src={"test"} className="bg-logo-blue text-2xl text-white font-bold w-full h-[70%] py-2 px-4 rounded-md">
                                    Contact
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </main>
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
    // console.log(stars)
    
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
                <img src="/IconsStarFilled.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0'></img>
            </div>
        )
    }
    return (
        <div className="flex flex-row justify-center items-center">
            <img src="/IconsStar.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0'></img>
        </div>
    )
}