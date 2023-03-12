// Components Import
import Logo from "./Logo"

const MiniSideNav = () => {

    // Navigation Data
    const navOptions = [{"Page": "Home", "IconPath": "/NavBarIcons/IconsHome.svg"},
                        {"Page": "Search", "IconPath": "/NavBarIcons/IconsSearch.svg"},
                        {"Page": "Saved", "IconPath": "/NavBarIcons/IconsSaved.svg"},
                        {"Page": "Settings", "IconPath": "/NavBarIcons/IconsSettings.svg"},
                        {"Page": "Create", "IconPath": "/NavBarIcons/IconsCreate.svg"}]

    // State Variables
    

    return (
        <div className="mini-nav absolute z-10 h-full">
            <div className={`bg-light-blue h-full w-fit flex flex-col items-left pt-3 pb-3`}>
                <Logo fullSideNav={false}/>
                <div className={`mt-10 space-y-4`}>
                    <ul className={`space-y-4`}>
                        {navOptions.map((option) => (
                            option.Page != "Create" ? <SideNavOptn option={option} key={option.Page} /> : <></>
                        ))}
                    </ul>
                </div>
                <div className={`mt-auto space-y-6 p-3`}>
                    <a className={`flex items-center space-x-4 text-light-blue bg-logo-blue w-full h-fit rounded-lg`}>
                        <img src="/NavBarIcons/IconsCreate.svg" alt="logo" className='w-8 h-8 flex-shrink-0 ml-[0.6875rem] my-2'></img>
                        {/* <span className='font-bold text-xl flex items-center pb-0.5'> Create </span> */}
                    </a>

                    <a className={`flex items-center flex-row space-x-2`}>
                        <img src="/NavBarIcons/IconsProfile.jpg" alt="logo" className='w-14 h-14 flex-shrink-0 rounded-full border-2 border-logo-blue'></img>
                        {/* <div className="flex items-start flex-col">
                            <span className='font-bold text-lg text-logo-blue translate-y-0.5'> MrJohnDoe </span>
                            <span className='font-bold text-lg text-start -translate-y-0.5'> John Doe </span>
                        </div> */}
                        
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
                {/* <span className='font-bold text-xl'>{option.Page}</span> */}
            </a>
        </div>
    )
} 

export default MiniSideNav