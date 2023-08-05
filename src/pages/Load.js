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
		var apiOptions = {
			method: "POST",
			url: "https://projmatch.us.auth0.com/oauth/token",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
			data: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: process.env.OAUTH_ID,
				client_secret: process.env.OAUTH_SECRET,
				audience: process.env.AUTH0_AUDIENCE,
				code: accessToken,
				redirect_uri: `${process.env.AUTH0_BASE_URL}/Load`,
			}),
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				const responseBody = res.data;
				localStorage.setItem(
					"authorisation_token",
					responseBody["access_token"]
				);
			})
			.catch(function (err) {
				console.error("Failed to get API Authentication Token with: ", err);
			});
	};

	useEffect(() => {
		if (!router.isReady) return;
		const query = router.query;
		if (
			query != undefined &&
			localStorage.getItem("authorisation_token") !== undefined
		) {
			storeAuthToken(query.code);
		}
	}, [router.isReady, router.query]);

    useEffect(() => {
        async function checkUserExists() {
            let isExist = true
            console.log(isLoading)
            console.log(user)
            if (user !== undefined) {
                // Check if the user exists in ProjMatch DB
                api.getUsers({email: user.email}).then((res) => {
                    if (res !== -1) {
                        if (res.totalUsers !== 0) { isExist = false }
                    } else { isExist = false}
                })
        
                if (!isExist) {
                    router.push("Home")
                } else {
                    router.push("Onboarding")
                }
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