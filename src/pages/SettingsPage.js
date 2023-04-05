import SideNav from "@/components/SideNav/SideNav"
import { useState } from "react"
import Switch from "react-switch";

export default function SettingsPage() {

    const [currentTab, setCurrentTab] = useState('1');
    const [darkMode, setDarkMode] = useState(false);
    const [personalization, setPersonalization] = useState(false);   

    const tabs = [
        {
            id:'1',
            tabTitle:"My Profile",
            content: 
                <div className="flex flex-col justify-start items-start w-full">
                    <h1 className="text-2xl font-bold ">Username</h1>
                    <p className="text-lg text-[#636363]">You can only change your username every 7 days</p>
                    <input type="text" name="projectName" placeholder="New Username" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    
                    <h1 className="text-2xl font-bold mt-6">Email</h1>
                    <p className="text-lg text-[#636363]">example.email@gmail.com</p>
                    <div className="w-[70%] h-fit flex flex-row justify-between">
                        <input type="text" name="projectName" placeholder="New Email" className="w-[80%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                        <input type="text" name="projectName" placeholder="OTP" className="w-[19%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    </div>
                    <input type="submit" value="Get OTP" className="w-[70%] h-11 rounded-md bg-logo-blue text-white text-xl mt-1"></input>
                    
                    <h1 className="text-2xl font-bold mt-6">Phone</h1>
                    <p className="text-lg text-[#636363]">+65 9888 0000</p>
                    <div className="w-[70%] h-fit flex flex-row justify-between">
                        <input type="text" name="projectName" placeholder="New Phone Number" className="w-[80%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                        <input type="text" name="projectName" placeholder="OTP" className="w-[19%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    </div>
                    <input type="submit" value="Get OTP" className="w-[70%] h-11 rounded-md bg-logo-blue text-white text-xl mt-1"></input>
                    
                    <h1 className="text-2xl font-bold mt-6">About Me</h1>
                    <p className="text-lg text-[#636363]">Provide a short description about you and what you do</p>
                    <textarea name="projectDescription" placeholder="Write something about yourself..." className="w-[70%] h-32 rounded-lg border-2 border-[#D3D3D3] px-2 py-1  "/>
                    
                    <h1 className="text-2xl font-bold mt-6">Languages</h1>
                    <p className="text-lg text-[#636363]">Specify the programming languages you are familliar with</p>
                    <input type="text" name="projectName" placeholder="Click to select the languages" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>
                    
                    <h1 className="text-2xl font-bold mt-6">Contact Link</h1>
                    <p className="text-lg text-[#636363]">Place a link people can contact you at</p>
                    <input type="text" name="projectName" placeholder="Click to edit link" className="w-[70%] h-11 rounded-lg border-2 border-[#D3D3D3] px-2 mt-1"/>

                    <input type="submit" value="Update!" className="w-[30%] h-11 rounded-lg bg-logo-blue text-white text-xl mt-10 mb-20"></input>
                </div>

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
                    Contact us at INSERTEMAIL@gmail.com
                    </p>
                </div>
        },
    ]

    const handleTabClick = (e) => {
        setCurrentTab(e.target.id);
    }


    return (
        <div className='absolute flex w-full h-full flex-col'>
            <SideNav/>
            <img src="http://placekitten.com/800/600"id="image-banner" className="z-[-1] absolute w-full h-[20%] bg-logo-blue object-cover border-b-2 border-[#C7C7C7]">
            </img>
            <button className="font-bold text-white text-lg absolute w-fit h-fit right-[3%] top-[23%] bg-[#ED5A5A] px-6 py-3 rounded-md">
                Sign Out
            </button>
            <div className="z-[-1] absolute flex w-[70%] h-[20%] flex-col left-[14%] top-[10%]">
                <div id="pfp-name" className="flex flex-row w-full h-full ">
                    <img src="/NavBarIcons/IconsProfile.jpg" className="rounded-full border-3 border-[#C7C7C7]"></img>
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
                                <TabButton Name={tab}/>
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

function TabButton({Name}) {

    return (
        <div id={Name.id} className="hover:cursor-pointer z-10 relative flex flex-row justify-start items-center w-fit h-full mr-10">
            <p id={Name.id} className="text-xl mx-1">{Name.tabTitle}</p>
            <div id={Name.id} className="absolute w-full h-1 bg-black bottom-0"></div>
        </div>
    )
}