import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import { useRouter } from 'next/router'

export default function ProfilePage() {
    const router = useRouter()
    const { id } = router.query
    const { user, error, isLoading } = useUser()
    const [profileUser, setProfileUser] = useState(null)

    const getUserWithID = useCallback(async (uid) => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users/?id=${uid}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }
        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                console.log(res.data.users[0])
                setProfileUser(res.data.users[0])
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    })

    useEffect(() => {
        if (id !== undefined) {
            getUserWithID(id)

        }
    }, [id])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if (!user) return <div>Not logged in</div>;
    if (profileUser === null) return <div>Loading...</div>

    return (
        <div className='absolute flex w-full h-full flex-col'>
            <SideNav/>
            <img src="http://placekitten.com/800/600"id="image-banner" className="z-[-1] absolute w-full h-[20%] bg-logo-blue object-cover border-b-2 border-[#C7C7C7]"></img>
            <div className="z-[-1] absolute flex w-[70%] h-[20%] flex-col left-[14%] top-[10%]">
                <div id="pfp-name" className="flex flex-row w-full h-full ">
                    <img src="/NavBarIcons/IconsProfile.jpg" className="rounded-full border-3 border-[#C7C7C7]"></img>
                    <div className="flex flex-col justify-end items-start h-[90%] ml-5">
                        <h1 className="text-4xl font-bold text-black">{profileUser.username}</h1>
                        <h3 className="text-xl text-logo-blue">{profileUser.rlName}</h3>
                    </div>
                </div>
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                <div id="project-details-container" className="flex relative w-2/3 my-10 flex-col">
                    <div id="description-details-container" className="flex w-full h-[40vh] flex-row mt-[25%]">
                        <div id="description-container" className="flex flex-col justify-start items-start w-[80%] h-full p-5">
                            <div id="experience-container" className="flex flex-col justify-start items-start w-full h-[30%]">
                                <h1>Experience</h1>
                                <p>
                                    {profileUser.experience == null ? "No Experience" : profileUser.experience}
                                </p>
                            </div>
                            <div id="About-container" className="flex flex-col justify-start items-start w-full h-[65%]">
                                <h1>About Me</h1>
                                <p className="w-full overflow-y-auto overflow-x-hidden whitespace-normal break-words	">
                                    {profileUser.aboutMe == null ? "No About" : profileUser.aboutMe}
                                </p>
                            </div>
                        </div>
                        <div id="details-container" className=" flex flex-col justify-start items-start w-[20%] h-full">
                            <div id="rating-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Ratings</h2>
                                <Stars rating={3}/>
                            </div>
                            <div id="technologies-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Technologies</h2>
                                <div className="flex flex-row">
                                    {["Swift", "Python"].map((tag) => (
                                        <Tag tag={tag} key={Math.random()}/>
                                    ))}
                                </div>
                            </div>
                            <div id="contact-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <a href="" className="bg-logo-blue text-2xl text-white font-bold w-full h-[70%] py-2 px-4 rounded-md">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                    <div id="projects-container" className="flex flex-col w-full">
                        <h1 className="text-3xl font-bold text-black">Projects</h1>
                        <div className="w-full h-fit relative grid grid-cols-3 gap-4 my-5">
                            {Array(9).fill().map((_, i) => (
                                <Project key={i}/>
                            ))}
                        </div>
                    </div>
                </div>
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

export function Project() {
    return (
        <div className="z-10 relative w-full aspect-[4/2] flex flex-col justify-center items-center rounded-lg">
            <div className="z-10 absolute bg-white/[0.5] w-full h-1/4 bottom-0 rounded-b-lg px-4 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold">Project Name</h3>
                <p className="text-lg font-light">Swift, SwiftUI</p>
                {/* <div className="z-20 absolute bg-logo-lblue aspect-square rounded-lg flex justify-center items-center right-10">
                    <img src="/NavBarIcons/IconsSaved.svg" className="w-5 mx-3.5"></img>
                </div> */}
            </div>
            <img src="http://placekitten.com/800/600" className="z-0 w-fit h-fit rounded-lg"></img>
        </div>
    )
}