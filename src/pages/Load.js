import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import PMApi from "@/components/PMApi/PMApi";
import axios from "axios";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import CircularLoader from "@/components/CircularLoader/CircularLoader";

// API
let api

export default function Load() {
    // State Variables
    const { user, error, isLoading } = useUser(); // Auth0 User
    const router = useRouter()

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
			if (response.status === 200) {
				await axios.get(`/api/setCookie?name=authorisation_token&value=${token}`)
				sessionStorage.setItem('token', token)
			} else {
				throw new Error("Token does not fit valid format")
			}
		} catch (err) {
			console.error(`Getting Authorisation Token failed with ${err}`)
		}
	}

	// Check for Users
	const checkForUser = async (email) => {
		const response = await api.getUsers({ email: email })
		
		if (response !== -1 && response.totalUsers === 1) {
			router.push("Home")
		} else {
			router.push("Onboarding")
		}
	}

	useEffect(() => {
		// Get Auth0 Authorisation Code and Check for User
		const query = router.query
		storeAuthToken(query.code)
	}, [])

	useEffect(() => {
		const intervalCheck = setInterval(async () => {
			if (sessionStorage.token) {
				// Initalise PMApi
				if (api === undefined) {
					api = new PMApi(sessionStorage.token)
				}

				// Call PM Users API
				if (user !== undefined && !isLoading) {
					await checkForUser(user.email)
					clearInterval(intervalCheck)
				}
			}
		}, 1000)
	}, [isLoading])

    return (
        <main className="h-full w-full absolute">
			<div className="h-screen flex items-center justify-center">
				<div>
					<h2 className="text-3xl font-medium pb-10">Getting <span className="text-logo-blue">ProjMatch</span> ready for you!</h2>
					<CircularLoader />
				</div>
			</div>
		</main>
    )
}

export const getServerSideProps = withPageAuthRequired();
