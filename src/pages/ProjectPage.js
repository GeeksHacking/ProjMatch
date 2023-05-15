import SideNav from "@/components/SideNav/SideNav";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link'
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import axios from "axios"
import { use, useCallback, useEffect, useState } from "react"
import { useRouter } from 'next/router'


export default function ProjectPage() {
    const router = useRouter()
    const { id } = router.query
    const [ post, setPost ] = useState([]);
    const [ postReq, setPostReq ] = useState([]);
    const [ ouser, setUser ] = useState([]);
    const { user, error, isLoading } = useUser();
    const [ userContact, setUserContact ] = useState("");
    const [ pmUser, setPMUser ] = useState({})
    const [ showShareToolTip, setShowShareToolTip ] = useState(false)
    const [ showPopup, setShowPopup ] = useState(false)
    const [ showDoneReport, setShowDoneReport ] = useState(false)

    const getUserFromEmail = useCallback(async (authToken, email) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        }

        let res = await axios.request(apiOptions)
        .catch(function (err) {
            console.error("Failed to get User with: ", err)
        })
        if (res.status == 200) {
            return res.data.users[0]
        } else {
            throw `Status ${res.status}, ${res.statusText}`
        }
    }, [])

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
                setPostReq(res)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    }, [id])

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
                setUser(res.data.users[0])
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Posts with: ", err)
        })
    })

    const checkUserExistWithEmail = useCallback(async (authToken, email) => {
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                const responseData = res.data
                if (responseData.users.length === 0) { // No user with email found, hence create user
                    createUserWithEmail(authToken, user)
                }
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User Existance with: ", err)
        })
    })

    const updateUser = useCallback(async (authToken, updateUser, user) => {
        const API_URL = process.env.API_URL
        const options = {
            method: 'PUT',
            url: `${API_URL}/users`,
            headers: {
                "Authorisation": `Bearer ${authToken}`,
            },
            data: {
                "id": user._id,
                "update": updateUser
            }
        }

        axios.request(options).then(function (res) {
            if (res.status == 200) {
                getUserFromEmail(authToken, user.regEmail).then((user) => {
                    setPMUser(user)
                })
                
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User with: ", err)
        })
    }, [])

    const createUserWithEmail = async (authToken, user) => {
        const API_URL = process.env.API_URL

        var apiOptions = {
            method: 'POST',
            url: `${API_URL}/users`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: {
                "username": user.nickname,
                "rlName": user.name,
                "regEmail": user.email,
                "regPhone": 0
            }
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                return res
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get Create User with: ", err)
        })
    }

    useEffect(() => {
        // Check if the user exists. If not, create a new user for this user
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }

        if (user !== undefined) {
            checkUserExistWithEmail(authToken, user.email).then((res) => {
            })
        }
    }, [checkUserExistWithEmail])

    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("Authorisation Token returned Undefined.")
        }
        
        getPosts(authToken)
        .catch(console.error)
    }, [getPosts])
        
    useEffect(() => {
        if (user === undefined) {
            return
        }
        try {
            const authToken = localStorage.getItem("authorisation_token")

            if (authToken === undefined) {
                console.error("Authorisation Token returned Undefined.")
            }
            getUserFromEmail(authToken, user.email).then((res) => {
                setPMUser(res)
            })
            getUserWithID(postReq.data.posts[0].creatorUserID)
            setPost(postReq.data.posts[0])
            if (post.contact !== undefined) {
                if (String(post.contact).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                    setUserContact("mailto:"+post.contact)
                } else if (String(post.contact).match(/^\d{10}$/)) {
                    setUserContact("tel:"+post.contact)
                } else {
                    setUserContact(post.contact)
                }
            }
        } catch (err) { }
    }, [postReq])

    if (post.length === 0) {
        return (
            <></>
        )
    }

    const deleteProject = async (authToken, id) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'DELETE',
            url: `${API_URL}/posts`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: {
                "id": id
            }
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User Existance with: ", err)
        })
    }

    const handleDelete = () => {
        const authToken = localStorage.getItem("authorisation_token")
        deleteProject(authToken, id)
        router.push("http://localhost:3000/Home")
    }

    const handleSavedClick = () => {
        const authToken = localStorage.getItem("authorisation_token")


        if (pmUser.savedPosts.includes(post._id)) {
            const savedPosts = pmUser.savedPosts.filter((savedPost) => savedPost !== post._id)
            const updateData = {
                "savedPosts": savedPosts
            }
            updateUser(authToken, updateData, pmUser)

        } else {
            
            const savedPosts = []
            if (pmUser.savedPosts !== undefined) {
                for (let i = 0; i < pmUser.savedPosts.length; i++) {
                    savedPosts.push(pmUser.savedPosts[i])
                }
            }
            savedPosts.push(post._id)
            const updateData = {
                "savedPosts": savedPosts
            }
            updateUser(authToken, updateData, pmUser)
        }
    }

    const handleToolTip = () => {
        setShowShareToolTip(true)
        navigator.clipboard.writeText("http://localhost:3000/ProjectPage?id="+post._id)
    }

    const handlePopup = () => {
        setShowPopup(true)
    }

    const handleReport = (e) => {
        e.preventDefault()
        const authToken = localStorage.getItem("authorisation_token")
        const reportData = e.target.reportArea.value
        const reporterName = pmUser.username
        const reporterID = pmUser._id
        const projectID = post._id

        const emailData = {
            "subject": `[ProjMatch] Report on Project '${post.projectName}'`,
            "text": `Reporter Name: ${reporterName}\nReporter ID: ${reporterID}\nProject ID: ${projectID}\n\nReport: \n${reportData}`
        }

        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'POST',
            url: `${API_URL}/email`,
            data: emailData
        }

        axios.request(apiOptions).then(function (res) {
            if (res.status == 200) {
                setShowPopup(false)
                setShowDoneReport(true)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        });
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if (!user) return <div>Not logged in</div>;

    return (
        <main className='relative w-full h-full flex flex-row'>
            <div className="h-screen fixed z-20">
                <SideNav />
            </div>
            <div className='absolute flex w-full h-full flex-col justify-start items-center'>
                <div id="project-details-container" className="flex relative w-2/3 h-[95%] my-10 flex-col">
                    <div id="gridscroll" className="relative w-full h-[50%] overflow-x-scroll overflow-y-hidden whitespace-nowrap rounded-l-3xl">
                        {((post.images)? post.images:["https://placekitten.com/200/300","https://placekitten.com/200/300"]).map((img)=>
                            <img src={img} className="w-[90%] h-[99%] inline-block object-cover rounded-2xl mr-[15px]" key={Math.random()}>
                            </img>
                        )}
                    </div>
                    <div id="title-menu-container" className="flex w-full h-[7%] flex-row">
                        <div id="title-container" className="flex flex-row justify-start items-center w-[40%] h-full">
                            <h1 className="text-3xl font-bold text-black">{post.projectName}</h1>
                        </div>
                        <div id="menu-container" className="flex flex-row justify-end items-center w-[60%] h-full space-x-3">
                            {pmUser._id === postReq.data.posts[0].creatorUserID ? 
                            <div className="space-x-3">
                                <button className="bg-delete-red text-white px-2 py-1 rounded-md" onClick={handleDelete}>Delete Project</button>
                                <button className="bg-edit-green text-white px-2 py-1 rounded-md" onClick={() => router.push(`http://localhost:3000/EditProject?id=${post._id}`)}>Edit Project</button>
                            </div>
                            : <></>}

                            <img src="/IconsFlag.svg" alt="logo" className='mx-1 w-6 h-6 flex-shrink-0' onClick={handlePopup}></img>
                            <Popup trigger={showPopup} setTrigger={setShowPopup}>
                                <form className="w-[90%] flex flex-col justify-center items-center" onSubmit={handleReport}>
                                    <h1 className="text-2xl font-bold">Report this project</h1>
                                    <p className="text-lg text-[#636363]">Enter the reason for reporting this project</p>
                                    <textarea name="reportArea" placeholder="Enter the reason here" className="w-full h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1 mt-5"></textarea>
                                    <input type="submit" value="Submit" className="bg-logo-blue text-white px-3 py-1 text-lg rounded-md mt-5"></input>
                                </form>
                            </Popup>
                            <Popup trigger={showDoneReport} setTrigger={setShowDoneReport}>
                                <h1 className="text-2xl text-logo-blue">Thank You For Reporting!</h1>
                                <p className="text-lg text-black">We will be checking on this project soon.</p>    
                            </Popup>
                            <div className="relative mx-1 w-6 h-6" onClick={handleToolTip} onMouseLeave={() => setShowShareToolTip(false)}>
                                <img src="/IconsShare.svg" alt="logo" className='w-full h-full flex-shrink-0 hover:cursor-pointer' >
                                </img>
                                <Tooltip trigger={showShareToolTip}></Tooltip>
                            </div>
                            
                            <button className="p-1 mx-1 w-6 h-6 flex flex-shrink-0 justify-center items-center" onClick={handleSavedClick}>
                            {pmUser.savedPosts !== undefined ? (pmUser.savedPosts.includes(post._id) ? <img src="NavBarIcons/IconsSaved.svg" alt="logo" className='w-full w-full flex-shrink-0'></img>: <img src="NavBarIcons/IconsSaved.svg" alt="logo" className='w-full w-full flex-shrink-0 invert'></img> ) : <img src="NavBarIcons/IconsSaved.svg" alt="logo" className='w-full w-full flex-shrink-0 invert'></img>}
                            </button>
                            
                            
                        </div>
                    </div>
                    <div id="description-details-container" className="flex w-full h-[40%] flex-row">
                        <div id="description-container" className="flex flex-col justify-start items-start w-[80%] h-full p-5">
                            <h1 className="text-2xl font-bold text-black">Description</h1>
                            <p className="text-lg font-normal text-black">
                            {post.description}
                            </p>
                        </div>
                        <div id="details-container" className=" flex flex-col justify-start items-start w-[20%] h-full">
                            <div id="rating-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Ratings</h2>
                                <Stars rating={post.ratings}/>
                            </div>
                            <div id="technologies-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Technologies</h2>
                                <div className="flex flex-row">
                                    {post.tags.map((tag) => (
                                        <Tag tag={tag} key={tag.name}/>
                                    ))}
                                </div>
                            </div>
                            <div id="communication-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Communication</h2>
                                <div className="flex flex-row">
                                    {post.technologies.map((tag) => (
                                        <Tag tag={tag} key={tag.name}/>
                                    ))}
                                </div>
                            </div>
                            <div id="owner-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <h2 className="text-xl font-bold text-black">Original Poster</h2>
                                <a>{ouser.username}</a>
                            </div>
                            <div id="contact-container" className="flex flex-col w-full h-1/5 justify-center items-start">
                                <a href={userContact} target="_blank" className="bg-logo-blue text-2xl text-white font-bold w-full h-[70%] py-2 px-4 rounded-md">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </main>
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

function Tooltip(props){
    
    return ( props.trigger ) ? (
        <div className="absolute top-[-70px] left-[-90px] flex flex-col justify-center items-center w-[200px] h-[50px] bg-black rounded-md">
            <p className="text-white font-bold text-base">Link Copied!</p>
        </div>
    ) : "";
}

function Popup(props) {
    return (props.trigger) ? (
        <div className="z-[10] fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative bg-white w-[500px] h-[500px] flex flex-col justify-center items-center rounded-md">
                {props.children}
                <button className="absolute top-4 right-4 text-sm bg-logo-blue text-center p-2 rounded-md text-white" onClick={() => props.setTrigger(false)}>Close</button>
            </div>
        </div>
    ) : "";
}