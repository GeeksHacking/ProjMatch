// Components Import
import Logo from "./Logo"
import styles from './SideNav.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link'

const MaxSideNav = () => {
    const { user, error, isLoading } = useUser();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    console.log(user.picture)

    // Navigation Data
    const navOptions = [{"Page": "Home", "IconPath": "/NavBarIcons/IconsHome.svg"},
                        {"Page": "Search", "IconPath": "/NavBarIcons/IconsSearch.svg"},
                        {"Page": "Saved", "IconPath": "/NavBarIcons/IconsSaved.svg"},
                        {"Page": "Settings", "IconPath": "/NavBarIcons/IconsSettings.svg"},
                        {"Page": "Create", "IconPath": "/NavBarIcons/IconsCreate.svg"}]

    // State Variables
    
    return (
        <div className={`fixed z-0 top-0 left-0 h-full w-fit`}>
            <div className={`${styles.SideNav} bg-light-blue h-full w-fit flex flex-col items-left pt-3 pb-3`}>
                <a className={`flex items-center space-x-2 text-logo-blue pl-3 pr-3`}>
                   <img src="/logo.svg" alt="logo" className='w-12 h-12 flex-shrink-0'></img>
                   <span className={`${styles.SideNavTxt} font-bold text-xl`}> ProjMatch </span>
                </a>
                <div className={`mt-10 space-y-4`}>
                    <ul className={`space-y-4`}>
                        {navOptions.map((option) => (
                            option.Page != "Create" ? <SideNavOptn option={option} key={option.Page} /> : <></>
                        ))}
                    </ul>
                </div>
                
                <div className={`mt-auto space-y-6 p-3`}>
                    <Link className={`flex items-center space-x-4 text-light-blue bg-logo-blue w-full h-fit rounded-lg`} href="/CreateProject">
                        <img src="/NavBarIcons/IconsCreate.svg" alt="logo" className='w-8 h-8 flex-shrink-0 ml-[0.6875rem] my-2'></img>
                        <span className={`${styles.SideNavTxt} font-bold text-xl flex items-center pb-0.5`}> Create </span>
                    </Link>

                    <a className={`flex items-center flex-row space-x-2`}>
                        <img src={user.picture} alt="logo" className='w-14 h-14 flex-shrink-0 rounded-full border-2 border-logo-blue'></img>
                        <div className="flex items-start flex-col">
                            <span className={`${styles.SideNavTxt} font-bold text-lg text-logo-blue translate-y-0.5`}> {user.nickname} </span>
                            <span className={`${styles.SideNavTxt} font-bold text-lg text-start -translate-y-0.5`}> {user.name} </span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}
// Side Navigation Options
const SideNavOptn = ({option}) => {

    return (
        <div className={`sidenav-btn pt-2 pb-2 p-5 pt-3 pb-3`}>
            <a className='flex items-center space-x-4 text-logo-blue'>
                <img src={option.IconPath} alt="logo" className='w-8 h-8 flex-shrink-0'></img>
                <span className={`font-bold text-xl ${styles.SideNavTxt}`}>{option.Page}</span>
            </a>
        </div>
    )
} 

export default MaxSideNav
