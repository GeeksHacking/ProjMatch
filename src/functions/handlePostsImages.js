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
