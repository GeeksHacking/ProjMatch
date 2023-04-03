import SideNav from "@/components/SideNav/SideNav";

export default function CreateProject() {
    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-start my-10'>
                <form className="flex flex-col justify-start items-start w-full">
                    <h1 className="text-6xl font-bold text-black">Create Project</h1>
                    <h2 className="text-3xl font-medium mt-10">Project Name</h2>
                    <p className="text-lg mt-1">Choose a name that is simple and easy to remember!</p>
                    <input type="text" name="projectName" placeholder="Enter your project’s name! e.g. AmazingClicker" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                    
                    <h2 className="text-3xl font-medium mt-10">Project Description</h2>
                    <p className="text-lg mt-1">Include important details about what your project is about and more!</p>
                    <textarea name="projectDescription" placeholder="Enter your project’s description!" className="w-[70%] h-32 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                    
                    <h2 className="text-3xl font-medium mt-10">Add Images</h2>
                    <input type="file" name="projectImages"></input>

                    <h2 className="text-3xl font-medium mt-10">Contact</h2>
                    <p className="text-lg mt-1">Insert links or emails to allow the user to contact you</p>
                    <input type="text" name="projectContact" placeholder="Enter your project’s contact! e.g. https://discord.gg/AmazingClicker" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>

                    <h2 className="text-3xl font-medium mt-10">Tags</h2>
                    <p className="text-lg mt-1">Add tags to help users find your project!</p>
                    <input type="text" name="projectTags" placeholder="Enter your project’s tags! e.g. Clicker, Game, Fun" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                
                    <input type="submit" value="Create Project" className="w-[30%] h-11 rounded-full bg-logo-blue text-white text-2xl font-bold mt-10 mb-20"></input>
                </form>
            </div>
        </div>
    )
}