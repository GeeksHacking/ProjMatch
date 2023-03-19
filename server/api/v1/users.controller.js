import UsersDAO from "../../dao/UsersDAO.js"

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 100
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.user) {
            filters.user = req.query.user
        } else if (req.query.pw) {
            filters.pw = req.query.pw
        }

        const { usersList, totalUsers } = await UsersDAO.getUsers({
            filters,
            page,
            usersPerPage
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            usersPerPage: usersPerPage,
            totalUsers: totalUsers
        }
        res.json(response)
    }

    static async apiPostUsers(req, res, next) {
        try {
            const username = req.body.username
            const pw = req.body.pw
            const rlName = req.body.rlName
            const regEmail = req.body.regEmail
            const regPhone = req.body.regPhone

            const reviewRes = await UsersDAO.addUser(username, pw, rlName, regEmail, regPhone)
            res.json({ status: "success" })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdateUsers(req, res, next) {
        const username = req.body.username
        const pw = req.body.pw
        const rlName = req.body.rlName
        const regEmail = req.body.regEmail
        const regPhone = req.body.regPhone
        const userDat = req.body.userDat

        // TODO
    }

    static async apiDeleteUsers(req, res, next) {
        try {
            const id = req.query.id
            const username = req.body.username

            const reviewRes = await UsersDAO.deleteUser(id, username)
            res.json({ status: "success" })
        } catch (err) {
            res.status(500).json({ error: `Unable to delete user: ${username} as ${err.message}` })
        }
    }
}