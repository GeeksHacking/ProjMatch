import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"

export default function Home() {

    console.log("Home Page")
    const { user, error, isLoading } = useUser();
    console.log(user)

    return (
        <main className='relative w-full h-full flex flex-row'>
            <div className="h-screen fixed z-20">
                <SideNav />
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                <Project />
                <Project />
                <Project />
            </div>
        </main>
    )
}

function Project(){

    const projectTags = [
        {"Name": "JS","Color": "JS"},
        {"Name": "React","Color": "React"},
        {"Name": "Discord","Color": "Discord"},
        {"Name": "Email","Color": "Email"},
    ]

    return (
        <div id='project-container' className="flex relative w-3/5 h-[70%] my-10 flex-col">
            <div id="owner-profile" class="flex justify-start items-center absolute bg-logo-blue/[0.6] w-fit h-[12%] bottom-[30.7%] z-10 rounded-tr-2xl rounded-bl-2xl">
                <a className={`ml-4 flex items-center flex-row space-x-2`}>
                    <img src="/NavBarIcons/IconsProfile.jpg" alt="logo" className='drop-shadow-custom w-14 h-14 flex-shrink-0 rounded-full'></img>
                    <div className="flex items-start flex-col">
                        <span className='ml-3 mr-6 font-bold text-lg text-white translate-y-0.5'> MrJohnDoe </span>
                    </div>
                </a>
            </div>
            <div id="gridscroll" className="relative w-full h-[70%] overflow-x-scroll overflow-y-hidden whitespace-nowrap rounded-l-3xl">
                <img src="http://placekitten.com/900/600" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                </img>
                <img src="http://placekitten.com/901/600" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]">
                </img>
                <img src="http://placekitten.com/900/602" className="w-[90%] h-[99%] inline-block object-cover rounded-2xl">
                </img>
            </div>
            <div id="project-info" className="grow flex flex-col w-[90%]">
                <div className="grow flex flex-row">
                    <h1 className="text-3xl font-bold text-black">Project Name</h1>
                    <div id="Menu" className="grow flex flex-row justify-end">
                        <img src="IconsMenuDots.svg" alt="logo" className='mt-2 w-6 h-6 flex-shrink-0'></img>
                    </div>
                </div>
                <div className="grow flex flex-row">
                    {projectTags.map((tag) => (
                        <Tag tag={tag} key={tag.Name}/>
                    ))}
                    <Stars rating={3}/>
                </div>
                <div className="grow border-2 border-[#D3D3D3] rounded-md flex justify-center items-center text-xl">
                    Find out more!
                </div>
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
    console.log(stars)
    
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

export const getServerSideProps = withPageAuthRequired()