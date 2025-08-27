import { Router, type IRouter } from 'express'

import authRoutes from './auth.route'

const router: IRouter = Router()

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SendStuff API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    })
})

router.use('/auth', authRoutes)

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SendStuff API v1',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            health: '/api/v1/health'
        },
        documentation: 'https://docs.sendstuff.com/api/v1'
    })
})

export default router