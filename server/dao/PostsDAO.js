import { query } from "express"
import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID

let posts

/*
Post Object

{
    "projectName": "",
    "description": "",
    "creatorUserID": "",
    "rating": "",
    "tags": [],
    "technologies": [],
    "images": []
}

*/

function makeStruct(keys) {
    if (!keys) return null;
    const count = keys.length;
    
    /** @constructor */
    function constructor() {
        for (let i = 0; i < count; i++) this[keys[i]] = arguments[i];
    }
    return constructor;
}

export default class PostsDAO {
    static async injectDB(conn) {
        if (posts) { return }

        try {
            posts = await conn.db("usersMain").collection("posts")
        } catch(err) {
            console.error(`Cannot create a connection handle for in postsDAO with: ${err}`)
        }
    }

    static async getPosts({
        filters = null,
        page = 0,
        postsPerPage = 100
    } = {}) {
        let userQuery

        if(filters) {
            if("user" in filters) {
                userQuery = { "username": { $eq: filters["user"] } }
            } else if ("pw" in filters) {
                userQuery = { "pw": { $eq: filters["pw"] } }
            }
        }

        let cursor
        try {
            cursor = await posts
                .find(userQuery)
        } catch (err) {
            console.error(`Unable to find posts with: ${err}`)
            return { postsList: [], totalposts: 0 }
        }

        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page)
        try {
            const postsList = await displayCursor.toArray()
            const totalPosts = await posts.countDocuments(userQuery)

            return { postsList, totalPosts }
        } catch (err) {
            console.error(`Unable to convert cursor to array, or a problem occured when counting documents: ${err}`)
            
            return { postsList: [], totalPosts: 0 }
        }
    }
    
    static async addProject(projectName, description, creatorUserID, rating, tags, technologies, images) {
        try {
            const PostStruct = new makeStruct("projectName", "description", "creatorUserID", "rating", "tags", "technologies", "images")

            const createdProj = new PostStruct(projectName, description, creatorUserID, rating, tags, technologies, images)

            return await posts.insertOne(createdProj)
        } catch (err) {
            return { error: err }
        }
    }
}