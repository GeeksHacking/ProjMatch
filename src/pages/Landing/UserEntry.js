import { useRouter } from "next/router"

const UserEntry = () => {

    const router = useRouter()
    const type = router.query

    return (
        <div className="flex flex-row w-full h-full">
            <div className="w-1/3 h-full bg-logo-blue">
                <h2>

                </h2>

                <p>

                </p>
            </div>

            <div className="w-2/3">
                {type == "signup" ? <SignUp /> : <LogIn />}
            </div>
        </div>
    )
}

// Sign Up Screen
const SignUp = () => {
    return (
        <div>

        </div>
    )
}

// Login Screen
const LogIn = () => {
    return (
        <div>

        </div>
    )
}

export default UserEntry