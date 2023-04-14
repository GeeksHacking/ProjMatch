import Link from "next/link"

export default function HeaderBar() {
    return (
        <div className="flex flex-row relative w-full p-2 z-50">
            <span className="font-bold text-2xl text-logo-blue">ProjMatch</span>
            <div className="ml-auto space-x-3">
                <button className="bg-logo-lblue p-2 rounded-lg text-white font-bold">
                    <Link href={`https://projmatch.us.auth0.com/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=undefined`}>
                        Log In
                    </Link>
                </button>
                <button className="bg-logo-blue p-2 rounded-lg text-white font-bold">
                    <Link href={`https://projmatch.us.auth0.com/authorize?response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=undefined`}>
                        Sign Up
                    </Link>
                </button>
            </div>
        </div>
    )
}