import SideNav from "@/components/SideNav/SideNav"

export default function SavedProjects() {
    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-center my-10'>
                <h1 className="text-6xl font-bold text-black">Saved</h1>
                <div className="w-full h-fit relative grid grid-cols-3 gap-6 my-14">
                    {Array(9).fill().map((_, i) => (
                        <Project key={i}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function Project() {
    return (
        <div className="z-10 relative w-full aspect-[4/3] flex flex-col justify-center items-center rounded-lg">
            <div className="z-10 absolute bg-white/[0.5] w-full h-1/4 bottom-0 rounded-b-lg px-4 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold">Project Name</h3>
                <p className="text-lg font-light">Swift, SwiftUI</p>
                <div className="z-20 absolute bg-logo-lblue aspect-square rounded-lg flex justify-center items-center right-10">
                    <img src="/NavBarIcons/IconsSaved.svg" className="w-5 mx-3.5"></img>
                </div>
            </div>
            <img src="http://placekitten.com/800/600" className="z-0 w-fit h-fit rounded-lg"></img>
        </div>
    )
}