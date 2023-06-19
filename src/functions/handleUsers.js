import axios from "axios";

export const getUserDetailsFromEmail = async (authToken, email) => {
	const API_URL = process.env.API_URL;
	var apiOptions = {
		method: "GET",
		url: `${API_URL}/users?email=${email}`,
		headers: {
			Authorisation: `Bearer ${authToken}`,
		},
		data: new URLSearchParams({}),
	};

	return axios.request(apiOptions);
};

export const getUserDetailsFromID = async (authToken, userID) => {
	const API_URL = process.env.API_URL;

	if (userID === undefined) {
		console.error("User ID returned Undefined.");
		return;
	}

	var apiOptions = {
		method: "GET",
		url: `${API_URL}/users?id=${userID}`,
		headers: {
			Authorisation: `Bearer ${authToken}`,
		},
		data: new URLSearchParams({}),
	};

	return axios.request(apiOptions);
};

export const updateUserDetailsFromID = async (authToken, data, userID) => {
	const API_URL = process.env.API_URL;
	var apiOptions = {
		method: "PUT",
		url: `${API_URL}/users`,
		headers: {
			Authorisation: `Bearer ${authToken}`,
		},
		data: {
			id: userID._id,
			update: data,
		},
	};

	return axios.request(apiOptions);
};
