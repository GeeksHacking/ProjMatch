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

	// Why is this the name of the onClick function.. i cant be bothered so im not fixing it
	const onclic = () => {
		setUserT(true);
		setMobileMsg(false);
	}
	
    return (
		<div style={{display:((MobileMsg)?"block":"none")}} class="fixed w-screen h-screen z-[100000] backdrop-blur-md" >
			<div class="absolute w-screen h-screen bg-black opacity-30"></div>
			<div class="absolute rounded-md p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-sm flex flex-col justify-items-center items-center">
				<img src="warningIcon.svg" class="w-1/10 h-1/10"></img>
				<div class="flex flex-col text-center">
					<p className='my-5'>This website is not design for this aspect ratio. Please use a desktop instead or accept the risks.</p>
					<a
 						className="border-logo-blue border-2 rounded-full p-1 text-center hover:bg-logo-blue hover:text-white duration-300 cursor-pointer" 
						onClick={onclic}
					>
						It's fine
					</a>
				</div>
			</div>
		</div>
    )
}
export default MobileMessage
