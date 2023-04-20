import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { useEffect, useState } from "react"

async function getPosts(authToken) {
    const API_URL = process.env.API_URL

    var axiosAPIOptions = {
        method: 'GET',
        url: `${API_URL}/posts`,
        headers: {
            'Authorisation': `Bearer ${authToken}`,
        },
        data: new URLSearchParams({
        })
    };

    axios.request(axiosAPIOptions).then(function (res) {
        console.log(res)
    }).catch(function (err) {
        console.error("Failed to get Posts with: ", err)
    })
}

export default function Home() {
    const [projects, setProjects] = useState('');
    const { user, error, isLoading } = useUser();

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }
    
        const postResponse = getPosts(authToken) 

        console.log(postResponse)
    }, [])
        
    return (
        <main className='relative w-full h-full flex flex-row'>
            <div className="h-screen fixed z-20">
                <SideNav />
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                {projects.map(proj=>{
                    <Project 
                        tags={proj[0]} 
                        userPP={proj[1]}
                        un={proj[2]}
                        noStars={proj[3]}
                        images={proj[4]}/>


                }))}
                {/* <Project tags={[{"Name": "JS","Color": "JS"},
                                {"Name": "React","Color": "React"},
                                {"Name": "Discord","Color": "Discord"},
                                {"Name": "Email","Color": "Email"},]} 
                        userPP='/NavBarIcons/IconsProfile.jpg' 
                        un='wow' 
                        noStars={0}
                        images={["http://placekitten.com/900/600","http://placekitten.com/900/600","http://placekitten.com/900/600"]}/> */}
            </div>
        </main>
    )
}

function Project({images, un, userPP, tags, noStars, id}) {
    return (
        <div id='project-container' className="flex relative w-3/5 h-[70%] my-10 flex-col">
            <div id="owner-profile" class="flex justify-start items-center absolute bg-logo-blue/[0.6] w-fit h-[12%] bottom-[30.7%] z-10 rounded-tr-2xl rounded-bl-2xl">
                <a className={`ml-4 flex items-center flex-row space-x-2`}>
                    <img src={userPP} alt="logo" className='drop-shadow-custom w-14 h-14 flex-shrink-0 rounded-full'></img>
                    <div className="flex items-start flex-col">
                        <span className='ml-3 mr-6 font-bold text-lg text-white translate-y-0.5'> {un} </span>
                    </div>
                </a>
            </div>
            <div id="gridscroll" className="relative w-full h-[70%] overflow-x-scroll overflow-y-hidden whitespace-nowrap rounded-l-3xl">
                {images.map((img)=>
                    <img src={img} className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                    </img>
                )}
                {/* <img src="http://placekitten.com/900/600" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                </img>
                <img src="http://placekitten.com/901/601" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                </img>
                <img src="http://placekitten.com/900/602" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl">
                </img> */}
            </div>
            <div id="project-info" className="grow flex flex-col w-[90%]">
                <div className="grow flex flex-row">
                    <h1 className="text-3xl font-bold text-black">Project Name</h1>
                    <div id="Menu" className="grow flex flex-row justify-end">
                        <img src="IconsMenuDots.svg" alt="logo" className='mt-2 w-6 h-6 flex-shrink-0'></img>
                    </div>
                </div>
                <div className="grow flex flex-row">
                    {tags.map((tag) => (
                        <Tag tag={tag} key={tag.Name}/>
                    ))}
                    <Stars rating={noStars}/>
                </div>
                <Link className="grow border-2 border-[#D3D3D3] rounded-md flex justify-center items-center text-xl" href="/ProjectPage">
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
            <span className="mx-4 text-white font-bold text-lg">{tag.Name}</span>
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
                <Star value={value}/>
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