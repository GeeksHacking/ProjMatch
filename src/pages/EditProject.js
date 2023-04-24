import SideNav from "@/components/SideNav/SideNav"
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import { useRouter } from 'next/router'

export default function EditProject() {
    const router = useRouter()
    const { id } = router.query
    const [ post, setPost ] = useState(
        {
            "projectName": "Loading...",
            "description": "Loading...",
            "creatorUserID": "Loading...",
            "rating": "Loading...",
            "tags": ["Loading..."],
            "technologies": ["Loading..."],
            "images": ["Loading..."],
            "contact": ["Loading..."],
            "isArchived": false
        }
    );
    const [ changedProj, setChangedProj ] = useState({})
    const { user, error, isLoading } = useUser();
    
    // API Requests
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
                setPost(res.data.posts[0])
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [id])

    const updatePosts = useCallback(async (authToken, updatedProj) => {
        const API_URL = process.env.API_URL
        if (id === undefined) {
            return
        }

        if (changedProj === {}) {
            console.error("Nothing Changed")
        }

        const options = {
            method: 'PUT',
            url: `${API_URL}/posts`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: {
                "id": id,
                "update": updatedProj
            }
        }

        axios.request(options).then(function (res) {
            if (res.status == 200) {
                console.log(res)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [id])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }
        
        getPosts(authToken)
        .catch(console.error)
    }, [getPosts])

    // Handle Form Submission
    const handleSubmission = (event) => {
        event.preventDefault()

        const projectName = post.projectName
        const projectDescription = event.target.projectDescription.value
        const projectContact = event.target.projectContact.value
        const projectTags = event.target.projectTags.value.replace(/\s/g, '').split(',')
        const projectImages = [...event.target.projectImages.files]
        const projectTech = event.target.projectTech.value.replace(/\s/g, '').split(',')
        
        const temp = {
            "projectName": projectName,
            "description": projectDescription,
            "contact": projectContact,
            "tags": projectTags,
            "images": projectImages,
            "technologies": projectTech
        }

        let tempUpdatedProj = []
        if (temp !== undefined) {
            const keys = ["projectName", "description", "contact", "tags", "technologies", "images"]
            for(let i = 0; i < keys.length; i++) {
                if (JSON.stringify(post[keys[i]]) !== JSON.stringify(temp[keys[i]])) {
                    console.log(JSON.stringify(temp[keys[i]]))
                    tempUpdatedProj[keys[i]] = temp[keys[i]]
                }
            }
        }
        setChangedProj(tempUpdatedProj)
        console.log(tempUpdatedProj)
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        updatePosts(authToken, tempUpdatedProj)
    }

    return (
        <div className='absolute flex w-full h-full flex-col justify-start items-center'>
            <SideNav />
            <div className='absolute flex w-[70%] h-full flex-col justify-start items-start my-10'>
                <form className="flex flex-col justify-start items-start w-full" onSubmit={handleSubmission}>
                    <h1 className="text-6xl font-bold text-black">Edit Project</h1>
                    <h2 className="text-3xl font-medium mt-10">Project Name</h2>
                    <p className="text-lg mt-1">Choose a name that is simple and easy to remember!</p>
                    <input disabled type="text" name="projectName" placeholder={`${post.projectName}`} className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2" />

                    <h2 className="text-3xl font-medium mt-10">Project Description</h2>
                    <p className="text-lg mt-1">Include important details about what your project is about and more!</p>
                    <textarea disabled={post.description === "Loading..." ? true : false} name="projectDescription" defaultValue={`${post.description}`} className="w-[70%] h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1" />

                    <h2 className="text-3xl font-medium mt-10">Add Images</h2>
                    <input type="file" name="projectImages"></input>

                    <h2 className="text-3xl font-medium mt-10">Contact</h2>
                    <p className="text-lg mt-1">Insert links or emails to allow the user to contact you</p>
                    <input type="text" disabled={post.contact === "Loading..." ? true : false} name="projectContact" defaultValue={`${post.contact}`} className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2" />

                    <h2 className="text-3xl font-medium mt-10">Tags</h2>
                    <p className="text-lg mt-1">Add tags to help users find your project!</p>
                    <input type="text" disabled={post.tags.join(", ") === "Loading..." ? true : false} name="projectTags" defaultValue={`${post.tags.join(", ")}`} className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2" />

                    <h2 className="text-3xl font-medium mt-10">Technologies</h2>
                    <p className="text-lg mt-1">Let users know what Programming Language/Framework you use!</p>
                    <input type="text" disabled={post.technologies.join(", ") === "Loading..." ? true : false} name="projectTech" id="projectTech" defaultValue={`${post.technologies.join(", ")}`} className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2" />

                    <input type="submit" defaultValue="Edit Project" className="w-[30%] h-11 rounded-full bg-logo-blue text-white text-2xl font-bold mt-10 mb-20"></input>
                </form>
            </div>
        </div>
    )
}