import anime from "animejs"
import { useEffect } from "react"

const Landing = () => {

    useEffect(() => {
        var HeaderTimeline = anime.timeline({
            easing: 'easeOutExpo',
            duration: 750,
        });
    }, [])


    return (
        <div className='relative bg-black w-full h-full'>
            <div className="absolute w-full"><LandingHeaderBar /></div>
            <div className="relative w-full h-full flex justify-center items-center flex-col">
                <p className="landing-title text-white text-[5.25rem] font-semibold leading-relaxed">
                    Get Your Next <br />
                    <span>Python</span>
                    <span>React</span>
                    _______________ Project
                </p>
                
            </div>
            
        </div>
    )
}

const LandingHeaderBar = () => {
    return (
        <div className="flex flex-row relative w-full p-2">
            <span className="font-bold text-2xl text-logo-blue">ProjMatch</span>
            <div className="ml-auto space-x-3">
                <button className="bg-blue px-4 pt-1 pb-2 rounded-full text-white font-bold text-center">Log In</button>
                <button className="bg-logo-blue px-4 pt-1 pb-2 rounded-full text-white font-bold text-center">Sign Up</button>
            </div>
        </div>
    )
}


export default Landing