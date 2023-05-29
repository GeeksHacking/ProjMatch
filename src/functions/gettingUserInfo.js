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

    await axios.request(apiOptions).catch(function (err) {
        console.error("Failed to get User with: ", err);
    }.then((res) => {
        if (res.status == 200) {
            return res.data.users[0];
        } else {
            throw `Status ${res.status}, ${res.statusText}`;
        }
    }));
};
