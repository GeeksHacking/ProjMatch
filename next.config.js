/** @type {import('next').NextConfig} */

require("dotenv").config()

module.exports = {
  reactStrictMode: true,
  env: {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    API_URL: process.env.API_URL,
    OAUTH_ID: process.env.OAUTH_ID,
    OAUTH_SECRET: process.env.OAUTH_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL
  }
}