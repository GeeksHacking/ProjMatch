import { query } from "express"
import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID

let users

/*
User Object:

{
    "username": "",
    "pw": "",
    "rlName": "",
    "regEmail": "",
    "regPhone": "",
    "is2FA": false,
    "dateCreated": "",
    "userDat": {
        "rating": 0.0,
        "skills": "",
        "connectedAccounts": {

        },
        "createdProjects": {
            "openProj": {

            },
            "closedProj": {

            }
        },
        "aboutMe": "",
        "location": ""
    }
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

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) { return }

        try {
            users = await conn.db("usersMain").collection("users")
        } catch(err) {
            console.error(`Cannot create a connection handle for in usersDAO with: ${err}`)
        }
    }

    static async getUsers({
        filters = null,
        page = 0,
        usersPerPage = 100
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
            cursor = await users
                .find(userQuery)
        } catch (err) {
            console.error(`Unable to find users with: ${err}`)
            return { usersList: [], totalUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)
        try {
            const usersList = await displayCursor.toArray()
            const totalUsers = await users.countDocuments(userQuery)

            return { usersList, totalUsers }
        } catch (err) {
            console.error(`Unable to convert cursor to array, or a problem occured when counting documents: ${err}`)
            
            return { usersList: [], totalUsers: 0 }
        }
    }

    static async addUser(username, pw, rlName, regEmail, regPhone) {
        try {
            // User Structure
            const UserStruct = new makeStruct(["username", "pw", "rlName", "regEmail", "regPhone", "dateCreated", "is2FA", "userDat"])
            const UserDatStruct = new makeStruct(["rating", "skills", "aboutMe", "location", "connectedAccounts", "createdProjs"])
            const CreatedProjsStruct = new makeStruct(["openProj", "closedProj"])

            const userDoc = new UserStruct(username, pw, rlName, regEmail, regPhone, new Date(), false, new UserDatStruct(0.0, "", "", "", {}, new CreatedProjsStruct([], [])))

            return await users.insertOne(userDoc)
        } catch (err) {
            return {error: err}
        }
    }

    static async deleteUser(id, username) {
        try {
            const deleteResponse = await users.deleteOne({
                _id: ObjectID(id),
                username: username
            })

            return deleteResponse
        } catch (err) {
            console.error(`Unable to delete user with username: ${username}`)
            return { error: err }
        }
    }
}