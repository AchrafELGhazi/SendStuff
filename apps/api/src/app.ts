import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import apiRoutes from './routes/api'

dotenv.config()

const app: Express = express()

app.use(helmet())

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}))

app.use(morgan('combined'))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRoutes)

// app.use('/:path*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Endpoint not found',
//     })
// })

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', error)

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
})

export default app