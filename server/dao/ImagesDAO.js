import AWS from "aws-sdk"
import { UUID } from "bson"
import dotenv from "dotenv"
import { createHash } from "crypto"

dotenv.config()

// Config Amazon AWS S3
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECURITY_KEY,
    region: process.env.REGION,
    Bucket: process.env.AWS_BUCKET
})

export default class ImagesDAO {
    static async getImages(filters = null) {
        let query
        if (filters) {
            if ("projectName" in filters) {
                query.projectName = filters.projectName
            } else {
                return "GET Request for Images requires the ProjectName"
            }

            if ("userID" in filters) {
                query.userID = filters.userID
            } else {
                return "GET Request for Images requires the User ID"
            }
        }
    }

    static async addImages(projectName, creatorUserID, images) {
        try {
            let results = Array.apply(null, Array(images.length)).map(function () {})
            for (let i = 0; i < images.length; i++) {
                const hashedURL = createHash("sha256").update(`${projectName} | ${creatorUserID}`).digest("hex")
                const fileType= images[i].mimetype.split("/")[1]
                const param = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${hashedURL}/${new UUID()}.${fileType}`,
                    Body: images[i].buffer
                }

                const response = await S3.upload(param).promise()
                results[i] = response
            }

            return results
        } catch (err) {
            return {error: err}
        }
    }

    static async editImages() {
        // TODO
    }

    static async deleteImages(folderName, imageNames) {
        try {
            let results = Array.apply(null, Array(imageNames.length)).map(function () {}) 
            for (let i = 0; i < imageNames.length; i++) {
                const param = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${folderName}/${imageNames[i]}`
                }

                const res = await S3.deleteObject(param).promise()
                results[i] = res
            }

            return results
        } catch (err) {
            return { error: err }
        }
    }
}