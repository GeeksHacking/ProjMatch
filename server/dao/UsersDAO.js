import { query } from "express"
import mongodb from "mongodb"
const ObjectID = mongodb.ObjectID

let users

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) { return }

        try {
            users = await conn.db("users").collection("users")
        } catch(err) {
            console.error(`Cannot create a connection handle in usersDAO with: ${err}`)
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
                userQuery = { "user": { $eq: filters["user"] } }
            } else if ("pw" in filters) {
                userQuery = { "pw": { $eq: filters["pw"] } }
            }
        }

        let cursor
        try {
            cursor = await users
                .find(userQuery)
        } catch (err) {
            console.err(`Unable to find users with: ${err}`)
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

    static async addUser(user, pw, date) {
        try {
            const userDoc = {
                user: user,
                pw: pw,
                date: date,
            }
            console.log(userDoc)
            console.log(users)
            return await users.insertOne(userDoc)
        } catch (err) {
            return {error: err}
        }
    }
}