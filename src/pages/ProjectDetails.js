
import Link from "next/link"
import { useMediaQuery } from "react-responsive"
// Components
import SideNav from "@/components/SideNav/SideNav.js"
import { useState } from 'react';

const ProjectDetails = (Title,Id,) => {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
      

    return (
    <div>
      <SideNav/>
      <div id="MainDiv">
         <div id="MainBanner">
         </div>
         <div id="ProjTitle">
            <h1>the best project you have ever seen</h1>
            <div id="Icons"></div>
         </div>
         <div id="Details">
         <div id="Description"></div>
         <div id="Ratings"></div>
         </div>
      </div>
    </div>
    )
}

export default ProjectDetails
