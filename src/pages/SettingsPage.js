import SideNav from "@/components/SideNav/SideNav"
import { useCallback, useEffect, useState } from "react"
import Switch from "react-switch";
import Link from "next/link";
import axios from "axios"
import { useRouter } from 'next/router'
import {useUser} from "@auth0/nextjs-auth0/client"

export default function SettingsPage() {

    const { user, error, isLoading } = useUser();
    const [projMatchUser, setProjMatchUser] = useState(null)
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState('1');
    const [darkMode, setDarkMode] = useState(false);
    const [personalization, setPersonalization] = useState(false);
    const [ userData, setUserData ] = useState({
        "aboutMe": "Loading...",
        "contactLink": "Loading...",
        "rlName": "Loading...",
        "profileBanner": "Loading...",
        "profilePic": "Loading...",
        "username": "Loading...",
    });
    const [popupDisplay, setPopupDisplay] = useState(false);

    const getUserWithEmail = useCallback(async (authToken, user) => {
        const API_URL = process.env.API_URL
        var apiOptions = {
            method: 'GET',
            url: `${API_URL}/users?email=${user.email}`,
            headers: {
                'Authorisation': `Bearer ${authToken}`,
            },
            data: new URLSearchParams({ })
        };
        let res = await axios.request(apiOptions)
        .catch(function (err) {
            console.error("Failed to get User with: ", err)
        });
        if (res.status == 200) {
            setProjMatchUser(res.data.users[0])
        } else {
            throw `Status ${res.status}, ${res.statusText}`
        }
    }, [])

    const createS3Images = useCallback((authToken, data, user) => {
        const API_URL = process.env.API_URL

        if (user !== undefined) {

            var formData = new FormData()
            formData.append("files", data.profileBanner)
            formData.append("files", data.profilePic)
            formData.append("creatorUserID", user._id)

            let axiosAPIOptions = {
                method: 'POST',
                url: `${API_URL}/images`,
                headers: {
                    'Authorisation': `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                },
                data: formData
            };

            axios.request(axiosAPIOptions).then(function (res) {
                if (res.status == 200) {
                    const imageURL = res.data.imageURL
                    const bannerURL = imageURL[0]
                    const profilePicURL = imageURL[1]

                    const tempData = {
                        ...data,
                        "userDat": {
                            "profileBanner": bannerURL,
                            "profilePic": profilePicURL
                        }
                    }
                    updateUser(authToken, tempData, user)
                    return imageURL
                } else {
                    throw `Status ${res.status}, ${res.statusText}`
                }
            }).catch(function (err) {
                console.error("Failed to get Posts with: ", err)
            })
        }
    }, [])

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
                router.push(`ProfilePage?id=${user._id}`)
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User with: ", err)
        })
    }, [])

    const handleTabClick = (e) => {
        setCurrentTab(e.target.id);
    }
    const handleSignOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('authorisation_token');
        router.push('api/auth/logout');
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const userName = e.target.userName.value;
        const aboutMe = e.target.aboutMe.value;
        const rlName = e.target.rlName.value;
        const contactLink = e.target.contactLink.value;
        const profileBanner = e.target.profileBannerInput.files[0];
        const profilePic = e.target.profilePicInput.files[0];

        const UpdatedData = ({
            ...userData,
            "username": userName,
            "aboutMe": aboutMe,
            "rlName": rlName,
            "contactLink": contactLink,
            "profileBanner": profileBanner,
            "profilePic": profilePic
        })

        const authToken = localStorage.getItem("authorisation_token")
        let userDataArray = Object.values(userData)
        userDataArray.splice(4,2)
        let UpdatedDataArray = Object.values(UpdatedData)
        UpdatedDataArray.splice(4,2)
        if (userDataArray.every((val, index) => val === UpdatedDataArray[index])){
            return
        }

        if (authToken === undefined) {
            return
        }
        if (profileBanner || profilePic) {
            createS3Images(authToken, UpdatedData, projMatchUser)
        } else {
            updateUser(authToken, UpdatedData, projMatchUser)
        }

    }
    const handleImageButton = (e) => {
        e.preventDefault();
        if (e.target.id == "profilePic") {
            document.getElementById("profilePicInput").click()
        } else if (e.target.id == "profileBanner") {
            document.getElementById("profileBannerInput").click()
        }
    }
    const handlePicImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const fileURL = URL.createObjectURL(file);
        if (e.target.id == "profilePicInput") {
            setUserData({
                ...userData,
                "profilePic": fileURL
            })
        } else if (e.target.id == "profileBannerInput") {
            setUserData({
                ...userData,
                "profileBanner": fileURL
            })
        }
    }

    const handleEmail = (e) => {
        e.preventDefault();

        const name = e.target.emailName.value;
        const email = e.target.emailEmail.value;
        const message = e.target.emailBody.value;

        const emailData = {
            "subject": `[ProjMatch] Feedback from ${name}`,
            "text": `From: ${email}\n\n${message}`
        }

        const API_URL = process.env.API_URL
        const options = {
            method: 'POST',
            url: `${API_URL}/email`,
            data: emailData
        }
        axios.request(options).then(function (res) {
            if (res.status == 200) {
            } else {
                throw `Status ${res.status}, ${res.statusText}`
            }
        }).catch(function (err) {
            console.error("Failed to get User with: ", err)
        })

        setPopupDisplay(true)

        e.target.emailName.value = "";
        e.target.emailEmail.value = "";
        e.target.emailBody.value = "";
        

    }


    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")

        if (authToken === undefined) {
            console.error("No token found")
        }
        if (user !== null && user !== undefined) {
            getUserWithEmail(authToken, user);
        }
    }, [user])

    useEffect(() => {
        if (projMatchUser !== null) {
            setUserData({
                "aboutMe": projMatchUser.aboutMe,
                "regEmail": projMatchUser.regEmail,
                "contactLink": projMatchUser.contactLink,
                "rlName": projMatchUser.rlName,
                "profileBanner": projMatchUser.userDat.profileBanner,
                "profilePic": projMatchUser.userDat.profilePic,
                "username": projMatchUser.username,
            })
        }
    }, [projMatchUser])


    const tabs = [
        {
            id:'1',
            tabTitle:"My Profile",
            content: 
                <form className="flex flex-col justify-start items-start w-full" onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold ">Username</h1>
                    <p className="text-lg text-[#636363]">You can only change your username every 7 days</p>
                    <input type="text" name="userName" defaultValue={userData.username !== "Loading..." ? userData.username : ""} placeholder="New Username" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    
                    <h1 className="text-2xl font-bold mt-6">Name</h1>
                    <input type="text" name="rlName" defaultValue={userData.rlName !== "Loading..." ? userData.rlName : ""} placeholder="New Name" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>

                    <h1 className="text-2xl font-bold mt-6">Email</h1>
                    <p className="text-lg text-[#636363]"><i>This input will not update your email yet</i></p>
                    <div className="w-[70%] h-fit flex flex-row justify-between">
                        <input type="text" name="regEmail" defaultValue={userData.regEmail !== "Loading..." ? userData.regEmail : ""} placeholder="New Email" className="w-full h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    </div>


                    <h1 className="text-2xl font-bold mt-6">Contact Link</h1>
                    <input type="text" name="contactLink" defaultValue={userData.contactLink !== "Loading..." ? userData.contactLink : ""} placeholder="Add Contact Link" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>

                    <h1 className="text-2xl font-bold mt-6">About Me</h1>
                    <p className="text-lg text-[#636363]">Provide a short description about you and what you do</p>
                    <textarea name="aboutMe" defaultValue={userData.aboutMe !== "Loading..." ? userData.aboutMe : ""} placeholder="Write something about yourself..." className="w-[70%] h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1  "/>

                    <h1 className="text-2xl font-bold mt-6">Profile Picture</h1>
                    <div className="flex flex-row w-[70%] h-36 justify-start items-center">
                        {userData.profilePic !== "Loading..." && userData.profilePic !== "" ? <img src={userData.profilePic} className="w-32 h-32 rounded-full mt-2 object-center object-cover border-3 border-[#C7C7C7]"/> : <div className="w-32 h-32 rounded-full mt-2 bg-[#D3D3D3] border-3 border-[#C7C7C7]"></div>}
                        <button id="profilePic" className="w-32 h-11 rounded-md bg-logo-blue text-white text-xl mt-1 ml-4" onClick={handleImageButton}>Add images</button>
                        <input type="file" id="profilePicInput" name="profilePic" className="hidden" onChange={handlePicImageChange}/>
                    </div>
                    <h1 className="text-2xl font-bold mt-6">Profile Banner</h1>
                    <div className="flex flex-col w-[70%] h-fit justify-center items-start">
                        {userData.profileBanner !== "Loading..." && userData.profileBanner !== "" ? <img src={userData.profileBanner} className="w-full h-36 mt-2 object-center object-cover border-3 border-[#C7C7C7]"/> : <div className="w-full h-36 mt-2 bg-[#D3D3D3] border-3 border-[#C7C7C7]"></div>}
                        <button id="profileBanner" className="w-full h-11 rounded-md bg-logo-blue text-white text-xl mt-1" onClick={handleImageButton}>Add images</button>
                        <input type="file" id="profileBannerInput" name="profilePic" className="hidden" onChange={handlePicImageChange}/>
                    </div>
                    
                    <input type="submit" value="Update!" className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-10 mb-20"></input>
                </form>

        },
        {
            id:'2',
            tabTitle:"Web Settings",
            content:
                <div className="flex flex-col justify-start items-start w-full">
                    <h1 className="text-2xl font-bold ">Theme</h1>
                    <p className="text-lg text-[#636363]">Choose from Light and Dark Mode</p>
                    <Switch onChange = {() => setDarkMode(!darkMode)} 
                            checked={darkMode} 
                            onColor="#ADB5BD"
                            onHandleColor="#E9ECEF"
                            offColor="#ADB5BD"
                            offHandleColor="#212529"
                            handleDiameter={30}
                            uncheckedIcon={
                                <div className="w-full h-full flex flex-row justify-center items-center">
                                    <img className="h-[50%]" src="/IconsMoon.svg"/>
                                </div>
                            }
                            checkedIcon={
                                <div className="w-full h-full flex flex-row justify-center items-center">
                                    <img className="h-[50%]" src="/IconsSun.svg"/>
                                </div>
                            }
                            height={25}
                            width={50}
                    />
                </div>
        },
        {
            id:'3',
            tabTitle:"Privacy",
            content:
                <div className="flex flex-col justify-start items-start w-full">
                    <h1 className="text-2xl font-bold ">Personalization</h1>
                    <p className="text-lg text-[#636363]">Gives us permission to collect your data to serve you better</p>
                    <Switch onChange = {() => setPersonalization(!personalization)}
                            checked={personalization}
                            onColor="#39529D"
                            onHandleColor="#CED4DA"
                            offHandleColor="#CED4DA"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={20}
                            width={50}
                    />
                    <input type="submit" value="Update!" className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-10 mb-20"></input>
                </div>
        },
        {
            id:'4',
            tabTitle:"Security",
            content:
                <div className="flex flex-col justify-start items-start w-full">
                    <h1 className="text-2xl font-bold ">Change Password</h1>
                    <p className="text-lg text-[#636363]">Your password cannot be the same as the last one</p>
                    <input type="text" name="projectName" placeholder="Current Password" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    <input type="text" name="projectName" placeholder="New Password" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    <input type="text" name="projectName" placeholder="Confirm New Password" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    <input type="submit" value="Update!" className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-1 mb-20"></input>

                    <input type="submit" value="Delete Account" className="w-[30%] h-11 rounded-full bg-[#ED5A5A] text-white text-xl mt-30"></input>
                    <input type="submit" value="Sign Out On All Devices" className="w-[30%] h-11 rounded-full bg-[#ED5A5A] text-white text-xl mt-2 mb-10"></input>
                </div>
        },
        {
            id:'5',
            tabTitle:"Support",
            content:
                <div className="flex flex-col justify-start items-start w-full">
                    <p className="text-xl text-[#636363]">
                    Any questions? Feature request or problems?
                    <br>
                    </br>
                    Fill in this feedback form here and we will get back to you as soon as possible!
                    </p>
                    <form className="mt-10 w-[60%]" onSubmit={handleEmail}>
                        <p className="text-lg text-black font-medium">Your Name</p>
                        <input type="text" name="emailName" placeholder="Enter your name here" className="w-full h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>

                        <p className="text-lg text-black font-medium mt-5">Your Email</p>
                        <p className="text-base text-[#636363] font-light"><i>This is so that we can contact you in the future for further information</i></p>
                        <input type="text" name="emailEmail" placeholder="Enter your email here" className="w-full h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>

                        <p className="text-lg text-black font-medium mt-5">The content</p>
                        <p className="text-base text-[#636363] font-light"><i>Try to keep it short and simple. We will follow up with you if needed</i></p>
                        <textarea name="emailBody" placeholder="Write the issues/feedbacks/bugs you had here..." className="w-full h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1 mt-1"/>

                        <input type="submit" value="Send Email" className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-5 mb-20"></input>
                    </form>
                    <Popup trigger={popupDisplay} setTrigger={setPopupDisplay}>
                        <h1>Your email has been sent!</h1>
                    </Popup>
                </div>
        },
    ];


    return (
        <div className='absolute flex w-full h-full flex-col'>
            <SideNav/>
            {userData.profileBanner !== "" && userData.profileBanner !== "Loading..." ? <img src={userData.profileBanner} id="image-banner" className="z-[-1] absolute w-full h-[20%] bg-logo-blue object-cover border-b-2 border-[#C7C7C7]"></img>: <div className="z-[-1] absolute w-full h-[20%] bg-logo-blue object-cover border-b-2 border-[#C7C7C7]"></div>}
            <button onClick={handleSignOut} className="font-bold text-white text-lg absolute w-fit h-fit right-[3%] top-[23%] bg-[#ED5A5A] px-6 py-3 rounded-md">
                Sign Out
            </button>
            <div className="z-[-1] absolute flex w-[70%] h-[20%] flex-col left-[14%] top-[10%]">
                <div id="pfp-name" className="flex flex-row w-full h-full ">
                    {userData.profilePic !== "" && userData.profilePic !== "Loading..." ? <img src={userData.profilePic} className="rounded-full border-3 border-[#C7C7C7]"></img>:  <div className="rounded-full border-3 border-[#C7C7C7]"></div>}
                    <div className="flex flex-col justify-end items-start h-[90%] ml-5">
                        <h1 className="text-4xl font-bold text-black">Settings</h1>
                        <h3 className="text-xl text-logo-blue">John_Doe</h3>
                    </div>
                </div>
            </div>
            <div className="z-[10] absolute flex w-screen h-fit flex-col top-[33%] items-center">
                <div id="bar" className="absolute w-full h-0.5 bg-[#D2D2D2] top-[3rem] -translate-y-0.5"></div>
                <div id="main-body" className="relative w-[72%] h-fit flex flex-col">
                    <div id="tabs-bar" className="flex flex-row justify-start items-center w-full h-[3rem]">
                        {tabs.map((tab) => (
                            <button id={tab.id} className="h-full" onClick={handleTabClick} disabled={currentTab === `${tab.id}`}>
                                <TabButton tab={tab} selected={currentTab === `${tab.id}`}/>
                            </button>
                        ))}
                    </div>
                    <div id="tabs-content" className="relative w-full h-[95%] mt-4">
                        {tabs.map((tab) => (
                            <div id={tab.id} className="w-full h-full" hidden={currentTab !== `${tab.id}`}>
                                {tab.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TabButton(props) {
    if (props.selected) {
        return (
            <div id={props.tab.id} className="z-10 relative flex flex-row justify-start items-center w-fit h-full mr-10">
                <p id={props.tab.id} className="text-xl mx-1 text-black">{props.tab.tabTitle}</p>
                <div id={props.tab.id} className="absolute w-full h-1 bg-black bottom-0"></div>
            </div>
        )
    }
    else {
        return (
            <div id={props.tab.id} className="hover:cursor-pointer z-10 relative flex flex-row justify-start items-center w-fit h-full mr-10">
                <p id={props.tab.id} className="text-xl mx-1 text-[#B5B4B4]">{props.tab.tabTitle}</p>
            </div>
        )
    }
}

function Popup(props) {
    return (props.trigger) ? (
        <div className="w-full fixed top-0 left-0 h-full flex flex-col justify-center items-center bg-[#000000dd] z-[2000]">
            <div className="w-[50%] h-[50%] bg-white flex flex-col justify-center items-center">
                {props.children}
                <button className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-5 mb-20" onClick={() => props.setTrigger(false)}>Close</button>
            </div>
        </div>
    ) : "";
}
