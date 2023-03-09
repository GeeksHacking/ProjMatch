import Logo from "./Logo"
import HomeIcon from "./HomeIcon"
import SearchIcon from "./SearchIcon"
import SavedIcon from "./SavedIcon"
import SettingsIcon from "./SettingsIcon"
import CreateIcon from "./CreateIcon"
import ProfileIcon from "./ProfileIcon"

const SideNav = (isActive) => {
    return (
        <div className="h-full">
            {isActive ? <ExpandedSideNav /> : <MinimisedSideNav />}
        </div>
    )
}

// Minimised SideNav
const MinimisedSideNav = () => {
    return (
        <div className={`bg-light-blue h-full`}>
            <Logo />
        </div>
    )
}

// Expanded SideNav
const ExpandedSideNav = () => {
    return (
        <div className={`bg-light-blue h-full w-fit p-4 flex flex-col items-left `}>
            <Logo />
            <div className="mt-10">
                <ul>
                    <li className="mt-7 pl-2"><HomeIcon /></li>
                    <li className="mt-7 pl-2"><SearchIcon /></li>
                    <li className="mt-7 pl-2"><SavedIcon /></li>
                    <li className="mt-7 pl-2"><SettingsIcon /></li>
                </ul>
            </div>
            <div className="mt-auto">
                <ul>
                    <li className=""><CreateIcon /></li>
                    <li className="mt-4"><ProfileIcon /></li>
                </ul>
            </div>
        </div>
    )
}

export default SideNav