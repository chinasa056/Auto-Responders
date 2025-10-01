import 'module-alias/register';
import dotenv from 'dotenv'
dotenv.config()
import express, { NextFunction, Request, Response } from 'express'
import dbConnect from './config/database';
import { errorHandler } from './middleware/handleErrors';
const port = process.env.PORT
import integrationRoutes from './routes/integration';

const app = express()

app.use(express.json())
app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    if(err) {
        errorHandler(err, req, res, next)
    }else{
        next()
    }
})
const baseUrl = '/api/v1'

app.use(`${baseUrl}/integrations`, integrationRoutes)

const startServer = async () => {
    await dbConnect()
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`)
    })
}

startServer()