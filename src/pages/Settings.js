import Link from "next/link"
import { useMediaQuery } from "react-responsive"
// Components
import SideNav from "@/components/SideNav/SideNav.js"
import Tabs from "@/components/Tabs/Tabs.js"

const Settings = () => {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
      

    return (
    <div>
       <SideNav/>
       <div class="MainDiv">
        <img src="/BannerTemp.jpg" id="Banner"></img>
        <div id="ProfileText">
        <img src="/PPTemp.jpg" id="SettingsPP"></img>
        <div id="TitleText">
           <h1>Settings</h1>
           <h2>John Doe</h2>
        </div>
        </div>
        <div id="SignOutDiv">
            <a class="button" id="SignOutBtn">Sign Up</a>
        </div>
        <Tabs>
        <div label="Gator">
          See ya later, <em>Alligator</em>!
        </div>
        <div label="Croc">
          After awhile, <em>Crocodile</em>!
        </div>
        <div label="Sarcosuchus">
          Nothing to see here, this tab is <em>extinct</em>!
        </div>
      </Tabs> 
       </div>
    </div>
    )
}

export default Settings
