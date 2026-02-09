import path from 'node:path'
import * as dotenv from 'dotenv'
import express from "express"
import checkConnection from './DB/db.connection.js'
import { globalErrorHandler } from './utils/response.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import cors from 'cors'
dotenv.config({ path: path.join('./src/config/.env.dev') })

const bootstrap = async () => {
    const app = express()
    const port = process.env.PORT || 5000

    //DB 
    await checkConnection()

    //convert json buffer data
    app.use(express.json())

    //routers
    app.get('/', (req, res) => {
        res.json({ message: "welcome to Smart Football App ⚽" })
    })
    app.use('/auth', authController)
    
    app.use('/user', userController)
    app.all('/*dummy', (req, res) => {
        res.status(404).json({ message: "In-valid app routing ❌" })
    })

    //error handling
    app.use(globalErrorHandler)

    //cors
    app.use(cors())


    app.listen(port, () => {
        console.log(`server is running on port ::: ${port} 🚀`)

    })
}

export default bootstrap;