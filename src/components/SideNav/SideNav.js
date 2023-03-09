import { useState } from "react"

// Components Import
import Logo from "./Logo"

const SideNav = () => {

    // Navigation Data
    const navOptions = [{"Page": "Home", "IconPath": "/NavBarIcons/IconsHome.svg"},
                        {"Page": "Search", "IconPath": "/NavBarIcons/IconsSearch.svg"},
                        {"Page": "Saved", "IconPath": "/NavBarIcons/IconsSaved.svg"},
                        {"Page": "Settings", "IconPath": "/NavBarIcons/IconsSettings.svg"},
                        {"Page": "Create", "IconPath": "/NavBarIcons/IconsCreate.svg"}]

    // State Variables
    const [showFullNav, setShowFullNav] = useState(false)

    return (
        <div className="h-full">
            <div className={`sidenav-animate bg-light-blue h-full w-fit flex flex-col ${showFullNav ? "items-left pt-3 pb-3" : " p-3 items-center"}`}  onMouseEnter={() => setShowFullNav(true)} onMouseLeave={() => setShowFullNav(false)}>
                <Logo showFullNav={showFullNav} />
                <div className={`mt-10 ${showFullNav ? "space-y-4" : "space-y-6"}`}>
                    {navOptions.map((option) => (
                        option.Page != "Create" ? <SideNavOptn option={option} showFullNav={showFullNav} key={option.Page} /> : <></>
                    ))}
                </div>
                <div className={`mt-auto space-y-6 ${showFullNav ? "p-3" : ""}`}>
                    <a className={`flex items-center space-x-4 text-light-blue bg-logo-blue w-full h-fit rounded-lg`}>
                        <img src="/NavBarIcons/IconsCreate.svg" alt="logo" className='w-8 h-8 flex-shrink-0 ml-2 my-2'></img>
                        {showFullNav ? <span className='font-bold text-xl flex items-center pb-0.5'> Create </span> : <></>}
                    </a>

                    <a className={`flex items-center flex-row space-x-2`}>
                        <img src="/NavBarIcons/IconsProfile.jpg" alt="logo" className='w-14 h-14 flex-shrink-0 rounded-full border-2 border-logo-blue'></img>
                        {showFullNav ?
                            <div className="flex items-start flex-col">
                                <span className='font-bold text-lg text-logo-blue translate-y-0.5'> MrJohnDoe </span>
                                <span className='font-bold text-lg text-start -translate-y-0.5'> John Doe </span>
                            </div>
                        : <></>}
                        
                    </a>
                </div>
            </div>
        </div>
    )
}
// Side Navigation Options
const SideNavOptn = ({option, showFullNav}) => {

    return (
        <div className={`sidenav-btn pt-2 pb-2 ${showFullNav ? "p-5 pt-3 pb-3" : ""}`}>
            <a className='flex items-center space-x-4 text-logo-blue'>
                <img src={option.IconPath} alt="logo" className='w-8 h-8 flex-shrink-0'></img>
                {showFullNav ? <span className='font-bold text-xl'>{option.Page}</span> : <></>}
            </a>
        </div>
    )
} 

export default SideNav