import MaxSideNav from './MaxSideNav'
import MiniSideNav from './MiniSideNav'

const SideNav = () => {


    return (
        <div className="nav-container relative h-full">
            <MiniSideNav/>
            <MaxSideNav/>
        </div>
    )
}
// Side Navigation Options
export default SideNav