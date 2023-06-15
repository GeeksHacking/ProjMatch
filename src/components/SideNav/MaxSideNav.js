// Components Import
import { useEffect, useState, useCallback } from "react";
import PMApi from "@/components/PMApi/PMApi"
import Logo from "./Logo"
import styles from './SideNav.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link'
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0"
import axios from "axios"
import { useRouter } from 'next/router'
let api=0
const MaxSideNav = () => {
    const { user, error, isLoading } = useUser();
    const [userInfo, setUserInfo] = useState(null)
    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")
        if (authToken === undefined) {
        
            console.error("Authorisation Token returned Undefined.")
	}else if (user !== undefined) {
	    api=new PMApi(authToken)
            const API_URL = process.env.API_URL
            api.getUsers({"email":user.email}).then((res) => {
		if (res!=-1){
			console.log(res)
                	setUserInfo(res.users[0])
		}
            })
        }
        
    }, [user, setUserInfo])

    // Navigation Data
    const navOptions = [{"Page": "Home", "IconPath": "/NavBarIcons/IconsHome.svg", "PageLink": "/Home"},
                        {"Page": "Search", "IconPath": "/NavBarIcons/IconsSearch.svg", "PageLink": "/SearchPage"},
                        {"Page": "Saved", "IconPath": "/NavBarIcons/IconsSaved.svg", "PageLink": "/SavedProjects"},
                        {"Page": "Settings", "IconPath": "/NavBarIcons/IconsSettings.svg", "PageLink": "/SettingsPage"},
                        {"Page": "Create", "IconPath": "/NavBarIcons/IconsCreate.svg", "PageLink": "/CreateProject"}]

    // State Variables

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if (!user) return <div>Not logged in</div>;
    if (userInfo === null) return <div>Loading...</div>;
    
    return (
        <div className={`fixed z-0 top-0 left-0 h-full w-fit`}>
            <div className={`${styles.SideNav} bg-light-blue h-full w-fit flex flex-col items-left pt-3 pb-3`}>
                <Link className={`flex items-center space-x-2 text-logo-blue pl-3 pr-3`} href="/">
                    <img src="/logo/Final.svg" alt="logo" className='w-12 h-12 flex-shrink-0 rounded-md'></img>
                    <span className={`${styles.SideNavTxt} font-bold text-xl`}> ProjMatch </span>
                </Link>
                <div className={`mt-10 space-y-4`}>
                    <ul className={`space-y-4`} key={Math.random()}>
                        {navOptions.map((option) => (
                            option.Page != "Create" ? <SideNavOptn option={option} key={Math.random()} /> : <></>
                        ))}
                    </ul>
                </div>
                
                <div className={`mt-auto space-y-6 p-3`}>
                    <Link className={`flex items-center space-x-4 text-light-blue bg-logo-blue ${styles.create_button} h-fit rounded-lg`} href="/CreateProject">
                        <img src="/NavBarIcons/IconsCreate.svg" alt="logo" className='w-8 h-8 flex-shrink-0 ml-[0.6875rem] my-2'></img>
                        <span className={`${styles.SideNavTxt} font-bold text-xl flex items-center pb-0.5`}> Create </span>
                    </Link>

                    <Link className={`flex items-center flex-row space-x-2`} href={"/ProfilePage?id=" + userInfo._id}>
                        <img src={userInfo.userDat.profilePic} alt="logo" className='w-14 h-14 flex-shrink-0 rounded-full border-2 border-logo-blue'></img>
                        <div className="flex items-start flex-col">
                            <span className={`${styles.SideNavTxt} font-bold text-lg text-logo-blue translate-y-0.5`}> {userInfo.username} </span>
                            <span className={`${styles.SideNavTxt} font-bold text-lg text-start -translate-y-0.5`}> {userInfo.rlName} </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
// Side Navigation Options
const SideNavOptn = ({option}) => {

    return (
        <div className={`sidenav-btn pt-2 pb-2 p-5 pt-3 pb-3`}>
            <Link className='flex items-center space-x-4 text-logo-blue' href={option.PageLink}>
                <img src={option.IconPath} alt="logo" className='w-8 h-8 flex-shrink-0'></img>
                <span className={`font-bold text-xl ${styles.SideNavTxt}`}>{option.Page}</span>
            </Link>
        </div>
    )
} 

export default MaxSideNav
