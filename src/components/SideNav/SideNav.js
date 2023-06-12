import MaxSideNav from './MaxSideNav'
import styles from './SideNav.module.css'

const SideNav = () => {

    return (
        <div className={`z-[1000] w-fit relative h-full`} data-testid="navbar">
            <MaxSideNav/>
        </div>
    )
}
// Side Navigation Options
export default SideNav
