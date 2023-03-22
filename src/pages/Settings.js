import Link from "next/link"
import { useMediaQuery } from "react-responsive"
// Components
import SideNav from "@/components/SideNav/SideNav.js"
import Tabs from "@/components/Tabs/Tabs.js"

const Settings = () => {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const settingsPages={
      
    }

    return (
    <div>
       <SideNav/> 
       <div>
        <img src="" id="Banner"></img>
        <div> 
            
        </div>
        <Tabs>
        <div label="Gator">
          See ya later, <em>Alligator</em>!
        </div>
        <div label="Croc">
          After 'while, <em>Crocodile</em>!
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
