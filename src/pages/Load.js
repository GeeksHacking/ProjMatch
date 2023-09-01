import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import PMApi from "@/components/PMApi/PMApi";
import axios from "axios";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// API
let api

export default function Load() {
    // State Variables
    const { user, error, isLoading } = useUser(); // Auth0 User
	const { storedToken, setStoredToken } = useState(false)
	if (isLoading) return <div>Loading...</div>; // Check if data is still being loaded
    const router = useRouter()

    // On Load, instanciate the API
    useEffect(() => {
        const authToken = localStorage.getItem("authorisation_token")
        if (authToken === undefined) {
            console.error("Authorisation token returned null")
        }

        api = new PMApi(authToken)
    }, [])

    // Get Auth Token
	const storeAuthToken = async (accessToken) => {
		try {
			// const response = await axios.request(apiOptions)
			const response = await axios.get(`${process.env.API_URL}/authtoken`, {
				params: {
					accessToken: accessToken
				}
			})

			const token = response.data.token

			if (token.includes("ey")) {
				await axios.get(`/api/setCookie?name=authorisation_token&value=${token}`)
				setStoredToken(true)
			} else {
				throw new Error("Token does not fit valid format")
			}
		} catch (err) {
			console.error(`Getting Authorisation Token failed with ${err}`)
		}
	}

	useEffect(() => {
		if (!router.isReady) return;
		const query = router.query;
		if (
			query != undefined &&
			!storedToken
		) {
			storeAuthToken(query.code);
		}
	}, [router.isReady, router.query]);

    useEffect(() => {
        async function checkUserExists() {
			if (user !== undefined) {
                // Check if the user exists in ProjMatch DB
                api.getUsers({email: user.email}).then((res) => {
                    if (res !== -1) {
                        if (res.totalUsers === 1) {
							router.push("Home")
						} else {
							router.push("Onboarding")
						}
                    } else {
						router.push("Onboarding")
					}
                })
            }
        }

        checkUserExists()
    }, [isLoading])

    return (
        <div>

        </div>
    )
}

export const getServerSideProps = withPageAuthRequired();