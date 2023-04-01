import Link from "next/link"
import { useMediaQuery } from "react-responsive"
// Components
import SideInfoBar from "@/components/UserEntry/SideInfoBar"

const SignUp = () => {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

    return (
        <div className="flex flex-row w-full h-full">
            {isMobile ? <></> : <SideInfoBar />}

            <div className="flex w-2/3 items-center">
                <div>
                    <h1>Login</h1>
                    <span>Don't have an account? <Link className="text-logo-blue" href="/SignUp">Sign Up</Link></span>
                </div>
            </div>
        </div>
    )
}

export default SignUp