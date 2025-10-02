import 'module-alias/register';
import dotenv from 'dotenv'
dotenv.config()
import express, { NextFunction, Request, Response } from 'express'
import dbConnect from './config/database';
import { errorHandler } from './middleware/handleErrors';
const port = process.env.PORT
import integrationRoutes from './routes/integration';
import cors from "cors";

const app = express()
app.use(cors())

app.use(express.json())
const baseUrl = '/api/v1'

app.use(`${baseUrl}/integrations`, integrationRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    if(err) {
        errorHandler(err, req, res, next)
    }else{
        next()
    }
})

const startServer = async () => {
    await dbConnect()
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`)
    })
}

startServer()