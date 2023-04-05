import SideNav from "@/components/SideNav/SideNav";

export default function SearchPage() {
    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-center my-10'>
                <h1 className="text-6xl font-bold text-black">Search</h1>
                <div className="relative flex flex-row justify-start items-center w-full h-16 rounded-lg border-2 border-[#D3D3D3] px-2 mt-10">
                    <img src="/Search.svg" alt="Search" className="h-[60%] ml-2 mr-4"/>
                    <input type="text" name="search" placeholder="Search for any project!" className="border-1 border-white w-full"/>
                </div>
                <div className="flex flex-row w-full justify-end items-center mt-5">
                    <button className="bg-logo-lblue rounded-lg px-5 py-2 text-lg font-bold text-white mr-1">
                        Filter
                    </button>
                    <button className="bg-logo-blue rounded-lg px-5 py-2 text-lg font-bold text-white ml-1">
                        Search
                    </button>
                </div>
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
            </div>
            <img src="http://placekitten.com/800/600" className="z-0 w-fit h-fit rounded-lg"></img>
        </div>
    )
}