import Logo from "./Logo"

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
        <div className={`bg-light-blue h-full`}>
            <Logo />
        </div>
    )
}

export default SideNav