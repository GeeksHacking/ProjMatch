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

    return axios.request(apiOptions)
};
