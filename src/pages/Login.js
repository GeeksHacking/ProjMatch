import Link from "next/link"
import { useMediaQuery } from "react-responsive"
// Components
import SideInfoBar from "@/components/UserEntry/SideInfoBar"

const Login = () => {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

    return (
        <div className="flex flex-row w-full h-full">
            {isMobile ? <></> : <SideInfoBar />}

            <div className="pl-6 pr-6 flex w-2/3 items-center">
                <div>
                    <h1 className="font-medium text-3xl">Login</h1>
                    <span>Don't have an account? <Link className="text-logo-blue" href="/SignUp">Sign Up</Link></span>
                </div>

                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Login