import axios from "axios";
class PMApi {
	constructor(authToken) {
		this.baseUrl = process.env.API_URL;
		axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
	}
	#makeQueryStr(data) {
		let querystr = "";
		let prefix = "";
		for (const key in data) {
			querystr += `${prefix}${key}=${data[key]}`;
			prefix = "&";
		}
		return querystr;
	}
	async getPosts(options = false) {
		let querystr = "";
		if (options) {
			querystr = "?" + this.#makeQueryStr(options);
		}
		try {
			const { data } = await axios.get(`${this.baseUrl}/posts${querystr}`);
			return data;
		} catch (err) {
			throw new Error(`failed to get posts with err:\n${err}`);
			return -1;
		}
	}
	async updatePost(postId, updatedProj) {
		try {
			await axios.put(`${this.baseUrl}/posts`, {
				id: postId,
				update: updatedProj,
			});
			return 0
		} catch (err) {
			throw new Error(`failed to update posts with err:\n${err}`);
			return -1;
		}
	}
	async createPost(
		projName,
		projDesc,
		projMakerId,
		projContact,
		projTags,
		projTech,
		projImg
	) {
		try {
			const { data } = await axios.post(`${this.baseUrl}/posts`, {
				projectName: projName,
				description: projDesc,
				creatorUserID: projMakerId,
				contact: projContact,
				tags: projTags,
				technologies: projTech,
				images: projImg,
			});
			return data;
		} catch (err) {
			throw new Error(`failed to create posts with err:\n${err}`);
			return -1;
		}
	}
	async deletePosts(postId) {
		try {
			await axios.delete(`${this.baseUrl}/posts`, {
				id: postId,
			});
			return 0
		} catch (err) {
			throw new Error(`failed to delete posts with err:\n${err}`);
			return -1;
		}
	}
	async getUsers(options = false) {
		let querystr = "";
		if (options) {
			querystr = "?" + this.#makeQueryStr(options);
		}
		try {
			const { data } = await axios.get(`${this.baseUrl}/users${querystr}`);
			return data;
		} catch (err) {
			console.log(
				`failed to get users with err:\n${err}\nrequest:${this.baseUrl}/users${querystr}`
			);
			return -1;
		}
	}
	async updateUser(userId, updatedUser) {
		try {
			await axios.put(`${this.baseUrl}/users`, {
				id: userId,
				update: updatedUser,
			});
			return 0
		} catch (err) {
			console.log(`failed to update users with err:\n${err}`);
			return -1;
		}
	}
	async createUser(userNick, userName, userEmail) {
		try {
			const { data } = await axios.post(`${this.baseUrl}/posts`, {
				username: userNick,
				rlName: userName,
				regEmail: userEmail,
				regPhone: 0,
			});
			return data;
		} catch (err) {
			console.log(`failed to create user with err:\n${err}`);
			return -1;
		}
	}
	async createImgUrl(images) {
		try {
			const { data } = await axios.post(`${this.baseUrl}/images`, images, {
				"Content-Type": "multipart/form-data",
			});
			return data;
		} catch (err) {
			console.log(`failed to create img with err:\n${err}`);
			return -1;
		}
	}
	async sendEmail(subject,content) {
		try {
			await axios.post(`${this.baseUrl}/email`, {
				subject: subject,
				text: content,
			});
			return 0;
		} catch (err) {
			console.log(`failed to create img with err:\n${err}`);
			return -1;
		}
	}
}
export default PMApi;
