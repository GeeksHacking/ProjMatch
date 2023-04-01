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
            <a class="button" id="SignOutBtn">Sign out</a>
        </div>
        <Tabs>
        <div label="My Profile">
        </div>
        <div label="Web Settings">
        </div>
        <div label="Privacy">
        </div>
        <div label="Security">
         <a class="updater button">Update!</a>
        </div>
        <div label="Support">
         <p>Any questions? Feature request or problems? Contact us at <a href="mailto:INSERTEMAIL@gmail.com">INSERTEMAIL@gmail.com</a></p>

        </div>
      </Tabs> 
       </div>
    </div>
    )
}

export default Settings
