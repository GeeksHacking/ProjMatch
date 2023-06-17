import axios from "axios";

export const createS3Images = async (authToken, data) => {
	const API_URL = process.env.API_URL;
	var apiOptions = {
		method: "POST",
		url: `${API_URL}/images`,
		headers: {
			Authorisation: `Bearer ${authToken}`,
			"Content-Type": "multipart/form-data",
		},
		data: data,
	};

	return axios.request(apiOptions);
};

export const getPostsWithCreatorID = async (authToken, uid) => {
	const API_URL = process.env.API_URL;
	var apiOptions = {
		method: "GET",
		url: `${API_URL}/posts?userID=${uid}`,
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		data: new URLSearchParams({}),
	};

	return axios.request(apiOptions);
};

export const getPostsWithID = async (authToken, pid) => {
	const API_URL = process.env.API_URL;
	var apiOptions = {
		method: "GET",
		url: `${API_URL}/posts?id=${pid}`,
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		data: new URLSearchParams({}),
	};

	return axios.request(apiOptions);
};
