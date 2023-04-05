import SideNav from "@/components/SideNav/SideNav"

export default function ProfilePage() {  
    return (
        <div className='absolute flex w-full h-full flex-col'>
            <SideNav/>
            <img src="http://placekitten.com/800/600"id="image-banner" className="z-[-1] absolute w-full h-[20%] bg-logo-blue object-cover border-b-2 border-[#C7C7C7]">
            </img>
            <div className="z-[-1] absolute flex w-[80%] h-full flex-col left-[14%] top-[10%]">
                <div id="pfp-name" className="flex flex-row w-full h-[20%] ">
                    <img src="/NavBarIcons/IconsProfile.jpg" className="rounded-full border-3 border-[#C7C7C7]"></img>
                    <div className="flex flex-row justify-end items-end h-[80%] ml-5">
                        <h1 className="text-4xl font-bold text-black">John_Doe</h1>
                        <img className="w-7 ml-5" src="/IconsPencil.svg "></img>
                    </div>
                </div>
                <div id="pfp-info" className="flex flex-row w-full h-fit mt-5 justify-between items-start">
                    <div id="pfp-about" className="flex flex-col h-full w-[47%] bg-[#F0F2F4] rounded-lg p-3">
                        <div className="w-full h-fit border-b-2 border-[#DBDBDB]">
                            <h1 className="text-3xl font-bold text-black">Experience</h1>
                            <p className="mt-1 text-lg font-normal text-[#3D3D3D] mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div className="w-full h-fit">
                            <h1 className="text-3xl font-bold text-black mt-2">About Me</h1>
                            <p className="mt-1 text-lg font-normal text-[#3D3D3D]">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                    <div id="pfp-details" className="flex flex-col h-fit w-[47%] bg-[#F0F2F4] rounded-lg p-3">
                        <h1 className="text-3xl font-bold text-black mt-3">Top Langauge</h1>
                        <div className="flex flex-row justify-start items-center w-full h-[15%] mt-3">
                            <Tag tag={{Name: "JS"}}/>
                            <Tag tag={{Name: "React"}}/>
                        </div>
                        <h1 className="text-3xl font-bold text-black mt-5">Location</h1>
                        <p className="text-lg font-normal text-[#3D3D3D]">Singapore, Singapore</p>

                        <button className="mt-20 mb-5 bg-logo-blue text-2xl text-white font-bold w-fit h-fit py-2 px-10 rounded-lg">
                            Contact
                        </button>
                    </div>
                </div>
                <div className='flex w-full h-fit flex-col justify-start items-start mt-20'>
                    <h1 className="text-3xl font-bold text-black">Listed Projects</h1>
                    <div className="w-full h-fit relative grid grid-cols-3 gap-6 mt-4 mb-14">
                        {Array(4).fill().map((_, i) => (
                            <Project key={i}/>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Tag({tag}){
    return (
        <div className={`mr-4 flex flex-row justify-center items-center w-fit h-8 bg-black rounded-full min-w-[62px]`}>
            <span className="mx-4 text-white font-bold text-lg">{tag.Name}</span>
        </div>
    )
}
export function Project() {
    return (
        <div className="z-10 relative w-full aspect-[4/3] flex flex-col justify-center items-center rounded-lg">
            <div className="z-10 absolute bg-white/[0.5] w-full h-1/4 bottom-0 rounded-b-lg px-4 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold">Project Name</h3>
                <p className="text-lg font-light">Swift, SwiftUI</p>
            </div>
            <img src="http://placekitten.com/800/600" className="z-0 w-fit h-fit rounded-lg"></img>
        </div>
    )
}