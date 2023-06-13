import SideNav from "@/components/SideNav/SideNav";
import axios from "axios"
import PMApi from "@/components/PMApi/PMApi";
import {useUser} from "@auth0/nextjs-auth0/client"
import { use, useCallback, useEffect, useState } from "react"
import { get } from "animejs";
import { useRouter } from "next/router";
import ImagePicker from "@/components/ImagePicker/ImagePicker";
import Filter from "bad-words"
import approvedTags from "../tags.json";
import { Combobox } from "@headlessui/react";
let api=0
export default function CreateProject() {
    const router = useRouter()

    const { user, error, isLoading } = useUser();
    if (isLoading) return <div>Loading...</div>
    const [projMatchUser, setProjMatchUser] = useState({})

    // State Variables
    const [ newProject, setNewProject ] = useState({})
    const [ newProjID, setNewProjID ] = useState("")
    const [ projectImages, setProjectImages] = useState([])
    const [ tagError, setTagError ] = useState("")
    const [ selectedTags, setSelectedTags ] = useState([])
    const [tagQuery, setTagQuery] = useState("")
    useEffect(()=>{
        api=new PMApi
    },[])

    // API Req
    const createProj=useCallback((newProject,user)=>{
        
        if (user !== undefined && newProject !== {}) {
            var formData = new FormData()
            if (!newProject.projectImages) {
                return
            }
            for (let i = 0; i < newProject.projectImages.length; i++) {
                formData.append("files", newProject.projectImages[i])
            }
            formData.append("projectName", newProject.projectName)
            formData.append("creatorUserID", user._id)
            api.createImgUrl(formData).then(function(res){
                if (res!=-1){
                    const imageURL = res.imageURL
                    api.createPost(
                        newProject.projectName,
                        newProject.projectDescription,
                        user._id,
                        newProject.projectContact,
                        newProject.projectTags,
                        newProject.projectTech,
                        imageURL
                    ).then(function (res){
                        
                        if (res!=-1 && res.insertedProjectWithID !== "") {
                            router.push(`ProjectPage?id=${ res.insertedProjectWithID}`)
                        }
                    })
                }
            })
        }
    },[])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }else{
            api=new PMApi(authToken)
            if (newProject !== {}) {
                api.getUsers({"email":user.email}).then((res) => {
                    if (res !== -1) {
                        createProj(newProject, res.users[0])
                    } else {
                        console.error("ProjMatch User call returned empty or undefined")
                    }
                })
            }
        }   

    }, [newProject])

    useEffect(() => {
        
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }else{
            api.getUsers({email:user.email}).then((res) => {
                setProjMatchUser(res) })
            
        }   
    }, [user])

    // Handle Form Submission
    const handleSubmission = (event) => {
        event.preventDefault()

        const projectName = event.target.projectName.value
        const projectDescription = event.target.projectDescription.value
        const projectContact = event.target.projectContact.value
        //const projectTags = event.target.projectTags.value.replace(/\s/g, '').toLowerCase().split(',')
        const projectTags = selectedTags
        const projectTech = event.target.projectTech.value.replace(/\s/g, '').toLowerCase().split(',')

        if (tagError !== "") {
            alert("Please enter a valid tag")
            return
        }

        setNewProject({
            "projectName": projectName,
            "projectDescription": projectDescription,
            "projectContact": projectContact,
            "projectTags": projectTags,
            "projectImages": projectImages,
            "projectTech": projectTech
        })
    }

    const dataFromPicker = (data) => {
        setProjectImages(data)
    }

    const handleTagChange = (event) => {

        let filter = new Filter({emptyList: true})
        filter.addWords(...approvedTags)

        const tags = event.target.value.replace(/\s/g, '').split(',')
        if (tags.filter((tag) => filter.isProfane(tag)).length !== tags.length) {
            setTagError("Please enter a valid tag")
        } else {
            setTagError("")
        }
    }

    const filteredTags = tagQuery === "" ? approvedTags 
        : approvedTags.filter((tag) => tag.toLowerCase().includes(tagQuery.toLowerCase()))



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
                    <ImagePicker images={[]} sendToParent={dataFromPicker} />
                    <input id="projectImages" accept="image/*" type="file" name="projectImages" hidden multiple></input>

                    <h2 className="text-3xl font-medium mt-10">Contact</h2>
                    <p className="text-lg mt-1">Insert links or emails to allow the user to contact you</p>
                    <input type="text" name="projectContact" id="projectContact" placeholder="Enter your project’s contact! e.g. https://discord.gg/AmazingClicker" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>

                    <h2 className="text-3xl font-medium mt-10">Tags</h2>
                    <p className="text-lg mt-1">Add tags to help users find your project!</p>
                    <Combobox value={selectedTags} onChange={setSelectedTags} multiple name="">
                        <div className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 flex flex-row" >
                            <ul className="flex flex-row justify-start items-center">
                                {selectedTags.map((tag) => (
                                    <li key={Math.random()} className="flex justify-between items-center h-7 w-fit bg-black rounded-full mx-1">
                                        <span className="mx-4 text-white font-light text-base">{tag}</span>
                                    </li>
                                ))}
                            </ul>
                            <Combobox.Input className="ml-2 w-full focus:outline-0" placeholder="Enter your project's tags!" onChange={(e) => setTagQuery(e.target.value)}/>
                        </div>
                        <div className="relative w-[70%]">
                            <Combobox.Options className="absolute w-full bg-white mt-1 border-2 border-logo-blue rounded-lg">
                                {filteredTags.length === 0 && tagQuery !== "" ? (
                                    <p>Nothing found</p>
                                ): (
                                    filteredTags.map((tag) => (
                                        (selectedTags.indexOf(tag) === -1 ) ? 
                                            <Combobox.Option key={Math.random()} value={tag} className="rounded-lg p-2 h-8 bg-white flex flex-row items-center">
                                                <span className="font-light text-base">{tag}</span>
                                            </Combobox.Option>
                                        : <Combobox.Option key={Math.random()} value={tag} className="p-2 h-8 bg-logo-blue flex flex-row items-center">
                                                <span className="text-white font-bold text-base">{tag}</span>
                                            </Combobox.Option>
                                        
                                    ))
                                )}
                                
                            </Combobox.Options>
                        </div>
                        
                    </Combobox>
                    <p className="text-lg mt-1 text-[#ff0000]"><i>{tagError}</i></p>

                    <h2 className="text-3xl font-medium mt-10">Technologies</h2>
                    <p className="text-lg mt-1">Let users know what Programming Language/Framework you use!</p>
                    <input type="text" name="projectTech" id="projectTech" placeholder="Enter your project’s technologies! e.g. SwiftUI, React, JavaScript" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2"/>
                    

                    <input type="submit" value="Create Project" className="w-[30%] h-11 rounded-full bg-logo-blue text-white text-2xl font-bold mt-10 mb-20"></input>
                </form>
            </div>
        </div>
    )
}
