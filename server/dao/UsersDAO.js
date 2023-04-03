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
    "aboutMe": "",
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
        "location": "",
        "preference": [],
        "profilePic": "",
        "profileBanner": ""
    },
    "settings": {
        "web_settings": {
            "theme": "light"
        },
        "privacy": {
            "personalisation": false
        }
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
            const UserStruct = new makeStruct(["username", "rlName", "regEmail", "regPhone", "dateCreated", "aboutMe", "userDat", "settings"])
            const UserDatStruct = new makeStruct(["rating", "skills", "location", "preference", "connectedAccounts", "createdProjs", "profilePic", "profileBanner"])
            const CreatedProjsStruct = new makeStruct(["openProj", "closedProj"])
            const SettingsStruct = new makeStruct(["web_settings", "privacy"])
            const WebSettingsStruct = new makeStruct(["theme"])
            const PrivacyStruct = new makeStruct(["personalisation"])

            const userDoc = new UserStruct(username, rlName, regEmail, regPhone, new Date(), "Hi! I'm a new user of ProjMatch!", new UserDatStruct(0.0, [], "On Earth", [], [], new CreatedProjsStruct({}, {}), "", ""), new SettingsStruct(new WebSettingsStruct("light"), new PrivacyStruct(true)))

            return await users.insertOne(userDoc)
        } catch (err) {
            return {error: err}
        }
    }

    static async deleteUser(id) {
        try {
            const deleteResponse = await users.deleteOne({
                "_id": new ObjectID(id)
            })

            if (deleteResponse.deletedCount === 0) {
                throw new Error("Delete Unsuccessful, 0 accounts deleted")
            }

            return deleteResponse
        } catch (err) {
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