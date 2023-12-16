import {useEffect, useState} from 'react';
const MobileMessage = () => {
	const [MobileMsg, setMobileMsg]=useState(false)
	const [UserT,setUserT ]=useState(false)
	useEffect(() => {

		function handleResize() {
			if (window.innerWidth/window.innerHeight<1282/975 && !UserT){
				setMobileMsg(true)				
			}else{
				setMobileMsg(false)
			}
		}
		window.addEventListener("resize", handleResize);
		handleResize()
		return()=>window.removeEventListener("resize", handleResize);
    });
	const onclic=()=>{
		console.log("not my fault")
		setUserT(true);
		setMobileMsg(false);
	}
	
    return (
	<div style={{display:((MobileMsg)?"block":"none")}} class="fixed w-screen h-screen z-[100000] backdrop-blur-md" >
	    <div class="absolute w-screen h-screen bg-black opacity-30">
	    </div>
	    <div class="absolute rounded-md p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-sm flex flex-col justify-items-center items-center">
	    <img src="warningIcon.svg" class="w-1/10 h-1/10 py-5 pr-5"></img>
	    <div class="flex flex-col">
	    <p>This website is not design for this aspect ratio. Please use a desktop instead or accept the risks</p>
	   <a
                                        className="group relative m-3 flex grow items-center justify-center overflow-hidden rounded-full bg-logo-blue p-1 text-xl transition-all duration-150"
                                        onClick={onclic}
                                >
                                        <div className=" absolute -inset-full top-0 z-40 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-[rgba(0,0,0,0)] to-light-blue opacity-40 group-active:left-full group-active:duration-500" />
                                        <div className="z-10 flex h-full w-full items-center justify-center rounded-full bg-white duration-150 group-hover:bg-logo-blue group-hover:text-white">
                                                I don't mind
                                        </div>
		</a> 
	    </div>
	    </div>
	</div>
    )
}
export default MobileMessage
