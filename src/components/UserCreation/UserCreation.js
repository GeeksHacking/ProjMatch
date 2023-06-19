import { use, useCallback, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
const UserCreation = () => {
	const { user, error, isLoading } = useUser();
	const checkUserExistWithEmail = useCallback(async (authToken, email) => {
		const API_URL = process.env.API_URL;

		var apiOptions = {
			method: "GET",
			url: `${API_URL}/users?email=${email}`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: new URLSearchParams({}),
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
					const responseData = res.data;
					if (responseData.users.length === 0) {
						// No user with email found, hence create user
						createUserWithEmail(authToken, user);
					}
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get User Existance with: ", err);
			});
	});

	const createUserWithEmail = async (authToken, user) => {
		const API_URL = process.env.API_URL;

		var apiOptions = {
			method: "POST",
			url: `${API_URL}/users`,
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
			data: {
				username: user.nickname,
				rlName: user.name,
				regEmail: user.email,
				regPhone: 0,
			},
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				if (res.status == 200) {
					return res;
				} else {
					throw `Status ${res.status}, ${res.statusText}`;
				}
			})
			.catch(function (err) {
				console.error("Failed to get Create User with: ", err);
			});
	};

	useEffect(() => {
		// Check if the user exists. If not, create a new user for this user
		const authToken = localStorage.getItem("authorisation_token");

		if (authToken === undefined) {
			console.error("Authorisation Token returned Undefined.");
		}

		if (user !== undefined) {
			checkUserExistWithEmail(authToken, user.email).then((res) => {});
		}
	}, [checkUserExistWithEmail]);
	return;
};
export default UserCreation;
