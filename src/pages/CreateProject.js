import SideNav from "@/components/SideNav/SideNav";
import axios from "axios"
import {useUser} from "@auth0/nextjs-auth0/client"
import { use, useCallback, useEffect, useState } from "react"

export default function CreateProject() {
    const { user, error, isLoading } = useUser();
    const [projMatchUser, setProjMatchUser] = useState({})

    // State Variables
    const [ newProject, setNewProject ] = useState({})

    // API Req
    const getUserWithID = useCallback((authToken, user) => {
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${user.email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                setProjMatchUser(res.data.users[0])
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User with: ", err)
        })
    })

    const createProject = useCallback((authToken, project, user, imageURL) => {
        const API_URL = process.env.API_URL
        console.log(projMatchUser)
        var axiosAPIOptions = {
            method: 'GET',
            url: `${API_URL}/posts`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: {
                "projectName": project.projectName,
                "description": project.projectDescription,
                "creatorUserID": projMatchUser._id,
                "tags": project.projectTags,
                "technologies": project.projectTech,
                "images": imageURL,
            }
        };
    
        axios.request(axiosAPIOptions).then(function (res) {
            if (res.status == 200) {
                console.log(res)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [])

    const createS3Images = useCallback((authToken, newProject, user) => {
        const API_URL = process.env.API_URL

        if (user !== undefined) {

            var formData = new FormData()
            for (let i = 0; i < newProject.projectImages.length; i++) {
                formData.append("files", newProject.projectImages[i])
            }
            formData.append("projectName", newProject.projectName)
            formData.append("creatorUserID", user._id)

            let axiosAPIOptions = {
                method: 'POST',
                url: `${API_URL}/images`,
                url: `${API_URL}/images`,
                headers: {
                    'Authorisation': `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                },
                data: formData
            };

            axios.request(axiosAPIOptions).then(function (res) {
                if (res.status == 200) {
                    const imageURL = res.imageURL
                    createProject(authToken, newProject, user, imageURL)
                } else {
                    throw `Status ${res.status}, ${res.statusText}`
                }
            }).catch(function (err) {
                console.error("Failed to get Posts with: ", err)
            })
        }
    }, [])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        if (newProject !== {}) {
            createS3Images(authToken, newProject, user)
        }

    }, [newProject])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        if (user !== undefined) {
            getUserWithID(authToken, user)
        }
    }, [getUserWithID])

    // Handle Form Submission
    const handleSubmission = (event) => {
        event.preventDefault()

        const projectName = event.target.projectName.value
        const projectDescription = event.target.projectDescription.value
        const projectContact = event.target.projectContact.value
        const projectTags = event.target.projectTags.value
        const projectImages = [...event.target.projectImages.files]
        const projectTech = event.target.projectTech.value

        setNewProject({
            "projectName": projectName,
            "projectDescription": projectDescription,
            "projectContact": projectContact,
            "projectTags": projectTags,
            "projectImages": projectImages,
            "projectTech": projectTech
        })
        console.log(newProject)
    }

    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav/>
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-start my-10'>
                <form className="flex flex-col justify-start items-start w-full" onSubmit={handleSubmission}>
                    <h1 className="text-6xl font-bold text-black">Create Project</h1>
                    <h2 className="text-3xl font-medium mt-10">Project Name</h2>
                    <p className="text-lg mt-1">Choose a name that is simple and easy to remember!</p>
                    <input type="text" id="projectName" name="projectName" placeholder="Enter your project’s name! e.g. AmazingClicker" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                    
                    <h2 className="text-3xl font-medium mt-10">Project Description</h2>
                    <p className="text-lg mt-1">Include important details about what your project is about and more!</p>
                    <textarea id="projectDescription" name="projectDescription" placeholder="Enter your project’s description!" className="w-[70%] h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1"/>
                    
                    <h2 className="text-3xl font-medium mt-10">Add Images</h2>
                    <input id="projectImages" accept="image/*" type="file" name="projectImages" multiple></input>

                    <h2 className="text-3xl font-medium mt-10">Contact</h2>
                    <p className="text-lg mt-1">Insert links or emails to allow the user to contact you</p>
                    <input type="text" name="projectContact" id="projectContact" placeholder="Enter your project’s contact! e.g. https://discord.gg/AmazingClicker" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>

                    <h2 className="text-3xl font-medium mt-10">Tags</h2>
                    <p className="text-lg mt-1">Add tags to help users find your project!</p>
                    <input type="text" name="projectTags" id="projectTags" placeholder="Enter your project’s tags! e.g. Clicker, Game, Fun" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                
                    <h2 className="text-3xl font-medium mt-10">Technologies</h2>
                    <p className="text-lg mt-1">Let users know what Programming Language/Framework you use!</p>
                    <input type="text" name="projectTech" id="projectTech" placeholder="Enter your project’s technologies! e.g. SwiftUI, React, JavaScript" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>

                    <input type="submit" value="Create Project" className="w-[30%] h-11 rounded-full bg-logo-blue text-white text-2xl font-bold mt-10 mb-20"></input>
                </form>
            </div>
        </div>
    )
}