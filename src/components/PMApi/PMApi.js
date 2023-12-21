import axios from "axios";
class PMApi {
	constructor(authToken) {
		this.baseUrl = process.env.API_URL;
		this.v2BaseUrl = "http://localhost:8080/api/v2";
		this.basePagelength=100;
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
			querystr+=`&postsPerPage=${this.basePagelength}`
		}
		querystr+=`?postsPerPage=${this.basePagelength}`
		try {
			const { data } = await axios.get(`${this.baseUrl}/posts${querystr}`);
			return data;
		} catch (err) {
			throw new Error(`failed to get posts with err:\n${err}`);
		}
	}
	async updatePost(postId, updatedProj) {
		try {
			const { data } = await axios.put(`${this.baseUrl}/posts`, {
				id: postId,
				update: updatedProj,
			});
			return data;
		} catch (err) {
			throw new Error(`failed to update posts with err:\n${err}`);
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
		}
	}
	async deletePosts(postId) {
		try {
			const { data } = await axios.delete(`${this.baseUrl}/posts`, {
				data: {
					id: postId,
				},
			});
			return data;
		} catch (err) {
			throw new Error(`failed to delete posts with err:\n${err}`);
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
			throw new Error(
				`failed to get users with err:\n${err}\nrequest:${this.baseUrl}/users${querystr}`
			);
		}
	}
	async updateUser(userId, updatedUser) {
		try {
			const { data } = await axios.put(`${this.baseUrl}/users`, {
				id: userId,
				update: updatedUser,
			});
			return data;
		} catch (err) {
			throw new Error(`failed to update users with err:\n${err}`);
		}
	}
	async createUser(username, contact, about, algoData, skills) {
		try {
			const { data } = await axios.post(`${this.v2BaseUrl}/users`, {
				username: username,
				contact: contact, 
				about: about, 
				algoData: algoData, 
				skills: skills
			});
			return data;
		} catch (err) {
			throw new Error(`failed to create user with err:\n${err}`);
		}
	}
	async createImgUrl(images) {
		try {
			const { data } = await axios.post(`${this.baseUrl}/images`, images, {
				"Content-Type": "multipart/form-data",
			});
			return data;
		} catch (err) {
			throw new Error(`failed to create img with err:\n${err}`);
		}
	}
	async sendEmail(subject, content) {
		try {
			const { data } = await axios.post(`${this.baseUrl}/email`, {
				subject: subject,
				text: content,
			});
			return data;
		} catch (err) {
			throw new Error(`failed to create img with err:\n${err}`);
		}
	}

	async deleteUsers(userId) {
		try {
			await axios.delete(`${this.baseUrl}/users`, {
				data: {
					id: userId,
				},
			});
			return 0;
		} catch (err) {
			throw new Error(`failed to delete users with err:\n${err}`);
		}
	}
}
export default PMApi;
