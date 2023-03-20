import { query } from "express"
import mongodb from "mongodb"
const ObjectID = mongodb.ObjectId

let users

/*
User Object:

{
    "username": "",
    "rlName": "",
    "regEmail": "",
    "regPhone": "",
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
            } else if ("email" in filters) {
                userQuery = { "regEmail": { $eq: filters["email"] } }
            } else if ("ph" in filters) {
                userQuery = { "regPhone": {$eq: filters["ph"]} }
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

    static async addUser(username, rlName, regEmail, regPhone) {
        try {
            // User Structure
            const UserStruct = new makeStruct(["username", "rlName", "regEmail", "regPhone", "dateCreated", "is2FA", "userDat"])
            const UserDatStruct = new makeStruct(["rating", "skills", "aboutMe", "location", "connectedAccounts", "createdProjs"])
            const CreatedProjsStruct = new makeStruct(["openProj", "closedProj"])

            const userDoc = new UserStruct(username, rlName, regEmail, regPhone, new Date(), false, new UserDatStruct(0.0, "", "", "", {}, new CreatedProjsStruct([], [])))

            return await users.insertOne(userDoc)
        } catch (err) {
            return {error: err}
        }
    }

    static async deleteUser(id, username) {
        try {
            const deleteResponse = await users.deleteOne({
                "_id": new ObjectID(id)
            })

            if (deleteResponse.deletedCount === 0) {
                throw new Error("Delete Unsuccessful, 0 accounts deleted")
            }

            return deleteResponse
        } catch (err) {
            console.error(`Unable to delete user with username: ${username}`)
            return { error: err.message }
        }
    }

    static async updateUser(id, update) {
        try {
            const updateResponse = await users.updateOne({"_id": new ObjectID(id)}, {$set: update})

            return updateResponse
        } catch (err) {
            return { error: err.message }
        }
    }
}