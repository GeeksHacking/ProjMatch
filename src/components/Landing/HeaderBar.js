import Link from "next/link"

export default function HeaderBar() {
    return (
        <div className="flex flex-row relative w-full p-2 z-50">
            <span className="font-bold text-2xl text-logo-blue">ProjMatch</span>
            <div className="ml-auto space-x-3">
                <button className="bg-light-blue p-2 rounded-lg text-white font-bold">
                    <Link href={{pathname: "/pages/Landing/UserEntry", query: "login"}}>
                        Log In
                    </Link>
                </button>
                <button className="bg-light-blue p-2 rounded-lg text-white font-bold">
                    <Link href={{pathname: "/pages/Landing/UserEntry", query: "signup"}}>
                        Sign Up
                    </Link>
                </button>
            </div>
        </div>
    )
}