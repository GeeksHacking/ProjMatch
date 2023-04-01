import anime from "animejs"
import { useEffect } from "react"

const Landing = () => {

    useEffect(() => {

        const pythonTimeline = anime.timeline(
            {
            easing: "easeOutExpo",
            loop: false,
            }
        )

        pythonTimeline.add({
            targets: "#word",
            opacity: [0,1],
            translateY: [40, 0],
            translateX: ["-50%", "-50%"],
            rotateX: [-90, 0],
            color: ["#FFFFFF", "#FEAE00"],
            duration: 1300,
        }, 1000)
        pythonTimeline.add({
            targets: "#blank",
            color: ["#FFFFFF", "#FEAE00"],
            duration: 1300,
        }, 1000)
        pythonTimeline.add({
            targets: "#word",
            opacity: [1,0],
            translateY: [0, -40],
            translateX: ["-50%", "-50%"],
            rotateX: [0, -90],
            color: ["#FEAE00", "#FFFFFF"],
            duration: 1300,
        }, 3000)
        pythonTimeline.add({
            targets: "#blank",
            color: ["#FEAE00", "#FFFFFF"],
            duration: 1300,
        }, 3000)
        
        const ReactTimeline = anime.timeline(
        {
            easing: "easeOutExpo",
            loop: false,
        }
        )

        setInterval(() => {
            document.getElementById("word").innerHTML = "Python"
            pythonTimeline.play()
        }, 5 * 1000)
    }, [])

    return (
        <div className='relative bg-black w-full h-full'>
            <div className="absolute w-full"><LandingHeaderBar /></div>
            <div className="App">
                <p className='header'>
                    Get Your Next
                    <br />
                    <span id="blank">___________ Project</span>
                    <span className="word" id="word"></span>
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