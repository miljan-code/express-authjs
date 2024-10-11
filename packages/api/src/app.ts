import express, { type Request, type Response } from "express"
import logger from "morgan"
import {
  errorHandler,
  errorNotFoundHandler,
} from "./middleware/error.middleware.js"
import {
  authenticatedUser,
  currentSession,
} from "./middleware/auth.middleware.js"

import { ExpressAuth } from "@auth/express"
import { authConfig } from "./config/auth.config.js"

export const app = express()

app.set("port", process.env.PORT || 3000)

// Trust Proxy for Proxies (Heroku, Render.com, Docker behind Nginx, etc)
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.set("trust proxy", true)

app.use(logger("dev"))

// Parse incoming requests data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set session in res.locals
app.use(currentSession)

// Set up ExpressAuth to handle authentication
// IMPORTANT: It is highly encouraged set up rate limiting on this route
app.use("/api/auth/*", ExpressAuth(authConfig))

app.get(
  "/api/protected",
  authenticatedUser,
  async (_req: Request, res: Response) => {
    res.json(res.locals.session)
  }
)

app.get("/", async (_req: Request, res: Response) => {
  res.json({
    title: "Express Auth Example",
    user: res.locals.session?.user,
  })
})

app.use(errorNotFoundHandler)
app.use(errorHandler)
