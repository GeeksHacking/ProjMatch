import anime from "animejs"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router";

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

        let animationInterval = setInterval(() => {
            document.getElementById("word").innerHTML = "Python"
            pythonTimeline.play()
        }, 5 * 1000)

        return () => {
            clearInterval(animationInterval)
        }

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

    const router = useRouter()

    const storeAuthToken = async (accessToken) => {
        var apiOptions = {
            method: 'POST',
            url: 'https://projmatch.us.auth0.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                code: accessToken,
                audience: process.env.AUTH0_AUDIENCE,
                redirect_uri: "http://localhost:3000/Home"
            })
        };

        axios.request(apiOptions).then(function (res) {
            const responseBody = res.data
            localStorage.setItem("authorisation_token", responseBody["access_token"])
        }).catch(function (err) {
            console.error("Failed to get API Authentication Token with: ", err)
        })
    }

    useEffect(() => {
        if(!router.isReady) return;
        const query = router.query
        if (query != undefined) {
            storeAuthToken(query.code)
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex flex-row relative w-full p-2">
            <Link href="/Home" className="hover:scale-105 duration-500">
                <span className="font-bold text-2xl text-logo-blue">ProjMatch</span>
            </Link>
            <div className="ml-auto space-x-3">
                <Link href={`https://projmatch.us.auth0.com/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=http://localhost:3000`} className="">
                    <button className="bg-blue px-4 pt-1 pb-2 rounded-full text-white font-bold text-center hover:scale-105 duration-500">
                        Log In
                    </button>
                </Link>
                <Link href="/SignUp">
                    <button className="bg-logo-blue px-4 pt-1 pb-2 rounded-full text-white font-bold text-center hover:scale-105 duration-500">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    )
}


export default Landing